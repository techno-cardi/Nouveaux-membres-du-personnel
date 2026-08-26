(() => {
  const input = document.getElementById('search');
  const clear = document.getElementById('clearSearch');
  const results = document.getElementById('results');
  const cards = [...document.querySelectorAll('.searchable')];
  const noResults = document.getElementById('noResults');

  const norm = s => (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[’']/g,' ').replace(/[^a-z0-9 -]/g,' ')
    .replace(/\s+/g,' ').trim();

  const aliases = {
    "expuls":"sortie expulsion retrait transit mes suivis",
    "sort":"sortie expulsion retrait transit",
    "renvoy":"sortie expulsion retrait transit",
    "bavard":"avis comportemental mozaik",
    "parle":"avis comportemental mozaik",
    "derang":"avis comportemental mozaik",
    "devoir":"avis organisationnel mozaik",
    "materiel":"avis organisationnel mozaik",
    "oubli":"avis organisationnel mozaik",
    "soi":"avis mozaik encadrement",
    "presence":"presences absence retard mozaik",
    "absent":"presences mozaik",
    "retard":"presences mozaik",
    "parent":"mes courriels courriel tuteur",
    "email":"mes courriels courriel",
    "adresse":"mes courriels courriel",
    "reprise":"reservation examen etude surveillee",
    "exam":"reservation reprise examen",
    "test":"reservation reprise examen",
    "convoc":"reservation convocation",
    "chromebook":"reservation ressource chariot",
    "chariot":"reservation chromebook ressource",
    "local":"reservation recuperation salle",
    "recup":"recuperation reservation local",
    "plan":"plan classe intervention",
    "bureau":"plan classe",
    "mesure":"plan intervention adaptation plan classe",
    "adapt":"plan intervention mesures plan classe",
    "trace":"note evolutive dossier suivi",
    "rencontre":"note evolutive suivi",
    "collecte":"tour de table",
    "enseignants":"tour table courriels",
    "drive":"documents tutoriels guide",
    "favori":"chrome lancement",
    "ordi":"chrome favoris synchronisation",
    "lancement":"chrome appsp favoris",
    "insolence":"sortie expulsion avis comportemental",
    "impoli":"sortie expulsion avis comportemental",
    "impolitesse":"sortie expulsion avis comportemental",
    "refus":"sortie expulsion travail avis",
    "travaille pas":"sortie expulsion refus travail",
    "violence":"sortie expulsion majeur direction",
    "bagarre":"sortie expulsion majeur violence",
    "vandalisme":"sortie expulsion majeur",
    "bris":"sortie expulsion majeur vandalisme",
    "corridor":"sortie avis comportemental",
    "retenue":"reservation convocation",
    "etude":"reservation etude surveillee",
    "surveillee":"reservation etude surveillee",
    "sport":"reservation 48 heures sae",
    "arts":"reservation 48 heures sae",
    "horaire":"reservation chrome appsp",
    "liste":"mes courriels plan classe",
    "photo":"plan classe",
    "parents":"mes courriels note evolutive",
    "tuteur":"mes courriels tour table avis",
    "tes":"sortie avis tour table",
    "psycho":"note evolutive tour table",
    "orthopedagogue":"note evolutive plan intervention",
    "pi":"plan intervention mesures adaptation",
    "adaptation":"plan intervention plan classe",
    "mesures":"plan intervention plan classe",
    "dossier":"note evolutive plan intervention",
    "commentaire":"tour table note evolutive",
    "google":"connexion appsp chrome",
    "microsoft":"connexion appsp",
    "connexion":"connexion appsp",
    "login":"connexion appsp",
    "portable":"chromebook reservation",
    "ordinateur":"chromebook reservation chrome",
    "emprunt":"chromebook reservation",
    "emprunter":"chromebook reservation",
    "ressource techno":"chromebook reservation",
    "technologie":"chromebook reservation",
    "nouveau":"connexion appsp chrome drive mozaik",
    "nouvel enseignant":"connexion appsp chrome drive mozaik",
    "commencer":"connexion appsp chrome drive mozaik",
    "discipline":"reservation convocation sport arts etudes 48 heures",
    "48h":"reservation convocation sport arts etudes",
    "48 heures":"reservation convocation sport arts etudes",
    "travail non fait":"avis organisationnel mozaik",
    "devoir non fait":"avis organisationnel mozaik",
    "oublie son materiel":"avis organisationnel mozaik",
    "refuse":"sortie expulsion refus travail avis",
    "refus de travail":"sortie expulsion mes suivis",
    "impolitesse grave":"sortie expulsion majeur direction",
    "vandalise":"sortie expulsion majeur vandalisme",
    "local transit":"sortie expulsion retrait",
    "retrait":"sortie expulsion transit mes suivis",
    "message parent":"mes courriels courriel parent",
    "ecrire parent":"mes courriels courriel parent",
    "écrire parent":"mes courriels courriel parent",
    "liste eleves":"plan classe mes courriels",
    "liste élèves":"plan classe mes courriels",
    "pdf plan":"plan classe imprimer",
    "favoris":"chrome synchronisation",
    "nouvel ordi":"chrome synchronisation favoris",
    "premiere annee":"connexion appsp chrome drive mozaik",
    "première année":"connexion appsp chrome drive mozaik",
    "aide":"connexion appsp chrome drive mozaik"
  };

  const data = cards.map(card => ({
    card,
    id:card.id,
    title:card.dataset.title,
    icon:card.dataset.icon || '•',
    hay:norm(card.dataset.title+' '+card.dataset.keywords+' '+card.innerText)
  }));

  function lev(a,b){
    if(a===b) return 0;
    if(!a.length) return b.length;
    if(!b.length) return a.length;
    const v0=Array(b.length+1).fill(0).map((_,i)=>i), v1=Array(b.length+1);
    for(let i=0;i<a.length;i++){
      v1[0]=i+1;
      for(let j=0;j<b.length;j++){
        const cost=a[i]===b[j]?0:1;
        v1[j+1]=Math.min(v1[j]+1,v0[j+1]+1,v0[j]+cost);
      }
      for(let j=0;j<v0.length;j++) v0[j]=v1[j];
    }
    return v0[b.length];
  }

  function tokens(q){
    let n=norm(q), arr=n.split(' ').filter(Boolean);
    for(const [k,v] of Object.entries(aliases)){
      if(n.includes(k)) arr.push(...v.split(' '));
    }
    return [...new Set(arr)];
  }

  function tokenScore(hay,title,t){
    if(title.includes(t)) return 14;
    if(hay.includes(' '+t+' ') || hay.startsWith(t+' ') || hay.endsWith(' '+t)) return 8;
    if(hay.includes(t)) return 5;
    if(t.length>=4){
      const words=hay.split(' ');
      for(const w of words){
        if(w.length>=4 && (w.startsWith(t)||t.startsWith(w))) return 3;
        if(w.length>=5 && lev(w,t)<=1) return 2.5;
        if(w.length>=7 && lev(w,t)<=2) return 1.5;
      }
    }
    return 0;
  }

  function rank(q){
    const ts=tokens(q);
    return data.map(x=>{
      const title=norm(x.title);
      let score=ts.reduce((s,t)=>s+tokenScore(x.hay,title,t),0);
      return {...x,score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  }

  let activeIndex = -1;

  function setActive(index){
    const items=[...results.querySelectorAll('.result')];
    if(!items.length){activeIndex=-1;return}
    activeIndex=(index+items.length)%items.length;
    items.forEach((el,i)=>{
      el.classList.toggle('active',i===activeIndex);
      el.setAttribute('aria-selected',i===activeIndex?'true':'false');
    });
    items[activeIndex]?.scrollIntoView({block:'nearest'});
  }

  function render(){
    const q=input.value.trim();
    activeIndex=-1;
    clear.style.display=q?'block':'none';
    if(!q){
      cards.forEach(c=>c.classList.remove('hidden'));
      results.style.display='none';
      input.setAttribute('aria-expanded','false');
      noResults.style.display='none';
      return;
    }
    const found=rank(q);
    cards.forEach(c=>c.classList.toggle('hidden',!found.some(f=>f.id===c.id)));
    noResults.style.display=found.length?'none':'block';
    const destinations={
      sortie:"Mes suivis",avis:"Mozaïk Portail",presences:"Mozaïk Portail",
      reservation:"Réservation",chromebook:"Réservation",courriels:"Mes courriels",
      planclasse:"Plan de classe",notes:"Mes suivis",tourtable:"Mes suivis",
      pi:"Plan d’intervention",chrome:"Chrome",drive:"Drive commun","connexion-appsp":"AppSP"
    };
    results.innerHTML=found.slice(0,8).map(f=>
      `<a class="result" href="#${f.id}"><span class="result-icon">${f.icon}</span><span><strong>${f.title}</strong><small>${destinations[f.id] ? ' · '+destinations[f.id] : ''}</small></span><span class="go">→</span></a>`
    ).join('');
    results.style.display=found.length?'block':'none';
    input.setAttribute('aria-expanded',found.length?'true':'false');
  }

  input.addEventListener('input',render);
  clear.addEventListener('click',()=>{input.value='';render();input.focus()});
  input.addEventListener('keydown',e=>{
    const items=[...results.querySelectorAll('.result')];
    if(e.key==='ArrowDown' && items.length){e.preventDefault();setActive(activeIndex+1)}
    if(e.key==='ArrowUp' && items.length){e.preventDefault();setActive(activeIndex-1)}
    if(e.key==='Enter'){
      const target=activeIndex>=0?items[activeIndex]:items[0];
      if(target){e.preventDefault();target.click();results.style.display='none';input.setAttribute('aria-expanded','false')}
    }
    if(e.key==='Escape'){results.style.display='none';input.setAttribute('aria-expanded','false');input.blur()}
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){
      e.preventDefault();input.focus();input.select();
    }
  });
  results.addEventListener('click',()=>setTimeout(()=>{results.style.display='none';input.setAttribute('aria-expanded','false')},30));
  document.addEventListener('click',e=>{if(!e.target.closest('.search-area')){results.style.display='none';input.setAttribute('aria-expanded','false')}});
})();

const backTop=document.getElementById('backTop');
window.addEventListener('scroll',()=>backTop?.classList.toggle('show',window.scrollY>650),{passive:true});

function copyPageLink(){
  navigator.clipboard?.writeText(location.href).then(()=>alert('Lien copié.')).catch(()=>prompt('Copiez ce lien :',location.href));
}
