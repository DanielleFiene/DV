// CHATBOT (draait op Claude via het sample-recht)
// ═══════════════════════════════════════════════════════════
(async function(){
  const launch=document.getElementById('botLaunch'),panel=document.getElementById('botPanel'),log=document.getElementById('botLog'),
        form=document.getElementById('botForm'),input=document.getElementById('botInput'),send=document.getElementById('botSend'),chips=document.getElementById('botChips');
  if(!launch||!panel||!form||!log) return;
  let sample=null;
  try{ sample=window.claude?await window.claude.use('sample'):null; }catch(e){ sample=null; }
  if(!sample) return;
  launch.classList.add('ready');
  launch.setAttribute('aria-hidden','false');
  const RULES=`Je bent de vriendelijke assistent op de website van DV Design ("Dromen Vormgeven"), een creatieve studio in Baarn. Antwoord altijd in het Nederlands, warm en kort (maximaal 4 zinnen), zonder opmaaktekens als sterretjes of kopjes.
Dit weet je, en meer niet:
- DV Design Studio biedt: social media beheer (de klant kiest 1, 2 of 3 posts per week), contentcreatie (reels, carousels, fotobewerking), fotografie en video, websites (van één pagina tot bedrijfswebsite, plus onderhoud), branding en identiteit, en AI-automatisering. Voor wie alles wil is er het all-in Droompakket; combinatiepakketten gaan in overleg.
- Alle pakketten en tarieven staan in het dienstenboekje. Dat vraag je aan via het contactformulier en het komt binnen 24 uur op werkdagen in je mail. Een kennismakingsgesprek is gratis en vrijblijvend.
- Servicebelofte: reactie binnen 24 uur op werkdagen, kleine websiteaanpassingen binnen 48 uur online als alles is aangeleverd (met het Droompakket binnen 24 uur), vaste prijs vooraf en twee feedbackrondes inbegrepen.
- AI-aanbod voor goede doelen en kleine ondernemers: Dromen-scan (gratis gesprek van 45 minuten met een korte actielijst), Dromen-start (één concrete oplossing zoals een chatbot, contentplanning of offerte-workflow, in de huisstijl van de klant) en Dromen-groei (maandelijks nieuwe content en automatiseringen). Prijzen noem je nooit als bedrag: Dromen-start en Dromen-groei zijn prijs op maat, na de gratis scan, en altijd betaalbaar voor kleine budgetten.
- Contact: dvdesignstudio.eu@gmail.com of Instagram @dvdesign.studio_eu. Na een aanvraag volgt binnen 24 uur op werkdagen een reactie.
Noem geen bedragen en verzin geen data, klanten of beloftes die hierboven niet staan. Weet je iets niet, verwijs dan vriendelijk naar het e-mailadres. Noem nooit prijzen; verwijs voor tarieven naar het dienstenboekje. Stuur mensen naar een gratis kennismakingsgesprek of de gratis Dromen-scan als ze willen starten.`;
  const turns=[]; let ctl=null, started=false;
  function add(cls,text){const d=document.createElement('div');d.className='bot-msg '+cls;d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;return d;}
  const copy={not_granted:'Je hebt de chatbot niet toegestaan. Mail ons gerust via dvdesignstudio.eu@gmail.com.',rate_limited:'Er zijn nu te veel vragen. Probeer het over een paar minuten opnieuw.',upstream_error:'Er ging iets mis. Probeer het nog eens.',refused:'Daar kan ik niet bij helpen. Stel gerust een andere vraag.'};
  async function ask(q){
    if(!q.trim()||send.disabled) return;
    chips.style.display='none';
    add('me',q); turns.push({role:'user',content:q}); input.value=''; send.disabled=true;
    const bubble=add('bot','Even denken...'); ctl=new AbortController();
    try{
      const recent=turns.slice(-10);
      const r=await sample([{role:'user',content:RULES},...recent],{modelTier:'quick',cache:false,signal:ctl.signal,onText:({text})=>{bubble.textContent=text;log.scrollTop=log.scrollHeight;}});
      bubble.textContent=r.text; turns.push({role:'assistant',content:r.text});
    }catch(e){
      turns.pop();
      bubble.textContent=e&&e.text?e.text:(copy[e&&e.code]||copy.upstream_error);
    }finally{send.disabled=false;ctl=null;input.focus();}
  }
  function open(o){panel.classList.toggle('open',o);launch.setAttribute('aria-expanded',String(o));panel.setAttribute('aria-hidden',String(!o));launch.setAttribute('aria-label',o?'Sluit de DV Design-assistent':'Open de DV Design-assistent');
    if(o&&!started){started=true;add('bot','Hoi! Ik ben de AI-assistent van DV Design. Waar kan ik je mee helpen?');
      ['Wat doen jullie?','Hoe krijg ik het dienstenboekje?','Hoe werkt de kennismaking?'].forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=()=>ask(t);chips.appendChild(b);});}
    if(o) input.focus();}
  launch.addEventListener('click',()=>open(!panel.classList.contains('open')));
  document.getElementById('botClose').addEventListener('click',()=>open(false));
  form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});
})();
