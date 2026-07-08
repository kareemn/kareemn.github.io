"""Fly-inspired sparse expansion on MNIST.

This is the small public version of the experiment described in:
https://kareem.me/research/flys-trick.html

It is intentionally simple:

pixels -> sparse random expansion -> top-k sparse tag -> local readout

The feature extractor is frozen and random. The optional ``delta`` readout is a
single local error-Hebbian layer: presynaptic tag activity times postsynaptic
target-minus-softmax error. There is no backpropagation through the feature
extractor.

Example:
  python3 fly_sparse_mnist.py --mnist-pkl mnist.pkl.gz --readout delta
  python3 fly_sparse_mnist.py --digits --readout delta
"""

import argparse
import gzip
import os
import pickle
import time

import numpy as np


def load_mnist_pkl(path, ntr, nte):
    with gzip.open(path) as f:
        train, _, test = pickle.load(f, encoding="latin1")
    Xtr = train[0].astype(np.float32)
    ytr = train[1].astype(np.int64)
    Xte = test[0].astype(np.float32)
    yte = test[1].astype(np.int64)
    return Xtr[:ntr], ytr[:ntr], Xte[:nte], yte[:nte]


def load_digits():
    try:
        from sklearn.datasets import load_digits
    except ImportError as exc:
        raise SystemExit("--digits requires scikit-learn. Install it, or use --mnist-pkl.") from exc

    d = load_digits()
    X = (d.images.reshape(len(d.images), -1) / 16.0).astype(np.float32)
    y = d.target.astype(np.int64)
    cut = int(0.8 * len(X))
    return X[:cut], y[:cut], X[cut:], y[cut:]


def sparse_projection(n_features, n_pixels, fan_in, seed):
    rng = np.random.default_rng(seed)
    rows = np.repeat(np.arange(n_features), fan_in)
    cols = rng.integers(0, n_pixels, size=n_features * fan_in)
    vals = rng.standard_normal(n_features * fan_in).astype(np.float32)
    W = np.zeros((n_features, n_pixels), dtype=np.float32)
    np.add.at(W, (rows, cols), vals)
    W /= np.linalg.norm(W, axis=1, keepdims=True) + 1e-8
    return W


def topk_tags(X, W, k, chunk=4096):
    out = np.empty((X.shape[0], k), dtype=np.int32)
    for start in range(0, X.shape[0], chunk):
        acts = np.abs(X[start:start + chunk] @ W.T)
        out[start:start + acts.shape[0]] = np.argpartition(-acts, k - 1, axis=1)[:, :k]
    return out


def nearest_class_mean(win_tr, ytr, win_te, yte, n_features):
    class_means = np.zeros((10, n_features), dtype=np.float64)
    for c in range(10):
        rows = win_tr[ytr == c]
        np.add.at(class_means[c], rows.ravel(), 1.0)
        class_means[c] /= max(1, rows.shape[0])
    class_means -= class_means.mean(0, keepdims=True)

    correct = 0
    for winners, target in zip(win_te, yte):
        scores = class_means[:, winners].sum(1)
        correct += int(scores.argmax() == target)
    return correct / len(yte)


def make_sparse_design(win, n_features):
    from scipy.sparse import csr_matrix

    n, k = win.shape
    indptr = np.arange(0, n * k + 1, k)
    data = np.ones(n * k, dtype=np.float32)
    return csr_matrix((data, win.ravel(), indptr), shape=(n, n_features))


def delta_readout(win_tr, ytr, win_te, yte, n_features, epochs=30, lr=0.5,
                  batch=256, seed=0, wd=0.0):
    Ttr = make_sparse_design(win_tr, n_features)
    Tte = make_sparse_design(win_te, n_features)
    Y = np.eye(10, dtype=np.float32)[ytr]
    W = np.zeros((n_features, 10), dtype=np.float32)
    rng = np.random.default_rng(seed)

    for _ in range(epochs):
        for _ in range(0, Ttr.shape[0], batch):
            idx = rng.integers(0, Ttr.shape[0], size=batch)
            Tb = Ttr[idx]
            logits = Tb @ W
            logits -= logits.max(1, keepdims=True)
            probs = np.exp(logits)
            probs /= probs.sum(1, keepdims=True)
            err = Y[idx] - probs
            W += lr * (Tb.T @ err) / batch
        if wd:
            W *= 1.0 - wd

    return float(((Tte @ W).argmax(1) == yte).mean())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--mnist-pkl", default="mnist.pkl.gz")
    parser.add_argument("--digits", action="store_true", help="Use sklearn's tiny digits dataset.")
    parser.add_argument("--ntr", type=int, default=50000)
    parser.add_argument("--nte", type=int, default=10000)
    parser.add_argument("--features", default="400,800,2000,4000,8000,16000,32000,64000")
    parser.add_argument("--fan-in", type=int, default=12)
    parser.add_argument("--k-frac", type=float, default=0.05)
    parser.add_argument("--k-abs", type=int, default=0,
                        help="Fixed active tag size; overrides --k-frac when positive.")
    parser.add_argument("--chunk", type=int, default=512,
                        help="Rows per dense projection batch; lower this for large feature counts.")
    parser.add_argument("--readout", choices=["ncm", "delta"], default="delta")
    parser.add_argument("--seed", type=int, default=0)
    args = parser.parse_args()

    t0 = time.time()
    if args.digits:
        Xtr, ytr, Xte, yte = load_digits()
    else:
        if not os.path.exists(args.mnist_pkl):
            raise SystemExit(f"MNIST pickle not found: {args.mnist_pkl}. Try --digits for a smoke test.")
        Xtr, ytr, Xte, yte = load_mnist_pkl(args.mnist_pkl, args.ntr, args.nte)

    print(f"train={Xtr.shape} test={Xte.shape} readout={args.readout}", flush=True)
    print(f"{'F':>6} {'k':>5} {'expand':>7} | {'test acc':>8}", flush=True)
    print("-" * 33, flush=True)
    for n_features in [int(x) for x in args.features.split(",")]:
        k = args.k_abs if args.k_abs > 0 else max(1, int(round(args.k_frac * n_features)))
        proj = sparse_projection(n_features, Xtr.shape[1], args.fan_in, args.seed)
        win_tr = topk_tags(Xtr, proj, k, chunk=args.chunk)
        win_te = topk_tags(Xte, proj, k, chunk=args.chunk)
        if args.readout == "ncm":
            acc = nearest_class_mean(win_tr, ytr, win_te, yte, n_features)
        else:
            acc = delta_readout(win_tr, ytr, win_te, yte, n_features, seed=args.seed)
        print(f"{n_features:>6} {k:>5} {n_features / Xtr.shape[1]:>6.1f}x | {acc:>8.4f}", flush=True)
    print(f"elapsed={time.time() - t0:.1f}s", flush=True)


if __name__ == "__main__":
    main()
