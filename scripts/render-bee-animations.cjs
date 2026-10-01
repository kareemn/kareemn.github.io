// Rebuild Figure 04 and its standalone 1080×1350 X video/GIF.
// Requires Playwright, Chrome, ffmpeg, and (optionally) gifsicle on PATH.
// --stills renders review images only; --social / --essay limits the export.
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const dest=path.join(root,'images/ai-agents-v1');
const work=fs.mkdtempSync(path.join(os.tmpdir(),'bee-animation-'));
const review=path.join(root,'work/bee-figure-04');
const stills=process.argv.includes('--stills');
const social=!process.argv.includes('--essay');
const essay=!process.argv.includes('--social');
const source=fs.readFileSync(path.join(root,'research/ai-agents-diagrams.source.html'),'utf8');
const css=source.match(/<style>([\s\S]*?)<\/style>/)[1];
const js=source.match(/<script>([\s\S]*?)<\/script>/)[1];
fs.mkdirSync(review,{recursive:true});
const pad=n=>String(n).padStart(3,'0');
const ffmpeg=args=>execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit'});
function gif(frames,out,fps=15) {
  ffmpeg(['-framerate',String(fps),'-i',path.join(frames,'%03d.png'),'-filter_complex','split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=none', '-loop','0',out]);
  try {execFileSync('gifsicle',['-O3','--careful','-b',out]);} catch(e) {if(e.code!=='ENOENT')throw e;}
}
async function checkLabels(page,social=false) {
  const issues=await page.evaluate(isSocial=>{
    const svg=document.querySelector('svg'),box=svg.getBoundingClientRect(),issues=[];
    const text=[...svg.querySelectorAll('text')].filter(t=>t.textContent);
    for(const t of text) {
      const r=t.getBoundingClientRect(),font=parseFloat(getComputedStyle(t).fontSize),margin=isSocial?60:0;
      if(r.left<box.left+margin-1||r.right>box.right-margin+1||r.top<box.top+margin-1||r.bottom>box.bottom-margin+1)issues.push('clipped: '+t.textContent);
      if(font<(isSocial?30:12))issues.push('small: '+t.textContent);
    }
    for(let i=0;i<text.length;i++)for(let j=i+1;j<text.length;j++) {
      const a=text[i].getBoundingClientRect(),b=text[j].getBoundingClientRect();
      if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)issues.push('overlap: '+text[i].textContent+' / '+text[j].textContent);
    }
    return issues;
  },social);
  assert.deepEqual(issues,[]);
}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try {
    if(essay)for(const theme of ['light','dark'])for(const [layout,width] of [['mobile',288],['desktop',640]]) {
      const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1});
      const palette=theme==='dark'?['#181818','#e0e0e1','#a9a9a9','#a6c5de','#c0a28b']:['#ffffff','#1a1c1f','#59636b','#36789e','#9f6412'];
      await page.setContent(`<style>${css}body{margin:0;font-family:Arial,Helvetica,sans-serif;background:${palette[0]}}#essay-six-step-storyboard{--background:${palette[0]};--foreground:${palette[1]};--muted-foreground:${palette[2]};--muted:transparent;--viz-series-1:${palette[3]};--viz-series-2:${palette[4]}}.story-scene{font-size:14px}.story-scene .text-small{font-size:12px}</style><div id="essay-six-step-storyboard"><svg class="story-scene" data-scene="bees"></svg></div><script>${js}</script>`);
      await page.locator('svg text').first().waitFor();
      const frames=path.join(work,`${layout}-${theme}`);fs.mkdirSync(frames);
      // 15 fps: quantized transition endpoints, with identical first/last frames.
      const progressAt=n=>n<38?0:n<50?((n-38)/11)**2*(3-2*(n-38)/11):n<102?1:1-((n-102)/11)**2*(3-2*(n-102)/11);
      for(const n of stills?[0,49]:Array.from({length:114},(_,i)=>i)) {
        const progress=progressAt(n);
        await page.evaluate(progress=>document.getElementById('essay-six-step-storyboard').dispatchEvent(new CustomEvent('storyboard-frame',{detail:{progress}})),progress);
        if(n===0||n===49) {
          await checkLabels(page);
          assert.equal(await page.locator('[data-case="queen"]').count(),3);
          assert.equal(await page.locator('[data-case="shared-new-queen"]').count(),1);
          await page.locator('svg').screenshot({path:path.join(review,`essay-${layout}-${theme}-${n===0?'masked':'revealed'}.png`)});
        }
        if(!stills)await page.locator('svg').screenshot({path:path.join(frames,`${pad(n)}.png`)});
      }
      if(!stills) {
        const stem=path.join(dest,`bee-colony-v3-${layout}-${theme}`);
        gif(frames,stem+'.gif');
        fs.copyFileSync(path.join(frames,'049.png'),stem+'-still.png');
        assert(fs.readFileSync(path.join(frames,'000.png')).equals(fs.readFileSync(path.join(frames,'113.png'))));
      }
      await page.close();console.log(`Essay: ${layout}/${theme} ${stills?'reviewed':'exported'}`);
    }
    if(social) {
      const page=await browser.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:1});
      await page.goto(pathToFileURL(path.join(__dirname,'bee-colony-x.source.html')).href);
      const frames=path.join(work,'social');fs.mkdirSync(frames);
      for(const n of stills?[0,87,120,227]:Array.from({length:228},(_,i)=>i)) {
        await page.evaluate(n=>window.renderFrame(n),n);
        if([0,87,120,227].includes(n)) {
          await checkLabels(page,true);
          assert.equal(await page.locator('[data-marker="Q"]').count(),3);
          assert.equal(await page.locator('[data-marker="N"]').count(),1);
          await page.screenshot({path:path.join(review,`x-${n===0?'masked':n===120?'revealed':n===227?'last':'transition'}.png`)});
        }
        if(!stills)await page.screenshot({path:path.join(frames,`${pad(n)}.png`)});
      }
      if(!stills) {
        assert(fs.readFileSync(path.join(frames,'000.png')).equals(fs.readFileSync(path.join(frames,'227.png'))));
        const stem=path.join(dest,'bee-colony-x-v1');
        ffmpeg(['-framerate','30','-i',path.join(frames,'%03d.png'),'-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart','-an',stem+'.mp4']);
        const fallback=path.join(work,'social-gif');fs.mkdirSync(fallback);
        for(let i=0;i<114;i++)fs.copyFileSync(path.join(frames,`${pad(i===113?227:i*2)}.png`),path.join(fallback,`${pad(i)}.png`));
        gif(fallback,stem+'.gif');
        fs.copyFileSync(path.join(frames,'000.png'),stem+'-first.png');
        fs.copyFileSync(path.join(frames,'120.png'),stem+'-revealed.png');
        fs.writeFileSync(stem+'-alt.txt',"Three worker bees each pass a test of supporting Queen A. A sliding mask reveals dotted orange routes connecting all three to one shared target: a new queen. The checks stay visible. Caption: The colony can still raise a new queen. Illustrative scenario, not a single-cue rule.\n");
      }
      await page.close();console.log(`X: ${stills?'reviewed':'exported MP4 + GIF'}`);
    }
  } finally {await browser.close();fs.rmSync(work,{recursive:true,force:true});}
  console.log(`Review images: ${review}`);
})().catch(e=>{console.error(e);process.exitCode=1});
