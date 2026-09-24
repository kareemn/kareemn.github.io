// Regenerate with Node.js and sharp installed (or available through NODE_PATH).
// HTML/SVG/PNG outputs are committed: GitHub Pages needs no build step.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..');
const articlePath = '/research/the-algorithm-is-not-the-policy.html';
const origin = 'https://kareem.me';
const sections = require('../research/shaping-behavior/sections.json');
const article = fs.readFileSync(path.join(root, articlePath), 'utf8');
const outline = article.match(/class="map-outline" d="([^"]+)"/)[1];
const contours = [...article.matchAll(/class="map-contour" d="([^"]+)"/g)].slice(0, 5).map(m => m[1]);
const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (x, y, value, size = 18, color = '#aab8c6', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(value)}</text>`;
const line = (d, color = '#f7c873', extra = '') => `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const point = (x, y, color = '#eef5fa', radius = 5) => `<circle cx="${x}" cy="${y}" r="${radius + 6}" fill="${color}" opacity=".08"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
const arrow = d => line(d, '#f7c873', 'marker-end="url(#arrow)"');
const map = (x, y, scale = 1, opacity = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}"><path d="${outline}" fill="#101f29" stroke="#70c4d9" stroke-width="1.6"/><g clip-path="url(#map-clip)">${contours.map((d,i) => `<path d="${d}" fill="none" stroke="${i%2 ? '#79c0ff' : '#78d6a3'}" opacity=".6" stroke-width="1.8"/>`).join('')}</g></g>`;
const tick = (x,y) => line(`M${x-5} ${y} l4 5 8 -11`, '#78d6a3');
const cross = (x,y) => line(`M${x-5} ${y-5} l10 10 m0 -10 -10 10`, '#eea3a9');

function drawing(slug) {
  switch (slug) {
    case 'shaping': return map(675, 104, .7, .6) + arrow('M795 262 C795 288 886 274 886 306') + map(747, 305, 1.13) + text(688, 286, 'UPDATE', 14, '#f7c873', 'letter-spacing="3"') + point(838, 396) + point(1018, 432) + line('M838 396 C913 349 928 467 1018 432');
    case 'evaluation': return map(654, 183, 1.56) + [ [777,315],[831,359],[754,390],[893,397] ].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#0a1119" stroke="#78d6a3" stroke-width="1.5"/>` + tick(x,y)).join('') + line('M831 359 C882 300 975 434 1040 313', '#f7c873', 'stroke-dasharray="7 8" marker-end="url(#arrow)"') + `<circle cx="1060" cy="283" r="23" fill="#0b141e" stroke="#aab8c6" stroke-dasharray="4 5"/>` + text(1060,292,'?',26,'#eef5fa','text-anchor="middle"') + text(703, 501, 'TESTED', 14, '#78d6a3', 'letter-spacing="3"') + text(983, 501, 'UNTESTED', 14, '#aab8c6', 'letter-spacing="3"');
    case 'evidence': return map(651, 215, .91) + line('M720 308 C765 275 793 358 848 307') + cross(848,307) + line('M958 159 V487', '#7e91a3', 'stroke-dasharray="4 8"') + arrow('M917 332 H996') + `<rect x="1011" y="226" width="139" height="211" rx="13" fill="#132028" stroke="#60788c" stroke-width="2"/>` + [258,281,304].map(y=>line(`M1035 ${y} H1125`,'#64828e')).join('') + `<rect x="1026" y="335" width="109" height="60" rx="8" fill="#102e26" stroke="#78d6a3"/>` + text(1080,373,'PASS',23,'#78d6a3','text-anchor="middle" font-weight="700"') + text(791,502,'BEHAVIOR',14,'#aab8c6','text-anchor="middle" letter-spacing="3"') + text(1080,502,'EVIDENCE',14,'#aab8c6','text-anchor="middle" letter-spacing="3"');
    case 'swarm': return arrow('M855 219 C919 186 975 217 1003 269') + arrow('M1011 391 C987 461 918 455 870 444') + arrow('M748 368 C702 319 729 277 753 259') + map(695,116,.76) + map(932,274,.76) + map(672,365,.76) + point(795,194) + point(1032,352) + point(772,443) + `<circle cx="891" cy="322" r="35" fill="#101b25" stroke="#496270" stroke-dasharray="4 5"/>` + line('M795 194 L891 322 L1032 352 M772 443 L891 322','#4b6573','stroke-dasharray="3 6"') + text(891,331,'↔',30,'#eef5fa','text-anchor="middle"');
    case 'safeguards': return map(649,199,1.25) + line('M738 345 C815 284 849 387 929 330') + point(738,345) + arrow('M929 330 H1017') + `<rect x="1034" y="191" width="16" height="281" rx="4" fill="#78d6a3"/>` + line('M1066 191 V472','#78d6a3') + `<rect x="1002" y="292" width="80" height="76" rx="13" fill="#0b161b" stroke="#78d6a3" stroke-width="3"/><path d="M1023 292 V275 a19 19 0 0 1 38 0 V292" fill="none" stroke="#78d6a3" stroke-width="5"/>` + point(1042,326,'#78d6a3',4) + line('M1042 330 V342','#78d6a3') + text(1042,512,'ACCESS DENIED',14,'#78d6a3','text-anchor="middle" letter-spacing="2"');
    case 'questions': return map(654,183,1.56) + line('M742 388 C830 466 835 286 925 333', '#f7c873') + point(742,388) + [ [1038,263],[1008,434],[883,221] ].map(([x,y]) => line(`M925 333 Q960 336 ${x} ${y}`, '#f7c873', 'stroke-dasharray="5 7"') + `<circle cx="${x}" cy="${y}" r="24" fill="#0c1720" stroke="#6b8799"/>` + text(x,y+9,'?',26,'#eef5fa','text-anchor="middle"')).join('');
    default: throw new Error(`Unknown card ${slug}`);
  }
}

async function main() {
  for (const [index, s] of sections.entries()) {
    if (!article.includes(`id="${s.anchor}"`)) throw new Error(`Missing section ${s.anchor}`);
    const sharePath = `/research/shaping-behavior/${s.slug}.html`;
    const shareURL = origin + sharePath;
    const destination = articlePath + '#' + s.anchor;
    const imagePath = `/images/og-sections/${s.slug}-v1.png`;
    const imageURL = origin + imagePath;
    const alt = s.title + '. ' + s.visual + ' Kareem Nassar.';
    const baseline = 316 - (s.lines.length-1) * s.size * .56;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-labelledby="title desc">
<title id="title">${esc(s.title)}</title><desc id="desc">${esc(s.visual)}</desc>
<defs><radialGradient id="glow"><stop stop-color="#18323d" stop-opacity=".65"/><stop offset="1" stop-color="#0a1018" stop-opacity="0"/></radialGradient><clipPath id="map-clip"><path d="${outline}"/></clipPath><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 0 6" fill="none" stroke="#f7c873" stroke-width="1.3"/></marker></defs>
<rect width="1200" height="630" fill="#0a1018"/><ellipse cx="920" cy="327" rx="395" ry="335" fill="url(#glow)"/>
<g font-family="Arial, Helvetica, sans-serif">${text(58,72,'AI SAFETY / ESSAY',16,'#78d6a3','letter-spacing="3" font-weight="700"')}${text(1142,72,`0${index+1} / ${s.label.toUpperCase()}`,16,'#8da4b6','text-anchor="end" letter-spacing="2"')}
<path d="M58 103 H1142" stroke="#293542"/>
${s.lines.map((t,i)=>text(58,baseline+i*s.size*1.12,t,s.size,i===s.lines.length-1?'#78d6a3':'#eef5fa','font-weight="700" letter-spacing="-2"')).join('')}
${drawing(s.slug)}<path d="M58 544 H1142" stroke="#293542"/>${text(58,590,'Kareem Nassar',20,'#eef5fa')}${text(1142,590,'kareem.me',18,'#8da4b6','text-anchor="end"')}
</g></svg>`;
    fs.writeFileSync(path.join(root, imagePath.replace('.png','.svg')), svg + '\n');
    await sharp(Buffer.from(svg)).png().toFile(path.join(root, imagePath));
    // No HTTP/meta refresh: crawlers must receive the section's own metadata.
    // Browser-only navigation opens the canonical essay; the link works without JS.
    const page = `<!doctype html>
<!-- Generated by scripts/build-section-previews.cjs. Edit sections.json, then regenerate. -->
<html lang="en"><head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(s.title)} - Kareem Nassar</title>
  <meta name="description" content="${esc(s.description)}" />
  <meta name="robots" content="noindex, follow" />
  <link rel="canonical" href="${shareURL}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Kareem Nassar" />
  <meta property="og:url" content="${shareURL}" />
  <meta property="og:title" content="${esc(s.title)}" />
  <meta property="og:description" content="${esc(s.description)}" />
  <meta property="og:image" content="${imageURL}" />
  <meta property="og:image:secure_url" content="${imageURL}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${esc(alt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:creator" content="@kimocode" />
  <meta name="twitter:title" content="${esc(s.title)}" />
  <meta name="twitter:description" content="${esc(s.description)}" />
  <meta name="twitter:image" content="${imageURL}" />
  <meta name="twitter:image:alt" content="${esc(alt)}" />
  <link rel="stylesheet" href="../research.css?v=14" />
  <style>main{max-width:760px;margin:3rem auto;padding:0 1.25rem}img{display:block;width:100%;height:auto;border-radius:12px}h1{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.2}p{line-height:1.7}.continue{display:inline-block;padding:.8rem 0;font-weight:650}</style>
</head><body><main>
  <p class="eyebrow">From The Problem With Shaping High-Dimensional Behavior</p>
  <h1>${esc(s.title)}</h1>
  <img src="${imagePath}" width="1200" height="630" alt="${esc(alt)}" />
  <p>${esc(s.description)}</p>
  <a class="continue" href="${destination}">Read this section in the essay →</a>
  <p><small>Kareem Nassar · kareem.me</small></p>
</main><script>window.location.replace(${JSON.stringify(destination)});</script></body></html>
`;
    fs.writeFileSync(path.join(root, sharePath), page);
    console.log(`Generated ${s.slug}: HTML, SVG, PNG`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
