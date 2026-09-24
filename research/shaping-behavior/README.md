# Section sharing

Each `.html` file is a static, section-specific Open Graph entry point. Its
`og:url` and canonical URL identify that share page, so crawlers do not collapse
all six previews into the whole-essay card. `noindex, follow` keeps these utility
pages out of search results. There is deliberately no HTTP or meta-refresh
redirect: ordinary browsers navigate to the essay anchor with JavaScript, while
non-JavaScript clients can read the summary and follow a normal link.

Hash fragments alone cannot select server-delivered metadata. Use the essay's
**Copy section link** controls or one of these paths:

- `shaping.html`
- `evaluation.html`
- `evidence.html`
- `swarm.html`
- `safeguards.html`
- `questions.html`

## Regeneration

Edit `sections.json` for titles, anchors, descriptions and card line breaks.
The contour geometry is read from the canonical essay. With Node.js and `sharp`
available, run from the repository root:

```sh
node scripts/build-section-previews.cjs
```

If `sharp` is installed outside this project, set `NODE_PATH` to its parent
`node_modules` directory. Commit the generated HTML and SVG/PNG files; GitHub
Pages needs no extra build step. When replacing a deployed card, increment its
`imageVersion` in `sections.json` to avoid stale social image caches. Keep the
matching `data-section-share` links in the essay in sync if slugs change.

Previews are supplied in static OG and Twitter metadata. Individual sharing
apps can cache or omit cards; crawler metadata checks do not guarantee display
on every platform.
