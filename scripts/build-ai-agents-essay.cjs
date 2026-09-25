// Regenerate the essay from the approved Markdown and diagram source.
// Requires marked. GIFs are pre-rendered and committed alongside their posters.
const fs = require('node:fs');
const path = require('node:path');
const { marked } = require('marked');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, s) => fs.writeFileSync(path.join(root, p), s);
const esc = s => s.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const draft = read('research/shaping-behavior/essay.md');
const source = read('research/ai-agents-diagrams.source.html');
const title = draft.match(/^# (.+)/)[1];
const subtitle = draft.match(/^\*(.+)\*$/m)[1];
const articlePath = 'research/the-ai-agents-were-helpful-to-each-other.html';
const legacyPath = 'research/the-algorithm-is-not-the-policy.html';
const articleURL = 'https://kareem.me/' + articlePath;
const old = read(articlePath);
const sections = [
  ['a-simple-optimization-process-can-produce-something-much-more-complicated-than-itself', 'shaping'],
  ['context-brings-different-patterns-into-play', 'context'],
  ['useful-habits-learn-to-work-together', 'habits'],
  ['what-actually-happened', 'evidence'],
  ['this-changes-how-i-think-about-alignment-evals', 'evaluation'],
  ['what-about-safeguards', 'safeguards']
];
const headingTexts = [...draft.matchAll(/^## \d\. (.+)$/gm)].map(m => m[1]);
const aliases = ids => ids.map(id => `<div class="anchor-alias" id="${id}" aria-hidden="true"></div>`).join('');
const figureSpecs = {
  '1': ['training', 'visual-1', []],
  '2': ['context', 'context-patterns', []],
  '3': ['habits', 'training-pressures', ['policy-composition','we-don-t-train-one-objective-anymore']],
  '4': ['boundary', 'oversight-boundary', []],
  '5a': ['alignment', 'visual-4', ['visual-5','correcting-oversight-behavior','1-behavioral-generalization']],
  '5b': ['bees', 'bee-and-colony', ['visual-6','3-swarm-alignment']],
  '6': ['safeguards', 'safety-layers', ['4-safety-outside-the-model']]
};
function picture(scene, alt) {
  const stem = scene === 'alignment' ? 'evaluation-v4' : 'bee-colony-v2';
  const sizes = {};
  for (const layout of ['mobile', 'desktop']) {
    const gif = fs.readFileSync(path.join(root, 'images/ai-agents-v1', `${stem}-${layout}-light.gif`));
    sizes[layout] = [gif.readUInt16LE(6), gif.readUInt16LE(8)];
  }
  let result = `<picture class="story-motion" data-animation="${scene}">`;
  for (const reduce of [true,false]) for (const theme of ['dark','light']) for (const layout of ['mobile','desktop']) {
    if (!reduce && theme === 'light' && layout === 'desktop') continue;
    const media = [reduce && '(prefers-reduced-motion: reduce)', theme === 'dark' && '(prefers-color-scheme: dark)', layout === 'mobile' && '(max-width: 679px)'].filter(Boolean).join(' and ');
    const [w,h] = sizes[layout];
    result += `<source media="${media}" srcset="../images/ai-agents-v1/${stem}-${layout}-${theme}${reduce?'-still.png':'.gif'}" width="${w}" height="${h}">`;
  }
  const [w,h] = sizes.desktop;
  return result + `<img class="story-gif" src="../images/ai-agents-v1/${stem}-desktop-light.gif" width="${w}" height="${h}" alt="${alt}" loading="lazy" decoding="async"></picture>`;
}
let figureNumber = 0;
let body = draft.split('<!-- BODY START -->')[1].split('<!-- BODY END -->')[0];
body = body.replace(/<!-- VISUAL (\w+): [\s\S]*?-->\s*\n\*([^\n]+)\*/g, (_, key, caption) => {
  const [scene, id, legacy] = figureSpecs[key];
  const block = source.match(new RegExp('<section[^>]*aria-labelledby="six-'+scene+'-title"[\\s\\S]*?</section>'))[0];
  const heading = block.match(/<h3[^>]*>(.*?)<\/h3>/)[1].replace(/^\d[a-z]?\. /,'');
  const svg = block.match(/<svg[\s\S]*?<\/svg>/)[0];
  const alt = svg.match(/aria-label="([^"]+)"/)[1];
  const sceneMarkup = ['alignment','bees'].includes(scene) ? picture(scene,alt) : svg;
  return `${aliases(legacy)}<figure class="diagram story-figure" id="${id}" aria-labelledby="${id}-title"><header class="diagram-head"><span class="figure-number">Figure ${String(++figureNumber).padStart(2,'0')}</span><h3 id="${id}-title">${heading}</h3></header>${sceneMarkup}<figcaption>${marked.parseInline(caption)}</figcaption></figure>\n`;
});
// Link numeric citations to the actual source list, keeping the draft's numbering.
const refIds = ['ref-metr','ref-compression','ref-representations','ref-queen-signaling','ref-queen-replacement','ref-cot-monitoring','ref-finches','ref-queen-pheromones'];
body = body.replace(/\[(\d+(?:, \d+)*)\]/g, (_, nums) => '<sup class="citation">'+nums.split(', ').map(n=>`<a href="#${refIds[Number(n)-1]}" aria-label="Source ${n}">[${n}]</a>`).join(' ')+'</sup>');
body = marked.parse(body);
let headingIndex = 0;
body = body.replace(/<h2>\d\. (.*?)<\/h2>/g, (_, text) => {
  const [anchor,slug] = sections[headingIndex++];
  return `<h2 id="${anchor}">${text}</h2>\n<div class="section-share-row"><a class="section-share" data-section-share href="shaping-behavior/${slug}.html" aria-label="Copy section link: ${esc(text)}"><span>Copy section link</span></a></div>`;
});
for (const [needle, ids] of [
  ['The scorer story adds', ['visual-2','visual-3','2-evaluator-aware-systems']],
  ['Connecting agents changes', ['and-then-there-is-the-swarm','shared-discovery']],
  ['Monitoring needs enough', ['safeguard-observation-scope']],
  ['There is also a feedback', ['safeguard-optimization-environment']],
  ["What changed my mind wasn", ['the-questions-i-think-we-should-be-asking','why-i-don-t-think-this-requires-anthropomorphizing-ai']]
]) body = body.replace('<p>'+needle, aliases(ids)+'<p>'+needle);
const references = draft.split('## Sources')[1].trim().split('\n').filter(Boolean).map((line,i)=>`<li id="${refIds[i]}"><p>${marked.parseInline(line.replace(/^\d+\. /,''))}</p></li>`).join('\n');
const oldRefAliases = aliases(['ref-exploitgym','ref-goodhart','ref-ai-safety','ref-bee-foraging','ref-bee-decisions']);
const refs = `<section class="article-reference" aria-labelledby="reference"><h2 id="reference">Sources</h2>${oldRefAliases}<ol class="reference-list">${references}</ol><p><a href="./">← All research notes</a></p></section>`;
const countText = body.replace(/<svg[\s\S]*?<\/svg>/g,'').replace(/<div class="section-share-row">[\s\S]*?<\/div>/g,'').replace(/<sup[\s\S]*?<\/sup>/g,'').replace(/<[^>]+>/g,' ').replace(/&[^;]+;/g,'x');
const words = countText.trim().split(/\s+/).length;
const minutes = Math.ceil(words / 220);
let header = old.split('<details class="article-contents"')[0];
header = header.replace(/<title>.*?<\/title>/, `<title>${esc(title)} - Kareem Nassar</title>`)
  .replace(/(<link rel="canonical" href=")[^"]+/, '$1'+articleURL)
  .replace(/(<meta property="og:url" content=")[^"]+/, '$1'+articleURL)
  .replace(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]+/, '$1'+esc(title))
  .replace(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]+/g, '$1'+esc(title))
  .replace(/(<meta (?:property|name)="(?:description|og:description|twitter:description)" content=")[^"]+/g, '$1'+esc(subtitle))
  .replace(/og-optimizer-policy-v4\.png/g,'og-helpful-agents-v1.png')
  .replace(/(<meta property="og:image:width" content=")\d+/, '$11200')
  .replace(/(<meta property="og:image:height" content=")\d+/, '$1630')
  .replace(/(<meta (?:property|name)="(?:og:image:alt|twitter:image:alt)" content=")[^"]+/g, '$1'+esc(title+'. Separate learned policies connected by communication arrows. Kareem Nassar.'))
  .replace(/<h1>.*?<\/h1>/,`<h1>${esc(title)}</h1>`)
  .replace(/<p class="dek">.*?<\/p>/,`<p class="dek"><em>${esc(subtitle)}</em></p>`)
  .replace(/\d+ min read/,`${minutes} min read`)
  .replace(/    <script>\s*window\.MathJax[\s\S]*?<\/script>\s*<script id="mathjax"[^>]*><\/script>\n/,'');
if (!header.includes('ai-agents-diagrams.css')) header=header.replace('  </head>', '    <link rel="stylesheet" href="ai-agents-diagrams.css?v=1" />\n    <script defer src="ai-agents-diagrams.js?v=1"></script>\n  </head>');
header=header.replace(/ai-agents-diagrams\.(css|js)\?v=\d+/g,'ai-agents-diagrams.$1?v=4');
const toc = `<details class="article-contents" open><summary>In this essay <span>6 sections</span></summary><ol>${sections.map(([anchor],i)=>`<li><a href="#${anchor}">${esc(headingTexts[i])}</a></li>`).join('')}</ol></details>`;
let footer = '</article>'+old.split('</article>')[1];
footer=footer.replace(/\s*document\.getElementById\('mathjax'\)[\s\S]*?\}\);/,'');
write(articlePath, header+toc+'\n<div class="essay-body" id="essay-six-step-storyboard">\n'+body+'</div>\n'+refs+'\n'+footer);
// GitHub Pages serves static files: preserve old links with a browser redirect,
// a canonical URL for crawlers, and a normal link when JavaScript is unavailable.
const redirectMetadata = header.match(/    <meta (?:property|name)="(?:og:[^"]+|twitter:[^"]+)"[^>]*>/g).join('\n');
write(legacyPath, `<!doctype html>
<!-- Generated by scripts/build-ai-agents-essay.cjs. This URL remains for existing links. -->
<html lang="en"><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)} - Kareem Nassar</title>
  <meta name="description" content="${esc(subtitle)}" />
  <link rel="canonical" href="${articleURL}" />
${redirectMetadata}
  <link rel="stylesheet" href="research.css?v=14" />
</head><body><main class="wrapper">
  <h1>${esc(title)}</h1>
  <p>This essay has moved. <a id="essay-destination" href="/${articlePath}">Read it at its new address →</a></p>
  <p><em>${esc(subtitle)}</em></p>
</main><script>
  const destination = ${JSON.stringify('/'+articlePath)} + window.location.search + window.location.hash;
  document.getElementById('essay-destination').href = destination;
  window.location.replace(destination);
</script></body></html>
`);
const css=source.match(/<style>([\s\S]*?)<\/style>/)[1];
write('research/ai-agents-diagrams.css', css+`\n/* Integration with the research site's existing typography and theme. */
#essay-six-step-storyboard { --foreground:var(--fg); --background:var(--bg); --muted-foreground:var(--muted); --viz-series-1:var(--diagram-blue); --viz-series-2:var(--diagram-amber); }
#essay-six-step-storyboard .story-figure { max-width:760px; margin:2.5rem auto; padding:1.4rem 0; border:0; border-top:1px solid var(--border); border-radius:0; background:transparent; }
#essay-six-step-storyboard .story-figure h3 { min-height:0; margin:0; }
#essay-six-step-storyboard .story-scene { max-width:420px; margin:0 auto; font-size:14px; }
#essay-six-step-storyboard .story-scene[data-scene="boundary"] { max-width:640px; }
#essay-six-step-storyboard .story-scene .text-small { font-size:12px; }
#essay-six-step-storyboard .story-motion { display:block; }
#essay-six-step-storyboard .story-gif { display:block; width:100%; max-width:640px; height:auto; margin:0 auto; }
#essay-six-step-storyboard .anchor-alias { display:block; scroll-margin-top:1.5rem; }
#essay-six-step-storyboard .citation { white-space:nowrap; font-size:.72em; }
@media(max-width:679px) { #essay-six-step-storyboard .story-gif { max-width:420px; } }
@media(max-width:380px) { .wrapper { padding:1rem; } }
`);
write('research/ai-agents-diagrams.js', '// Generated from ai-agents-diagrams.source.html.\n'+source.match(/<script>([\s\S]*?)<\/script>/)[1].trim()+'\n');
for(const file of ['index.html','research/index.html']) {
  let s=read(file).replaceAll('Drawing Boundaries With a Blunt Tool',esc(title)).replaceAll('What the Hugging Face agent incident shows about shaping AI behavior',esc(subtitle)).replaceAll('the-algorithm-is-not-the-policy.html','the-ai-agents-were-helpful-to-each-other.html');
  if(file==='research/index.html')s=s.replace(/\d+ min read/,`${minutes} min read`);
  write(file,s);
}
console.log(`${words} words; ${minutes} min at 220 wpm; six sections and ${figureNumber} figures.`);
