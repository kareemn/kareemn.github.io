const dialog = document.getElementById('qr-dialog');
const enlarge = document.getElementById('enlarge');
if (typeof dialog.showModal === 'function') {
  enlarge.hidden = false;
  enlarge.addEventListener('click', () => dialog.showModal());
  document.getElementById('close-qr').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
}
