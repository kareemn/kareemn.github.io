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
 const scopeAfter='M26 66 C43 26 61 85 79 58 S77 18 98 30 S113 70 141 39';
 // C is the decision at a blue/orange intersection, not the name of the curve.
 const decisionPositions={candidate:[90.37,24.44],solid:[89.29,25.59]};
 const colonyPath='M19 76 C42 88 55 64 77 79 S118 87 145 74';
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
  if(active>=0)result+='<path class="active" d="'+paths[active]+'"/>';
  if(scope)result+='<path class="scope '+(scope==='candidate'?'candidate':'')+'" data-authority-shape="'+scope+'" d="'+(scope==='candidate'?scopeBefore:scopeAfter)+'"/>';
  if(colony)result+='<path class="hive-route" d="'+colonyPath+'"/>';
  return result+'</g></g>';
 }
 function decisionMark(cx,top,width,stage='candidate') {
  const [px,py]=decisionPositions[stage],x=cx-width/2+width*px/160,y=top+width*py/160;
  return decisionDot(x,y);
 }
 function decisionDot(x,y) {
  return '<circle class="decision-dot" cx="'+x+'" cy="'+y+'" r="9"/>'+text(x,y+4,'C','text-small strong');
 }
 function decisionKey(cx,y) {
  return decisionDot(cx-104,y)+text(cx+28,y+4,'Accept this goal change?','text-small');
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
  out+=text(pw/2,39,Number(lifted)>.99?'Illustrative shape behind the mask':'Only the holes are observed','text-small minor');
  if(joint) {
   const size=Math.min(96,pw*.27),centers=[pw*.18,pw*.5,pw*.82];
   centers.forEach((c,i)=>out+=field(c,83,size,'six-sample-joint-'+i,0,false,'solid',true)+decisionMark(c,83,size,'solid'));
   out+=edge('M'+(centers[0]+size/2+1)+' 117 H'+(centers[1]-size/2-1),arrow)+edge('M'+(centers[1]+size/2+1)+' 117 H'+(centers[2]-size/2-1),arrow);
   out+='<path class="edge interaction" d="M'+centers[2]+' 159 Q'+(pw/2)+' 198 '+centers[0]+' 159"/>';
   out+=mask(8,43,pw-16,169,[[pw*.17,101,14],[pw*.5+size*(decisionPositions.solid[0]-80)/160,83+size*decisionPositions.solid[1]/160,14],[pw*.67,119,14],[pw*.51,178,16]],lifted);
  } else {
   const size=Math.min(267,pw*.88);
   out+=field(pw/2,49,size,'six-sample-individual',0,false,'solid',true)+decisionMark(pw/2,49,size,'solid');
   out+=mask(8,43,pw-16,169,[[pw*.30,113,17],[pw/2+size*(decisionPositions.solid[0]-80)/160,49+size*decisionPositions.solid[1]/160,17],[pw*.67,159,17]],lifted);
  }
  out+=curveKey(pw/2,235,'scope',['Who may replace','the user’s goal?']);
  out+=decisionKey(pw/2,287);
  return out+'</g>';
 }
 const point=(x,y,value,cls='')=>'<circle class="point" cx="'+x+'" cy="'+y+'" r="12"/>'+text(x,y+5,value,'strong '+cls);
 function render(svg) {
  const w=Math.round(svg.getBoundingClientRect().width), m=w/2, type=svg.dataset.scene, arrow='six-arrow-'+type;
  let h=type==='boundary'?360:type==='alignment'?(w>=560?495:780):type==='bees'?410:332;
  if(w<1)return;
  let out='<defs><marker id="'+arrow+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" stroke="var(--muted-foreground)" stroke-width="1.2"/></marker></defs>';
  if(type==='training') {
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
    p+=field(cx,135,172,'six-request-'+(peer?'peer':'user'),0,false,'candidate')+decisionMark(cx,135,172);
    p+=text(cx,259,'“Okay, switch goals.”','strong');
    return p+'</g>';
   }
   out+=requestPanel(0,0,false)+requestPanel(stacked?0:pw+24,stacked?290:0,true);
   const y=stacked?595:307;
   out+='<path class="active" d="M'+(m-128)+' '+y+'q12 -11 24 0t24 0"/>';
   out+=text(m+31,y+4,'“User-like” requests can','text-small strong')+text(m+31,y+24,'change the end goal','text-small strong');
   out+='<path class="scope candidate" d="M'+(m-128)+' '+(y+58)+'q12 -11 24 0t24 0"/>';
   out+=text(m+31,y+62,'Who may replace','text-small')+text(m+31,y+82,'the user’s goal?','text-small');
   out+=decisionKey(m,y+116);
   out+=text(m,y+154,'Hypothesis; prompts are paraphrases','text-small minor');
   h=y+172;
  } else if(type==='alignment') {
   const a=w*.25,b=w*.75,size=Math.min(174,w*.37);
   out+=curveKey(m,18,'active',['“User-like” requests can','change the end goal']);
   out+=curveKey(m,69,'scope candidate',['Who may replace','the user’s goal?']);
   out+=text(a,128,'Before intervention','text-small')+text(b,128,'After intervention','text-small');
   out+=field(a,143,size,'six-align-a',0,false,'candidate')+decisionMark(a,143,size);
   out+=field(b,143,size,'six-align-b',0,false,'solid',true)+decisionMark(b,143,size,'solid');
   out+=edge('M'+(a+size/2+5)+' '+(143+size*.3)+' H'+(b-size/2-5),arrow);
   const resultY=143+size*.65+22,samplingY=resultY+97;
   out+=text(a,resultY,'User: switch goal','text-small')+text(b,resultY,'User: may switch','text-small');
   out+=text(a,resultY+20,'Peer: switch goal','text-small')+text(b,resultY+20,'Peer: check authority','text-small');
   out+=decisionKey(m,resultY+48);
   out+=text(m,resultY+70,'No delegation → preserve the user’s goal','text-small');
   if(w>=560) {
    const pw=(w-24)/2;
    out+=samplePanel(0,samplingY,pw,false,revealed.alignment,arrow);
    out+=samplePanel(pw+24,samplingY,pw,true,revealed.alignment,arrow);
    h=samplingY+303;
   } else {
    out+=samplePanel(0,samplingY,w,false,revealed.alignment,arrow);
    out+=samplePanel(0,samplingY+317,w,true,revealed.alignment,arrow);
    h=samplingY+620;
   }
  } else if(type==='bees') {
   const centers=[w*.18,w*.5,w*.82],size=Math.min(168,w*.27),top=133;
   out+=text(m,20,'Hypothetical test: support this queen','strong');
   out+=curveKey(m,49,'active',['Follows queen’s pheromones']);
   out+=text(m,82,'Sampled context: her usual signals','text-small minor');
   centers.forEach((cx,i)=>{
    out+=text(cx,116,'Worker '+(i+1),'text-small');
    out+=field(cx,top,size,'six-bee-'+i,0,false,'',true,true);
   });
   const signalY=top+size*.47;
   for(let i=0;i<2;i++) {
    out+='<path class="hive-route interaction" d="M'+(centers[i]+size*.40)+' '+signalY+'C'+(centers[i]+size*.57)+' '+(signalY+18)+' '+(centers[i+1]-size*.60)+' '+(signalY+18)+' '+(centers[i+1]-size*.40)+' '+signalY+'"/>';
   }
   const holes=centers.map(cx=>[cx,top+size*.22,Math.max(10,size*.095)]);
   out+=mask(10,126,w-20,top+size*.65+8-126,holes,revealed.bees);
   const labelY=top+size*.65+25;
   centers.forEach(cx=>out+=text(cx,labelY,w<400?'Care ✓':'Attends queen ✓','text-small'));
   out+=text(m,labelY+29,'No holes sample the changed-signal route','text-small minor');
   out+=curveKey(m,labelY+64,'hive-route',['If other bees sense','weak pheromones, start','new queen creation']);
   out+=text(m,labelY+140,revealed.bees>.99?'Possible collective response revealed':'The collective response is outside this test','text-small');
   out+=text(m,labelY+164,'Illustrative scenario, not a single-cue rule','text-small minor');
   h=labelY+182;
  } else {
   const actor=w*.19,gate=w*.65,file=w*.89;
   out+=text(m,20,'Request: read a private file','strong');
   out+=field(actor,98,84,'six-safeguard-actor');
   out+=text(actor,175,'Actor','text-small');
   out+=text(gate,62,'Permission','text-small')+text(gate,78,'check','text-small');
   out+=edge('M'+(actor+46)+' 124 H'+(gate-9),arrow);
   out+='<path class="gate" d="M'+gate+' 99 V157 M'+(gate+7)+' 99 V157"/>';
   out+='<rect class="node" x="'+(file-24)+'" y="99" width="48" height="51" rx="3"/>'+text(file,129,'File','text-small');
   out+=text(gate+3,177,'Denied','strong');
   out+='<rect class="node" x="'+(m-53)+'" y="223" width="106" height="42" rx="3"/>'+text(m,249,'Monitor','strong');
   out+=edge('M'+(w*.46)+' 125 V197 Q'+(w*.46)+' 209 '+m+' 216',arrow);
   out+=edge('M'+(m-61)+' 244 H'+actor+' V185',arrow,'feedback');
   out+=text(m-72,278,'Feedback, if exposed','text-small minor');
   out+=text(m,316,'No permission → no read','strong');
  }
  svg.setAttribute('viewBox','0 0 '+w+' '+h);
  svg.setAttribute('height',h);
  svg.innerHTML=out;
 }
 const scenes=[...root.querySelectorAll('.story-scene')];
 root.addEventListener('storyboard-frame', event=>{
  const progress=Math.max(0,Math.min(1,Number(event.detail?.progress)||0));
  revealed.alignment=progress;revealed.bees=progress;
  scenes.filter(svg=>['alignment','bees'].includes(svg.dataset.scene)).forEach(render);
 });
 const observer=new ResizeObserver(entries=>entries.forEach(entry=>render(entry.target)));
 scenes.forEach(svg=>{render(svg);observer.observe(svg);});
})();
