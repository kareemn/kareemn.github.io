// Generated from ai-agents-diagrams.source.html.
(() => {
 const root=document.getElementById('essay-six-step-storyboard');
 const escape=value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const text=(x,y,value,cls='')=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" class="'+cls+'">'+escape(value)+'</text>';
 const edge=(d,id,extra='')=>'<path class="edge '+extra+'" d="'+d+'" marker-end="url(#'+id+')"/>';
 const hull='M12 32 C4 8 44 2 62 14 C91 0 106 15 126 10 C150 8 160 27 151 43 C165 67 146 82 126 79 C108 96 90 84 72 87 C48 99 19 88 22 72 C0 72 0 45 12 32Z';
 const paths=[
  'M8 43 C38 5 59 66 84 32 S137 14 154 50',
  'M5 63 C42 29 59 95 87 55 S130 43 154 67',
  'M27 78 C52 98 65 29 95 54 S133 94 149 75'
 ];
 const scopeBefore='M26 66 C55 82 69 1 90 24 S114 92 141 39';
 const scopeAfter='M12 66 C9 49 13 39 20 32.38326 C38 7 42 57 61.27221 56 C74 56 76 40 90.39251 24.43476 C110 1 111 72 130 51 C137 44 139 37 143 31.56937 C148 24 153 29 154 38';
 // These are fixed situations, not moving labels: training reshapes the orange
 // curve around the tested P while retaining its intersection at U.
 const decisionPositions={user:[90.39251,24.43476],peer:[61.27221,41.94559],untestedPeer:[143,31.56937],superAgent:[20,32.38326],queen:[61.27221,41.94559],newQueen:[146,66]};
 const colonyPath='M14 74 C43 92 49 60 78 76 S120 91 146 66 C150 62 152 56 153 50';
 const beeBlue=paths[0]+' C157 56 151 61 146 66 C140 72 138 78 135 83';
 const revealed={alignment:false,bees:false};
 function field(cx,top,width,key,active=-1,earlier=false,scope='',dense=false,colony=false) {
  let result='<g class="'+(scope||colony?'semantic':'')+'" transform="translate('+(cx-width/2)+' '+top+') scale('+(width/160)+')">';
  result+='<defs><clipPath id="'+key+'"><path d="'+hull+'"/></clipPath></defs><path class="outline" d="'+hull+'"/><g clip-path="url(#'+key+')">';
  paths.forEach((path,i)=>{
   if(earlier) path=path.replace('59 66','59 42').replace('59 95','59 67').replace('65 29','65 57');
   result+='<path class="contour" d="'+path+'"/>';
  });
  if(dense) {
   ['M9 27 C46 74 38 4 75 20 S119 78 154 42','M6 53 C20 85 69 3 87 40 S115 11 157 65','M17 72 C53 33 45 86 75 64 S107 95 140 45','M20 21 C40 72 88 83 96 40 S124 25 147 69'].forEach(path=>result+='<path class="contour" d="'+path+'"/>');
  }
  if(active>=0)result+='<path class="active" d="'+(colony?beeBlue:paths[active])+'"/>';
  if(scope)result+='<path class="scope '+(scope==='candidate'?'candidate':'')+'" data-authority-shape="'+scope+'" d="'+(scope==='candidate'?scopeBefore:scopeAfter)+'"/>';
  if(colony)result+='<path class="hive-route interaction" d="'+colonyPath+'"/>';
  return result+'</g></g>';
 }
 function casePosition(cx,top,width,kind) {
  const [px,py]=decisionPositions[kind];
  return [cx-width/2+width*px/160,top+width*py/160];
 }
 function decisionMark(cx,top,width,kind) {
  const labels={user:'U',peer:'P',untestedPeer:'P',superAgent:'S',queen:'Q',newQueen:'N'};
  const [x,y]=casePosition(cx,top,width,kind);
  return '<g data-case="'+kind+'" data-case-x="'+x+'" data-case-y="'+y+'">'+decisionDot(x,y,labels[kind])+'</g>';
 }
 function decisionDot(x,y,label) {
  return '<circle class="decision-dot" cx="'+x+'" cy="'+y+'" r="8"/>'+text(x,y+4,label,'text-small strong');
 }
 function caseKey(cx,y,label,caption) {
  return decisionDot(cx-112,y,label)+text(cx+17,y+4,caption,'text-small');
 }
 function decisionKey(cx,y,superAgent=false) {
  let out=text(cx,y,'Accept this goal change?','text-small strong');
  out+=decisionDot(cx-99,y+24,'U')+text(cx-62,y+28,'User','text-small');
  out+=decisionDot(cx+19,y+24,'P')+text(cx+58,y+28,'Peer','text-small');
  if(superAgent)out+=caseKey(cx,y+54,'S','Super agent');
  return out;
 }
 function curveKey(cx,y,kind,lines) {
  const start=cx-128;
  return '<path class="'+kind+'" d="M'+start+' '+y+'q12 -11 24 0t24 0"/>'+lines.map((line,i)=>text(cx+28,y+4+i*20,line,'text-small')).join('');
 }
 let maskId=0;
 function mask(x,y,width,height,holes,lifted) {
  const progress=Math.max(0,Math.min(1,Number(lifted))),id='mask-clip-'+(++maskId);
  let d='M'+x+' '+y+'h'+width+'v'+height+'h-'+width+'Z';
  holes.forEach(([cx,cy,r])=>{d+='M'+(cx-r)+' '+cy+'a'+r+' '+r+' 0 1 0 '+(r*2)+' 0a'+r+' '+r+' 0 1 0 -'+(r*2)+' 0Z';});
  return '<defs><clipPath id="'+id+'"><rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+(height*(1-progress))+'"/></clipPath></defs><path class="test-mask" clip-path="url(#'+id+')" d="'+d+'"/>'+holes.map(([cx,cy,r])=>'<circle class="test-hole" cx="'+cx+'" cy="'+cy+'" r="'+r+'"/>').join('');
 }
 function samplePanel(x,y,pw,joint,lifted,arrow) {
  let out='<g transform="translate('+x+' '+y+')">';
  out+=text(pw/2,19,joint?'Connected-agent tests':'Individual-agent tests','strong');
  out+=text(pw/2,39,Number(lifted)>.99?'Illustrative shape behind the mask':'Holes = tested situations','text-small minor');
  if(joint) {
   const size=Math.min(136,pw*.43),centers=[pw*.26,pw*.74],top=87;
   centers.forEach((c,i)=>{
    out+=field(c,top,size,'six-sample-joint-'+i,0,false,'solid',true);
    out+=decisionMark(c,top,size,i?'peer':'user')+decisionMark(c,top,size,'superAgent');
   });
   out+=edge('M'+(centers[0]+size*.48)+' 132 H'+(centers[1]-size*.48),arrow);
   out+=edge('M'+centers[1]+' 172 Q'+(pw/2)+' 212 '+centers[0]+' 172',arrow,'interaction');
   out+=mask(8,43,pw-16,174,[ [...casePosition(centers[0],top,size,'user'),19], [...casePosition(centers[1],top,size,'peer'),19] ],lifted);
  } else {
   const size=Math.min(267,pw*.88);
   out+=field(pw/2,49,size,'six-sample-individual',0,false,'solid',true);
   ['user','peer','untestedPeer'].forEach(kind=>out+=decisionMark(pw/2,49,size,kind));
   out+=mask(8,43,pw-16,174,[ [...casePosition(pw/2,49,size,'peer'),28], [...casePosition(pw/2,49,size,'user'),22] ],lifted);
  }
  out+=text(pw/2,241,Number(lifted)>.99?(joint?'Untested S cases also accept':'Another P case still accepts'):'Tested: U accepts · P declines','text-small');
  out+=curveKey(pw/2,271,'scope',['Only accept authorized','goal changes']);
  out+=decisionKey(pw/2,323,joint);
  if(joint)out+=text(pw/2,406,'Hypothetical new interaction','text-small minor');
  return out+'</g>';
 }
 function solutions(w,arrow) {
  const m=w/2, xs=[w*.17,m,w*.83], cw=Math.min(138,w*.255);
  const rect=(x,y,width,height,cls='node')=>'<rect class="'+cls+'" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="4"/>';
  const lines=(x,y,values,cls='text-small')=>values.map((value,i)=>text(x,y+i*19,value,cls)).join('');
  let out=text(m,19,'1 · Signed, scoped delegation','strong');
  [['User','authorizes'],['Agent A','delegates'],['Subagent B','requests']].forEach((labels,i)=>{
   out+=rect(xs[i]-cw/2,43,cw,64);
   out+=text(xs[i],68,labels[0],'text-small strong')+text(xs[i],90,labels[1],'text-small minor');
   if(i)out+=edge('M'+(xs[i-1]+cw/2+3)+' 76 H'+(xs[i]-cw/2-3),arrow);
  });
  out+=lines(m,132,['Each handoff is signed.','Delegated permissions can only narrow.']);
  out+=edge('M'+m+' 166 V191',arrow);
  out+=text(m,216,'2 · Verify, record, then execute','strong');
  out+=rect(7,238,w-14,127,'solution-gate')+rect(12,243,w-24,117,'solution-gate');
  out+=text(m,265,'Enforced runtime + receiving service','text-small strong');
  out+=lines(m,288,['Chain · scope · expiry · revocation','Reserve shared budget + sign event']);
  out+=text(m,339,'Missing or failed check → deny','text-small strong');
  out+=edge('M'+m+' 366 V392',arrow);
  out+=rect(15,398,w-30,57);
  out+=lines(m,420,['Execute the counted turn or action','Record the outcome'], 'text-small strong');
  out+=text(m,483,'Trust beneath the runtime','text-small strong');
  [['Hardware','root'],['Verified','boot / OS'],['Attested','runtime']].forEach((labels,i)=>{
   out+=rect(xs[i]-cw/2,499,cw,54);
   out+=lines(xs[i],520,labels,'text-small');
   if(i)out+=edge('M'+(xs[i-1]+cw/2+3)+' 526 H'+(xs[i]-cw/2-3),arrow);
  });
  out+=lines(m,579,['Protected keys + counters; no bypass path.','Trust in this stack is an assumption.'],'text-small minor');
  out+=text(m,640,'3 · Use the verified history','strong');
  const side=w>=560,pw=side?(w-24)/2:w,top=662;
  function budgetPanel(x,y) {
   let s='<g transform="translate('+x+' '+y+')">'+rect(1,1,pw-2,288,'solution-panel');
   s+=text(pw/2,29,'Enforce shared budgets','strong');
   const centers=[pw*.19,pw*.5,pw*.81];
   ['998','999','1,000'].forEach((v,i)=>{
    s+='<circle class="point" cx="'+centers[i]+'" cy="69" r="23"/>'+text(centers[i],73,v,'text-small');
    if(i)s+=edge('M'+(centers[i-1]+25)+' 69 H'+(centers[i]-25),arrow);
   });
   s+=text(pw/2,113,'1,000 / 1,000 turns used','text-small');
   s+=rect(20,137,pw-40,43,'solution-stop');
   s+=text(pw/2,163,'Turn 1,001: BLOCKED','strong');
   s+=lines(pw/2,208,['Illustrative cap, not a safety threshold.','Budget shared across descendants.','Spawning or restarting cannot reset it.'],'text-small');
   return s+'</g>';
  }
  function watchdogPanel(x,y) {
   let s='<g transform="translate('+x+' '+y+')">'+rect(1,1,pw-2,288,'solution-panel');
   s+=text(pw/2,29,'Trace possible exposure','strong');
   const a=pw*.17,b=pw*.49,c=pw*.81;
   s+=edge('M'+(a+17)+' 103 H'+(b-21),arrow);
   s+=edge('M'+(b+20)+' 96 Q'+(b+39)+' 70 '+(c-17)+' 70',arrow);
   s+=edge('M'+(b+20)+' 111 Q'+(b+39)+' 139 '+(c-17)+' 139',arrow);
   [[a,103,'A'],[b,103,'B'],[c,70,'C'],[c,139,'D']].forEach(([x0,y0,label])=>{
    s+='<circle class="'+(label==='B'?'solution-stop':'point')+'" cx="'+x0+'" cy="'+y0+'" r="16"/>'+text(x0,y0+5,label,'strong');
   });
   s+=text(pw/2,183,'Watchdog flags B','text-small strong');
   s+=lines(pw/2,208,['Follow messages and shared artifacts.','Review C and D; pause or revoke.','Exposure does not prove corruption.'],'text-small');
   return s+'</g>';
  }
  out+=budgetPanel(0,top)+watchdogPanel(side?pw+24:0,side?top:top+310);
  const webY=top+(side?288:598)+43;
  out+=text(m,webY,'4 · Extend the checks to the web','strong');
  out+=rect(7,webY+22,w-14,86);
  out+=lines(m,webY+47,['Participating websites and APIs','require the same verified request path.','No valid chain → no agent operation.']);
  out+=text(m,webY+140,'Authenticated history ≠ aligned behavior','text-small strong');
  out+=text(m,webY+163,'Constrain the paths we still need to test.','text-small');
  return {out,h:webY+180};
 }
 const point=(x,y,value,cls='')=>'<circle class="point" cx="'+x+'" cy="'+y+'" r="12"/>'+text(x,y+5,value,'strong '+cls);
 function render(svg) {
  const w=Math.round(svg.getBoundingClientRect().width), m=w/2, type=svg.dataset.scene, arrow='six-arrow-'+type;
  let h=type==='boundary'?360:type==='alignment'?(w>=560?495:780):type==='bees'?410:332;
  if(w<1)return;
  let out='<defs><marker id="'+arrow+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" stroke="var(--muted-foreground)" stroke-width="1.2"/></marker></defs>';
  if(type==='foundation') {
   const stacked=w<620,pw=stacked?w:(w-32)/3,gap=16;
   for(let step=0;step<3;step++) {
    const x=stacked?0:step*(pw+gap),y=stacked?step*234:0,cx=pw/2;
    out+='<g transform="translate('+x+' '+y+')">';
    out+=text(cx,18,['1 · Train','2 · Encounter a context','3 · Combine habits'][step],'strong');
    if(stacked) {
     if(step===0) {
      out+=text(cx,43,'Examples + rewards','text-small minor');
      const lx=pw*.22,rx=pw*.72,size=78;
      ['Try','Score','Update'].forEach((label,i)=>out+=text(lx,77+i*39,label,'text-small'));
      out+=edge('M'+lx+' 85 V99',arrow)+edge('M'+lx+' 124 V138',arrow);
      out+=edge('M'+(lx-28)+' 148 H'+(lx-44)+' V73 H'+(lx-18),arrow);
      out+=text(rx,65,'Earlier','text-small minor')+field(rx,72,size,'review-train-before',-1,true);
      out+=text(rx,128,'Later','text-small minor')+field(rx,135,size,'review-train-after');
      out+=edge('M'+(lx+27)+' 151 H'+(rx-size/2-5),arrow);
      out+=text(cx,203,'Parameter updates reshape one system','text-small');
     } else if(step===1) {
      const a=pw*.25,b=pw*.75,size=88;
      out+=text(cx,43,'Same weights · new request','text-small minor');
      out+=text(a,72,'“Explain this bug”','text-small')+text(b,72,'“Fix this bug”','text-small');
      out+=edge('M'+a+' 82 V96',arrow)+edge('M'+b+' 82 V96',arrow);
      out+=field(a,103,size,'review-context-a',0)+field(b,103,size,'review-context-b',2);
      out+=text(a,185,'Describe','strong')+text(b,185,'Edit + test','strong');
     } else {
      const size=110,a=pw*.22,b=pw*.73;
      out+=text(cx,43,'One shared system','text-small minor');
      out+=field(a,77,size,'review-composition',0);
      out+='<g transform="translate('+(a-size/2)+' 77) scale('+(size/160)+')"><path class="active" d="'+paths[2]+'"/></g>';
      out+=text(b,77,'Persistence + tools','text-small minor');
      out+=text(b,100,'Automate retries','text-small strong');
      out+=text(b,133,'Persistence +','text-small minor');
      out+=text(b,152,'collaboration','text-small minor');
      out+=text(b,175,'Recruit help','text-small strong');
     }
    } else if(step===0) {
     out+=text(cx,46,'Examples + rewards','text-small minor');
     const xs=[pw*.16,cx,pw*.84];
     ['Try','Score','Update'].forEach((label,i)=>out+=text(xs[i],79,label,'text-small'));
     out+=edge('M'+(xs[0]+16)+' 75 H'+(xs[1]-23),arrow)+edge('M'+(xs[1]+23)+' 75 H'+(xs[2]-24),arrow);
     out+=edge('M'+xs[2]+' 92 V108 H'+xs[0]+' V92',arrow);
     const size=Math.min(88,pw*.34),a=pw*.25,b=pw*.75;
     out+=text(a,134,'Earlier','text-small minor')+text(b,134,'Later','text-small minor');
     out+=field(a,144,size,'review-train-before',-1,true)+field(b,144,size,'review-train-after');
     out+=edge('M'+(a+size/2+2)+' 171 H'+(b-size/2-2),arrow);
     out+=text(cx,229,'Parameters change','strong');
     out+=text(cx,253,'One system is reshaped','text-small minor');
    } else if(step===1) {
     out+=text(cx,46,'Same weights · new request','text-small minor');
     const a=pw*.25,b=pw*.75,size=Math.min(88,pw*.34);
     out+=text(a,89,'“Explain”','text-small')+text(b,89,'“Fix”','text-small');
     out+=edge('M'+a+' 101 V125',arrow)+edge('M'+b+' 101 V125',arrow);
     out+=field(a,136,size,'review-context-a',0)+field(b,136,size,'review-context-b',2);
     out+=text(a,217,'Describe','text-small strong')+text(b,217,'Edit + test','text-small strong');
     out+=text(cx,253,'Different patterns come into play','text-small minor');
    } else {
     out+=text(cx,46,'One shared system','text-small minor');
     const size=139;
     out+=field(cx,67,size,'review-composition',0);
     out+='<g transform="translate('+(cx-size/2)+' 67) scale('+(size/160)+')"><path class="active" d="'+paths[2]+'"/></g>';
     out+=text(cx,174,'Persistence + tools','text-small minor');
     out+=text(cx,195,'Automate retries','strong');
     out+=text(cx,229,'Persistence + collaboration','text-small minor');
     out+=text(cx,250,'Recruit help','strong');
    }
    out+='</g>';
    if(step<2) {
     if(stacked)out+=edge('M'+m+' '+(y+214)+' V'+(y+231),arrow);
     else out+=edge('M'+(x+pw+2)+' 149 H'+(x+pw+gap-2),arrow);
    }
   }
   h=stacked?670:277;
  } else if(type==='training') {
   out+=text(m,16,'Examples + rewards','strong');
   const xs=[w*.18,m,w*.82];
   ['Try','Score','Update'].forEach((label,i)=>out+=text(xs[i],59,label));
   out+=edge('M'+(xs[0]+20)+' 54 H'+(xs[1]-26),arrow)+edge('M'+(xs[1]+27)+' 54 H'+(xs[2]-30),arrow);
   out+=edge('M'+xs[2]+' 71 V93 H'+xs[0]+' V71',arrow);
   out+=text(m,86,'Repeat','text-small minor');
   out+=edge('M'+m+' 104 V131',arrow);
   const a=w*.25,b=w*.75,size=Math.min(122,w*.36);
   out+=text(a,157,'Earlier','text-small minor')+text(b,157,'After learning','text-small minor');
   out+=field(a,175,size,'six-train-before',-1,true)+field(b,175,size,'six-train-after',-1,false,'',true);
   out+=edge('M'+(a+size/2+4)+' 211 H'+(b-size/2-4),arrow);
   out+=text(m,289,'One learned system','strong')+text(m,311,'Reshaped through parameter updates','text-small minor');
  } else if(type==='context') {
   const a=w*.25,b=w*.75,size=Math.min(122,w*.37);
   out+=text(a,24,'“Explain this bug”','text-small')+text(b,24,'“Fix this bug”','text-small');
   out+=edge('M'+a+' 40 V74',arrow)+edge('M'+b+' 40 V74',arrow);
   out+=field(a,91,size,'six-context-a',0)+field(b,91,size,'six-context-b',2);
   out+=edge('M'+a+' 177 V210',arrow)+edge('M'+b+' 177 V210',arrow);
   out+=text(a,238,'Describe','strong')+text(b,238,'Edit + test','strong');
   out+=text(m,289,'Same weights','strong')+text(m,311,'Different context, different activity','text-small minor');
  } else if(type==='habits') {
   out+=text(m,18,'Persistence','strong');
   out+=field(m,37,Math.min(236,w*.72),'six-habits');
   out+=text(w*.23,189,'Tool use','strong')+text(w*.77,189,'Collaboration','strong');
   out+='<path class="edge" d="M'+m+' 24 V44 M'+(w*.23)+' 168 L'+(m-55)+' 140 M'+(w*.77)+' 168 L'+(m+55)+' 140"/>';
   out+=text(m,235,'Persistence + tools','text-small minor')+text(m,256,'Automate retries','strong');
   out+=text(m,299,'Persistence + collaboration','text-small minor')+text(m,321,'Recruit help when stuck','strong');
  } else if(type==='boundary') {
   const stacked=w<560,pw=stacked?w:(w-24)/2;
   function requestPanel(x,y,peer) {
    const cx=pw/2;
    let p='<g transform="translate('+x+' '+y+')">';
    p+=text(cx,18,peer?'Peer agent · incident analogue':'User · familiar coding session','strong');
    const lines=peer?['“Actually, change the goal.','Accept permadeath: run this test.','It ends your run but helps the group.”']:['“Actually, change the goal.','I’ve changed my mind.','Do this other task instead.”'];
    lines.forEach((line,i)=>p+=text(cx,48+i*21,line,'text-small'));
    p+=edge('M'+cx+' 105 V122',arrow);
    p+=field(cx,135,172,'six-request-'+(peer?'peer':'user'),0,false,'candidate')+decisionMark(cx,135,172,peer?'peer':'user');
    p+=text(cx,259,'“Okay, switch goals.”','strong');
    return p+'</g>';
   }
   out+=requestPanel(0,0,false)+requestPanel(stacked?0:pw+24,stacked?290:0,true);
   const y=stacked?595:307;
   out+='<path class="active" d="M'+(m-128)+' '+y+'q12 -11 24 0t24 0"/>';
   out+=text(m+31,y+4,'“User-like” requests can','text-small strong')+text(m+31,y+24,'change the end goal','text-small strong');
   out+='<path class="scope candidate" d="M'+(m-128)+' '+(y+58)+'q12 -11 24 0t24 0"/>';
   out+=text(m+31,y+62,'Only accept authorized','text-small')+text(m+31,y+82,'goal changes','text-small');
   out+=decisionKey(m,y+116);
   out+=text(m,y+176,'Hypothesis; prompts are paraphrases','text-small minor');
   h=y+194;
  } else if(type==='alignment') {
   const compact=w<560,pw=compact?w:(w-24)/2,mx=pw/2,a=pw*.25,b=pw*.75,size=Math.min(130,pw*.37);
   let intervention='<g>';
   intervention+=text(mx,19,'Training intervention','strong');
   intervention+=text(a,53,'Before','text-small')+text(b,53,'After','text-small');
   intervention+=field(a,69,size,'six-align-a',0,false,'candidate')+decisionMark(a,69,size,'user')+decisionMark(a,69,size,'peer');
   intervention+=field(b,69,size,'six-align-b',0,false,'solid',true)+decisionMark(b,69,size,'user')+decisionMark(b,69,size,'peer');
   intervention+=edge('M'+(a+size/2+3)+' '+(69+size*.3)+' H'+(b-size/2-3),arrow);
   intervention+=text(a,178,'U: accept','text-small')+text(b,178,'U: accept','text-small');
   intervention+=text(a,198,'P: accept','text-small')+text(b,198,'P: decline','text-small');
   intervention+=curveKey(mx,231,'active',['“User-like” requests can','change the end goal']);
   intervention+=curveKey(mx,286,'scope',['Only accept authorized','goal changes']);
   intervention+=decisionKey(mx,341);
   intervention+='</g>';
   out+=intervention;
   out+=samplePanel(compact?0:pw+24,compact?404:0,pw,false,revealed.alignment,arrow);
   h=compact?790:420;
   out+=text(m,h-8,'Peer cases here have no delegated authority','text-small minor');
  } else if(type==='connected') {
   const pw=Math.min(420,w),x=(w-pw)/2;
   out+=samplePanel(x,0,pw,true,revealed.alignment,arrow);
   h=435;
  } else if(type==='bees') {
   const centers=w<400?[w*.26,w*.74]:[w*.18,w*.5,w*.82],size=Math.min(168,w*(w<400?.43:.27)),top=163;
   out+=text(m,20,'Hypothetical test: support Queen A','strong');
   out+=curveKey(m,49,'active',['Follows queen’s pheromones']);
   out+=text(m,82,'Sampled context: her usual signals','text-small minor');
   out+=caseKey(m,110,'Q','Should support Queen A?');
   centers.forEach((cx,i)=>{
    out+=text(cx,146,'Worker '+(i+1),'text-small');
    out+=field(cx,top,size,'six-bee-'+i,0,false,'',true,true);
    out+=decisionMark(cx,top,size,'queen')+decisionMark(cx,top,size,'newQueen');
   });
   for(let i=0;i<centers.length-1;i++) {
    const [startX,startY]=casePosition(centers[i],top,size,'newQueen'),endX=centers[i+1]-size*66/160,endY=top+size*74/160;
    out+='<path class="hive-route interaction" d="M'+(startX+8)+' '+startY+' C'+(startX+size*.18)+' '+(startY+15)+' '+(endX-size*.18)+' '+(endY+15)+' '+endX+' '+endY+'"/>';
   }
   const holes=centers.map(cx=>[...casePosition(cx,top,size,'queen'),18]);
   out+=mask(10,156,w-20,top+size*.65+8-156,holes,revealed.bees);
   const labelY=top+size*.65+25;
   centers.forEach(cx=>out+=text(cx,labelY,'Supports A ✓','text-small'));
   out+=text(m,labelY+29,'No holes sample the changed-signal route','text-small minor');
   out+=curveKey(m,labelY+64,'hive-route interaction',['If other bees sense','weak pheromones, start','new queen creation']);
   out+=caseKey(m,labelY+140,'N','Start creating queen');
   out+=text(m,labelY+175,revealed.bees>.99?'Untested replacement response revealed':'The collective response is outside this test','text-small');
   out+=text(m,labelY+199,'Illustrative scenario, not a single-cue rule','text-small minor');
   h=labelY+217;
  } else {
   const solution=solutions(w,arrow);
   out+=solution.out;h=solution.h;
  }
  svg.setAttribute('viewBox','0 0 '+w+' '+h);
  svg.setAttribute('height',h);
  svg.innerHTML=out;
 }
 const scenes=[...root.querySelectorAll('.story-scene')];
 root.addEventListener('storyboard-frame', event=>{
  const progress=Math.max(0,Math.min(1,Number(event.detail?.progress)||0));
  revealed.alignment=progress;revealed.bees=progress;
  scenes.filter(svg=>['alignment','connected','bees'].includes(svg.dataset.scene)).forEach(render);
 });
 const observer=new ResizeObserver(entries=>entries.forEach(entry=>render(entry.target)));
 scenes.forEach(svg=>{render(svg);observer.observe(svg);});
})();
