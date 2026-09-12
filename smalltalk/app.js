/* Curated suggestions run entirely in the browser. No API calls or stored conversations. */
const situations = {
  hello: { label: 'Say hello', title: 'The hello', prompt: "How's your day going?", patterns: [/\b(hello|hey|hi|howdy)\b/, /how (are you|is it going|s your|was your|is your)/, /what s up/],
    warm: [["Good to see you! How have you been?", "What's been the best part of your week?"], ["Thanks for asking! How's your day treating you?", "Anything you're looking forward to?"], ["Hey, it's nice to catch up.", "What's new with you?"]],
    playful: [["You've caught me between plot twists. How about you?", "Any good ones in your week?"], ["I'll give you the highlight reel. How's your day?", "What's today's headline?"], ["One conversation better now. How are you?", "Got anything fun coming up?"]],
    direct: [["Hi! How are you doing?", "How's your week been?"], ["Good to see you.", "What have you been up to?"], ["Hey, thanks for checking in.", "How are things with you?"]] },
  intro: { label: 'Meet someone', title: 'The introduction', prompt: "We haven't met before, right?", patterns: [/\b(introduc|introduce|stranger|networking|party|event|meet|met)\b/, /know (anyone|the host|people)/],
    warm: [["I don't think we've met. I'm [your name]—nice to meet you.", "How do you know the people here?"], ["Mind if I join you? I'm [your name].", "What brought you here?"], ["Hi, I'm [your name]. How's your evening going?", "Have you been to one of these before?"]],
    playful: [["Let's turn the polite nod into an actual introduction. I'm [your name].", "How did you end up here?"], ["I figured we should meet before we make eye contact a fourth time. I'm [your name].", "Do you know many people here?"], ["Hi, I'm [your name]. What's your connection to this gathering?", "Any insider tips for a newcomer?"]],
    direct: [["Hi, I'm [your name]. Nice to meet you.", "What's your name?"], ["Is this seat taken? I'm [your name].", "What brought you here?"], ["I don't think we've been introduced.", "How do you know the host?"]] },
  work: { label: 'Talk about work', title: 'The work question', prompt: 'What do you do?', patterns: [/\b(work|job|career|living|profession|occupation|business|working)\b/, /what do you do/],
    warm: [["I work in [field], mostly helping [people] with [problem].", "What do you enjoy about what you do?"], ["These days I'm focused on [one project or activity].", "What's keeping you busy lately?"], ["The short version: I [plain-language description].", "How did you get into your line of work?"]],
    playful: [["The dinner-party version is: I [simple description].", "What's the non-job-title version of what you do?"], ["I spend a lot of time thinking about [topic]. Sometimes professionally.", "What's a surprisingly fun part of your work?"], ["I'm in [field]. Happy to give you the two-sentence version.", "What are you working on that you're excited about?"]],
    direct: [["I'm a [role] in [field].", "What do you do?"], ["Right now I'm [working, studying, or exploring something].", "What are you focused on?"], ["I help [people] do [outcome].", "What does a typical day look like for you?"]] },
  weekend: { label: 'Weekend plans', title: 'The weekend question', prompt: 'Any plans for the weekend?', patterns: [/\b(weekend|plans|holiday|vacation|travel|trip|hobbies|hobby|fun|free time)\b/],
    warm: [["I'm thinking about [something you'd like to do]. How about you?", "Have you done that before?"], ["I'd love to make time for [something you enjoy].", "What's your ideal way to spend a day off?"], ["I'm looking for a good way to spend it.", "Anything local you'd recommend?"]],
    playful: [["I'm accepting excellent suggestions.", "What's your best weekend idea?"], ["The calendar is still open to persuasion.", "Doing anything worth stealing an idea from?"], ["Hopefully a good balance of [activity] and absolutely nothing.", "Are you a planner or a see-what-happens person?"]],
    direct: [["I'm planning to [your actual plan].", "What about you?"], ["Nothing decided yet.", "Do you have plans?"], ["I might [something you're considering].", "Have you tried it?"]] },
  compliment: { label: 'Take a compliment', title: 'The compliment', prompt: 'I love your outfit / your work!', patterns: [/\b(compliment|outfit|shirt|shoes|dress|love your|like your|look great|well done|nice work|great job)\b/],
    warm: [["Thank you—that's really kind of you.", "If it fits, share one small detail about what they noticed."], ["I appreciate you saying that!", "A simple thank-you is a complete answer."], ["Thanks! That means a lot.", "You can accept the compliment without returning one immediately."]],
    playful: [["Thank you! I'll be riding that compliment for a while.", "Smile, then let the conversation breathe."], ["That's very good for my confidence. Thank you.", "Share a little story behind it if you have one."], ["Well, you've made my day. Thanks!", "No need to downplay it."]],
    direct: [["Thank you, I appreciate it.", "Pause and let the compliment land."], ["Thanks for noticing.", "Add a detail only if you want to."], ["That's kind of you. Thank you.", "Acknowledge it, then carry on."]] },
  pause: { label: 'Awkward silence', title: 'The little pause', prompt: 'The conversation has gone quiet.', patterns: [/\b(awkward|silence|quiet|stuck|pause|boring|nothing to say|keep.*going|follow up)\b/],
    warm: [["What's something you've been enjoying lately?", "What do you like about it?"], ["Anything you're looking forward to this month?", "How did that come about?"], ["Seen, read, or listened to anything good lately?", "What would you recommend I start with?"]],
    playful: [["What's a very low-stakes opinion you feel strongly about?", "Okay, make your case."], ["What's your most unexpectedly good recent discovery?", "How did you find it?"], ["What's something that deserves more hype?", "What am I missing out on?"]],
    direct: [["What do you like doing outside work?", "How did you get into that?"], ["How do you know everyone here?", "Have you known them long?"], ["Tell me more about what you mentioned earlier.", "What happened next?"]] },
  exit: { label: 'Leave politely', title: 'The graceful exit', prompt: 'You want to wrap up the conversation.', patterns: [/\b(leave|leaving|exit|goodbye|bye|wrap up|gotta go|have to go|stop|end|escape)\b/],
    warm: [["It's been really nice talking with you. I'm going to head off—enjoy the rest of your evening!", "A warm smile and a clear goodbye are enough."], ["I'm glad we got to catch up. I'll let you get back to your evening.", "You don't need to invent an appointment."], ["Thanks for the conversation. It was lovely meeting you.", "If you mean it, add: “Hope we cross paths again.”"]],
    playful: [["I'm going to make my graceful exit while I'm still making sense. Great meeting you!", "Say it warmly, then actually head off."], ["I'll release you back into the wild. Really nice talking with you!", "Best with someone who shares your sense of humor."], ["Before this becomes a whole podcast, I'll let you go. Great chatting!", "Keep the joke light and your goodbye clear."]],
    direct: [["I'm going to head out. Nice talking with you.", "You can leave without giving a reason."], ["Thanks for chatting. I'll catch you later.", "Only suggest catching up if you want to."], ["I need to wrap up, but it was good meeting you.", "A short goodbye can still be kind."]] },
  boundary: { label: 'Too personal', title: 'The gentle boundary', prompt: "They've asked something you'd rather not discuss.", patterns: [/\b(personal|private|salary|money|dating|single|married|relationship|kids|children|age|old are|politic|religion|boundary|boundaries)\b/],
    warm: [["I tend to keep that private, but I appreciate your interest.", "How's your week been?"], ["I'd rather save that topic for another time.", "Tell me about something you're excited about."], ["That's a bit personal for me. Let's talk about something else.", "Have you been here before?"]],
    playful: [["That one's staying in the mystery file for now.", "Ask me something easier—like my favorite snack."], ["I'm keeping a little mystery alive.", "What's something good that's happened to you this week?"], ["That's outside today's interview scope.", "How about we swap recommendations instead?"]],
    direct: [["I'd rather not discuss that.", "Let's change the subject."], ["I keep that part of my life private.", "What else is new with you?"], ["I'm not comfortable answering that.", "If they keep pushing, it's okay to end the conversation."]] }
};

let active='hello',tone='warm',variation=0;
const el=id=>document.getElementById(id);
function showReply(){
  if(matchMedia('(max-width:760px)').matches)document.querySelector('.result-area').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
}
function render(){
  const item=situations[active],pair=item[tone][variation];
  el('moment').textContent=item.title;el('prompt').textContent='“'+item.prompt+'”';
  el('reply').textContent=pair[0];el('followup').textContent=pair[1];
  el('follow-label').textContent=['exit','compliment'].includes(active)?'A little reminder':'Keep it going';
  el('counter').textContent=String(variation+1).padStart(2,'0')+' / 03';
  document.querySelectorAll('[data-situation]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.situation===active)));
  document.querySelectorAll('[data-tone]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tone===tone)));
  el('copy-status').textContent='';
}
for(const [key,item] of Object.entries(situations)){
  const b=document.createElement('button');b.type='button';b.dataset.situation=key;b.textContent=item.label;
  b.addEventListener('click',()=>{active=key;variation=0;el('match-note').textContent='';render();showReply()});el('situations').append(b);
}
document.querySelectorAll('[data-tone]').forEach(b=>b.addEventListener('click',()=>{tone=b.dataset.tone;variation=0;render()}));
el('another').addEventListener('click',()=>{variation=(variation+1)%3;render()});
function classify(text){
  const normalized=text.toLowerCase().replace(/[’']/g,' ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  // Prefer specific requests (exiting, boundaries) over greetings inside a longer sentence.
  return ['boundary','exit','compliment','work','weekend','pause','intro','hello'].find(key=>situations[key].patterns.some(p=>p.test(normalized)))||null;
}
el('question-form').addEventListener('submit',event=>{
  event.preventDefault();const value=el('question').value.trim();
  if(!value){el('match-note').textContent='Type a question or pick a moment below.';el('question').focus();return}
  const match=classify(value);
  if(!match){el('match-note').textContent='No close match in this guide yet. Pick a moment to find a useful starting point.';return}
  active=match;variation=0;render();el('match-note').textContent='Closest situation: '+situations[active].label+'.';showReply();
});
el('copy').addEventListener('click',async()=>{
  const text=el('reply').textContent;
  try{await navigator.clipboard.writeText(text);el('copy-status').textContent=text.includes('[')?'Copied—replace the bracketed details before using it.':'Copied. Make it your own.'}
  catch{el('copy-status').textContent='Copy unavailable. Select the reply text to copy it manually.'}
});
render();
