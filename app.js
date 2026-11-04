'use strict';
(function () {
const STORE = 'django-atelier-yuva-v1';
const SOURCE = 'https://drive.google.com/file/d/17fYSMde_wWMItya2s1-2tvjPaTu07Qpd/view';
const MODULES = [
 {id:'fondations',number:'01',title:'Maîtriser les bases',description:'Le framework, ton environnement et tes premières pages.',icon:'layers',color:'mint',pages:'2–39'},
 {id:'donnees',number:'02',title:'Manipuler les données',description:'Des modèles aux QuerySet : donne vie à tes données.',icon:'database',color:'lavender',pages:'40–58'},
 {id:'crud',number:'03',title:'Construire une interface CRUD',description:'Créer, lire, modifier et supprimer des centres sportifs.',icon:'code',color:'peach',pages:'59–75'},
 {id:'auth',number:'04',title:'Gérer l’authentification',description:'Comptes, connexion et permissions : à chacun son accès.',icon:'shield',color:'yellow',pages:'76–96'}
];
const PATHS = {
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-8h6v8"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
 book:'<path d="M12 5v16M3 3c4-1 7 1 9 2 2-1 5-3 9-2v16c-4-1-7 1-9 2-2-1-5-3-9-2Z"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8Z"/><path d="m2 12 10 5 10-5M2 16l10 5 10-5"/>',
 database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
 code:'<path d="m7 6-5 6 5 6m10-12 5 6-5 6M14 3l-4 18"/>',
 shield:'<path d="m12 2 8 4v7c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
 flask:'<path d="M9 2h6M10 2v7l-7 10c-1 2 1 3 2 3h14c1 0 3-1 2-3L14 9V2M6 15h12"/>',
 cards:'<rect x="6" y="6" width="14" height="16" rx="2"/><path d="M3 17 1 4a2 2 0 0 1 2-2l12-1M10 11h6m-6 4h4"/>',
 note:'<path d="M14 2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9Z"/><path d="M14 2v7h7M7 13h10M7 17h7"/>',
 search:'<circle cx="10.8" cy="10.8" r="7.3"/><path d="m16 16 5 5"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 back:'<path d="M20 12H4m6-6-6 6 6 6"/>',
 down:'<path d="m6 9 6 6 6-6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>',
 play:'<path d="m9 5 11 7-11 7Z"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 checkCircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
 circle:'<circle cx="12" cy="12" r="9"/>',
 trophy:'<path d="M8 3h8v7c0 6-8 6-8 0ZM8 5H4v3c0 3 4 3 4 3m8-6h4v3c0 3-4 3-4 3M12 14v5m-5 2h10"/>',
 bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>',
 star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
 bookmark:'<path d="M5 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v19l-7-5-7 5Z"/>',
 terminal:'<path d="m6 7 4 4-4 4m8 0h4"/><rect x="2" y="3" width="20" height="18" rx="3"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18M7 14h2M12 14h2"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 settings:'<path d="m10 2-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3Z" transform="translate(0 -1) scale(.95)"/><circle cx="11.5" cy="11" r="3"/>',
 external:'<path d="M14 3h7v7M10 14 21 3M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>',
 copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
 light:'<path d="M9 18v-3c-6-5-3-12 3-12s9 7 3 12v3Zm0 3h6"/>',
 refresh:'<path d="M20 7a9 9 0 0 0-16 2M4 3v6h6M4 17a9 9 0 0 0 16-2m0 6v-6h-6"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
 upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
 heart:'<path d="M20 4c-3-2-6 0-8 3-2-3-5-5-8-3-6 4 1 11 8 17 7-6 14-13 8-17Z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>'
};
const icon = (name) => '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (PATHS[name] || PATHS.book) + '</svg>';
const h = (value) => String(value == null ? '' : value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich = (value) => h(value).replace(/\x60([^\x60]+)\x60/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const paragraphs = (value) => String(value||'').split(/\n\s*\n/).map(p=>'<p>'+rich(p).replace(/\n/g,'<br>')+'</p>').join('');
let LESSONS = [], state, quizSession = null, currentTab = 'cours';
let exerciseFeedback = {}, reviewMode = 'cards', reviewModule = 'all', cardIndex = 0, cardFlipped = false, includeKnown = false, notesMode = 'notes';
let toastTimer, priorFocus, storageUnavailable = false;
function emptyState(){return {version:1,lastLesson:null,read:{},quiz:{},exercises:{},notes:{},favorites:[],knownCards:[],days:[]};}
function sanitizeState(input){
 const out=emptyState(),ids=new Set(LESSONS.map(l=>l.id));
 if(!input||typeof input!=='object')return out;
 if(ids.has(input.lastLesson))out.lastLesson=input.lastLesson;
 ['read','exercises'].forEach(key=>{if(input[key]&&typeof input[key]==='object')Object.keys(input[key]).forEach(id=>{if(ids.has(id)&&input[key][id]===true)out[key][id]=true;});});
 if(input.notes&&typeof input.notes==='object')Object.entries(input.notes).forEach(([id,note])=>{if(ids.has(id)&&typeof note==='string')out.notes[id]=note.slice(0,20000);});
 if(input.quiz&&typeof input.quiz==='object')Object.entries(input.quiz).forEach(([id,q])=>{if(ids.has(id)&&q&&Number.isInteger(q.best)&&q.best>=0&&q.best<=3)out.quiz[id]={best:q.best,attempts:Math.max(1,Math.min(100000,Number(q.attempts)||1)),lastScore:Math.max(0,Math.min(3,Number(q.lastScore)||0)),lastAt:typeof q.lastAt==='string'?q.lastAt:''};});
 if(Array.isArray(input.favorites))out.favorites=[...new Set(input.favorites.filter(x=>ids.has(x)))];
 const cards=new Set(LESSONS.flatMap(l=>l.flashcards.map((_,i)=>l.id+'-'+i)));
 if(Array.isArray(input.knownCards))out.knownCards=[...new Set(input.knownCards.filter(x=>cards.has(x)))];
 if(Array.isArray(input.days))out.days=[...new Set(input.days.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)))].slice(-366);
 return out;
}
function readState(){try{return sanitizeState(JSON.parse(localStorage.getItem(STORE)));}catch(e){return emptyState();}}
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){if(!storageUnavailable){storageUnavailable=true;toast('Le stockage est indisponible. Exporte ta progression avant de quitter.');}}}
function activeDay(){const now=new Date();const day=now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');if(!state.days.includes(day))state.days.push(day);}
const done = (id) => !!state.quiz[id] && state.quiz[id].best>=2;
const completed = () => LESSONS.filter(l=>done(l.id)).length;
const percent = () => Math.round(completed()/LESSONS.length*100);
const moduleLessons = (id) => LESSONS.filter(l=>l.moduleId===id);
const moduleById = (id) => MODULES.find(m=>m.id===id)||MODULES[0];
const lessonById = (id) => LESSONS.find(l=>l.id===id);
const xp = () => Object.values(state.quiz).reduce((s,q)=>s+q.best*10,0)+Object.keys(state.exercises).length*5+state.knownCards.length*2;
function nextLesson(){return lessonById(state.lastLesson)&&!done(state.lastLesson)?lessonById(state.lastLesson):(LESSONS.find(l=>!done(l.id))||LESSONS[0]);}
function progressBar(p){return '<div class="progress-bar" role="progressbar" aria-valuenow="'+p+'" aria-valuemin="0" aria-valuemax="100" aria-label="Progression"><span style="width:'+p+'%"></span></div>';}
function toast(message){const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3300);}
function route(){const bits=location.hash.replace(/^#\/?/,'').split('/');return {page:bits[0]||'accueil',id:bits[1],tab:bits[2]||'cours'};}
function navigate(hash){if(location.hash===hash)render(true);else location.hash=hash;}
function button(text,action,style='primary',extra=''){return '<button class="btn btn-'+style+'" data-action="'+action+'" '+extra+'>'+text+'</button>';}
function lessonLink(l,label,style='primary',tab='cours'){return '<a class="btn btn-'+style+'" href="#/lecon/'+l.id+'/'+tab+'">'+label+icon('arrow')+'</a>';}
function codeCard(code,filename,language){
 let last=0,result='',match;
 const reg=/(#.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:from|import|def|class|return|if|elif|else|for|in|None|True|False|as|with|pass|not|and|or|try|except)\b|\b\d+\b)/gm;
 while((match=reg.exec(code))!==null){result+=h(code.slice(last,match.index));const token=match[0],type=token.startsWith('#')?'comment':/^["']/.test(token)?'string':/^\d/.test(token)?'number':'keyword';result+='<span class="tok-'+type+'">'+h(token)+'</span>';last=reg.lastIndex;}
 result+=h(code.slice(last));
 return '<div class="code-card"><div class="code-head">'+icon('code')+'<span>'+h(filename||language||'Exemple')+'</span><button type="button" class="copy-btn" data-action="copy">'+icon('copy')+'Copier</button></div><pre><code>'+result+'</code></pre></div>';
}
function sidebar(page){
 const nav=[['accueil','grid','Mon espace'],['parcours','book','Le parcours'],['ateliers','flask','Ateliers interactifs'],['revisions','cards','Révisions'],['notes','note','Mes notes']];
 const active=page==='lecon'?'parcours':page==='atelier'?'ateliers':page;
 return '<div class="mobile-overlay" data-action="close-menu"></div><aside class="sidebar" aria-label="Navigation principale"><button class="icon-btn mobile-close" data-action="close-menu" aria-label="Fermer le menu">'+icon('close')+'</button><a class="brand" href="#/accueil" aria-label="Django Atelier, accueil"><span class="brand-mark">dj</span><span class="brand-name">django<span>ATELIER</span></span></a><div class="nav-caption">TON ESPACE</div><nav class="main-nav">'+nav.map(n=>'<a class="nav-item '+(active===n[0]?'active':'')+'" href="#/'+n[0]+'" '+(active===n[0]?'aria-current="page"':'')+'>'+icon(n[1])+'<span>'+n[2]+'</span>'+(n[0]==='ateliers'?'<span class="nav-count">4</span>':'')+'</a>').join('')+'</nav><div class="sidebar-path"><div class="nav-caption">LE FIL DU PARCOURS</div>'+MODULES.map(m=>'<a class="module-nav" href="#/parcours/'+m.id+'"><span class="module-dot '+(moduleLessons(m.id).every(l=>done(l.id))?'done':'')+'"></span>'+m.number+' · '+(m.id==='fondations'?'Les fondations':m.id==='donnees'?'Les données':m.id==='crud'?'L’interface CRUD':'L’authentification')+'</a>').join('')+'</div><div class="sidebar-bottom"><div class="sidebar-progress"><div class="row between"><span>Un pas à la fois.</span><span>'+percent()+' %</span></div>'+progressBar(percent())+'</div><a class="module-nav" href="#/sources">'+icon('book')+'Le support de cours'+icon('external')+'</a><div class="profile"><span class="avatar">Y</span><div><strong>Yuva</strong><small>Apprendre en construisant</small></div><a class="icon-btn" href="#/preferences" aria-label="Préférences et sauvegarde">'+icon('settings')+'</a></div></div></aside>';
}
function shell(content,page){
 const labels={accueil:'Mon espace',parcours:'Le parcours',lecon:'Le parcours',ateliers:'Ateliers interactifs',atelier:'Ateliers interactifs',revisions:'Révisions',notes:'Mes notes',preferences:'Préférences',sources:'Le support de cours'};
 const label=labels[page]||'Mon espace';
 return '<div class="app-shell">'+sidebar(page)+'<div class="page-shell"><header class="topbar"><button class="icon-btn mobile-menu" data-action="open-menu" aria-label="Ouvrir le menu" aria-expanded="false">'+icon('menu')+'</button><div class="breadcrumb">'+icon('home')+'<span>Formation</span>'+icon('chevron')+'<strong>'+label+'</strong></div><div class="topbar-right"><button class="search-trigger" data-action="search" aria-label="Rechercher dans le cours">'+icon('search')+'<span>Une notion, une leçon…</span><kbd>/</kbd></button><span class="streak" title="Points gagnés par les quiz, exercices et cartes">'+icon('bolt')+'<span>'+xp()+' XP</span></span><a class="top-avatar" href="#/preferences" aria-label="Préférences de Yuva">Y</a></div></header><main class="main" id="main" tabindex="-1">'+content+'<footer class="app-footer"><span>Django Atelier <span aria-hidden="true">·</span> Comprendre, pratiquer, progresser.</span><a href="#/sources">Adapté de ton cours Synapse Learners '+icon('external')+'</a></footer></main></div></div>';
}
function moduleCard(m){
 const list=moduleLessons(m.id),n=list.filter(l=>done(l.id)).length,p=Math.round(n/list.length*100),minutes=list.reduce((s,l)=>s+l.duration,0);
 return '<a class="module-card" data-color="'+m.color+'" href="#/parcours/'+m.id+'"><div class="module-top"><span class="module-icon">'+icon(m.icon)+'</span><span class="module-number">MODULE '+m.number+'</span></div><h3>'+m.title+'</h3><p class="module-description">'+m.description+'</p><div class="module-meta"><span>'+icon('book')+' '+list.length+' leçons</span><span>'+icon('clock')+' ~'+minutes+' min</span></div>'+progressBar(p)+'<div class="module-foot"><span>'+(n?n+' / '+list.length+' validées':'Prêt à explorer')+'</span>'+icon('arrow')+'</div></a>';
}
function heroVisual(){return '<div class="hero-visual" aria-hidden="true"><div class="visual-orbit"></div><div class="visual-spark">✦</div><div class="visual-dj">dj</div><div class="visual-window"><div class="window-dots"><i></i><i></i><i></i><span>views.py</span></div><div class="visual-code"><span class="code-line"><b>def</b> accueil(request):</span><span class="code-line indent">centres = Centre.objects.all()</span><span class="code-line indent"><b>return</b> render(request,</span><span class="code-line indent"> &nbsp; "accueil.html",</span><span class="code-line indent"> &nbsp; {"centres": centres})</span></div></div><div class="visual-label one">'+icon('database')+'Modèle</div><div class="visual-label two">'+icon('code')+'Vue</div><div class="visual-label three">'+icon('layers')+'Template</div></div>';}
function dashboard(){
 const next=nextLesson(),started=Object.keys(state.quiz).length||Object.keys(state.read).length;
 const date=new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long',timeZone:'Europe/Paris'}).format(new Date());
 return '<div class="page-heading"><div><h1>Bonjour Yuva <span aria-hidden="true">✳</span></h1><p>Une nouvelle compétence commence par un petit pas.</p></div><span class="date-tag">'+icon('calendar')+h(date)+'</span></div><div class="dashboard-grid"><div><section class="hero"><div class="hero-copy"><span class="eyebrow">TON VOYAGE DANS LE DÉVELOPPEMENT WEB</span><h2>Construis. Comprends.<br><em>Progresse.</em></h2><p>De ta première ligne de Django à une application complète. À ton rythme, par la pratique.</p>'+lessonLink(next,started?'Reprendre le parcours':'Commencer le parcours','lime')+'</div>'+heroVisual()+'</section><div class="stats-strip">'+[['layers','4','modules'],['book',LESSONS.length,'leçons guidées'],['target',LESSONS.length*3,'questions'],['cards',LESSONS.reduce((s,l)=>s+l.flashcards.length,0),'cartes mémoire']].map(s=>'<div class="stat"><span class="stat-icon">'+icon(s[0])+'</span><div><strong>'+s[1]+'</strong><small>'+s[2]+'</small></div></div>').join('')+'</div><section><div class="section-heading"><div><h2>Ton parcours, étape par étape</h2><p>Quatre modules. Un vrai projet à construire.</p></div><a class="text-link" href="#/parcours">Tout voir '+icon('arrow')+'</a></div><div class="module-grid">'+MODULES.map(moduleCard).join('')+'</div></section></div><aside class="right-rail"><section class="card next-card"><span class="eyebrow">CHAQUE PETIT PAS COMPTE</span><h2 class="next-title">Ta progression</h2><div class="ring-row"><div class="ring" style="--percent:'+percent()+'%"><div class="ring-inner">'+percent()+'<small>%</small></div></div><div><strong>'+completed()+' sur '+LESSONS.length+' leçons</strong><small>validées par un quiz</small></div></div><p>'+(completed()===LESSONS.length?'Tout le parcours est validé ! Continue à consolider tes acquis avec les cartes mémoire.':'Lis, essaie, puis valide tes acquis. Le parcours reste toujours ouvert.')+'</p><div class="mini-lesson"><span class="lesson-icon">'+icon('play')+'</span><div><strong>'+h(next.shortTitle||next.title)+'</strong><small>Module '+moduleById(next.moduleId).number+' · '+next.duration+' min estimées</small></div></div>'+lessonLink(next,started?'Continuer à apprendre':'C’est parti')+'</section><section class="practice-card"><span class="eyebrow">APPRENDRE EN FAISANT</span><h3>Moins de théorie.<br>Plus de déclics.</h3><p>Teste tes idées dans les ateliers, sans rien installer.</p><div class="mini-terminal" aria-hidden="true"><div class="dots">● ● ●</div><span>› python -m django --version</span><br><span style="color:#e0ecba">5.2.x</span><span class="caret"></span></div><a class="text-link" href="#/ateliers">Ouvrir les ateliers '+icon('arrow')+'</a></section><div class="source-tip">'+icon('light')+'<div><strong>Un seul fil rouge : Musculor</strong><p>Tu construis le site d’un réseau de salles de sport, en suivant <a href="#/sources">le plan de ton cours</a>.</p></div></div></aside></div>';
}
function coursePage(filter){
 const selected=MODULES.find(m=>m.id===filter),modules=selected?[selected]:MODULES;
 return '<div class="course-header"><div class="page-intro"><span class="eyebrow">LE PARCOURS COMPLET</span><h1>'+(selected?selected.title:'Une idée. Quatre étapes. Un projet.')+'</h1><p>Le plan de ton support, transformé en petites étapes concrètes. Toutes les leçons sont accessibles à tout moment.</p></div><span class="course-overview">'+completed()+' / '+LESSONS.length+' leçons validées</span></div>'+(selected?'<a href="#/parcours" class="text-link mb-24">'+icon('back')+' Voir les quatre modules</a>':'')+modules.map(m=>{
 const list=moduleLessons(m.id),n=list.filter(l=>done(l.id)).length;
 return '<section class="module-section" id="module-'+m.id+'"><header class="module-section-header" data-color="'+m.color+'"><span class="module-icon">'+icon(m.icon)+'</span><div><span class="eyebrow">MODULE '+m.number+' · '+list.length+' LEÇONS</span><h2>'+m.title+'</h2><p>'+m.description+'</p></div><div class="module-section-status">'+n+'/'+list.length+' validées'+progressBar(Math.round(n/list.length*100))+'</div></header>'+list.map((l,i)=>'<a class="lesson-row" href="#/lecon/'+l.id+'/cours"><span class="lesson-index '+(done(l.id)?'done':'')+'">'+(done(l.id)?icon('check'):String(i+1).padStart(2,'0'))+'</span><div><strong>'+h(l.title)+'</strong><small>'+(done(l.id)?'Quiz validé · '+state.quiz[l.id].best+'/3':state.read[l.id]?'Cours lu · quiz à valider':'Cours + exercice + quiz')+'</small></div><span class="lesson-duration">'+(state.favorites.includes(l.id)?icon('bookmark'):'')+'<span>'+l.duration+' min</span>'+icon('chevron')+'</span></a>').join('')+'</section>';
 }).join('');
}
function lessonAside(l){
 const m=moduleById(l.moduleId),record=state.quiz[l.id];
 return '<aside class="lesson-aside"><section class="card outline-card"><h3>Dans cette leçon</h3>'+l.sections.map((s,i)=>'<a class="outline-link" href="#section-'+i+'" data-action="section" data-index="'+i+'">'+String(i+1).padStart(2,'0')+' &nbsp; '+h(s.title)+'</a>').join('')+'</section><section class="card"><span class="eyebrow">TON AVANCEMENT</span><div class="row between"><span class="small-label">Cours</span><span class="tag '+(state.read[l.id]?'tag-success':'tag-outline')+'">'+(state.read[l.id]?'Lu':'À lire')+'</span></div><div class="row between" style="margin-top:12px"><span class="small-label">Exercice</span><span class="tag '+(state.exercises[l.id]?'tag-success':'tag-outline')+'">'+(state.exercises[l.id]?'Réussi':'À essayer')+'</span></div><div class="row between" style="margin-top:12px"><span class="small-label">Quiz</span><span class="tag '+(done(l.id)?'tag-success':'tag-outline')+'">'+(record?record.best+'/3':'À découvrir')+'</span></div><p class="lesson-side-meta" style="margin-top:15px">2 bonnes réponses sur 3 pour valider la leçon. Tu peux recommencer autant que nécessaire.</p></section><section class="card"><h3>'+icon('book')+' Ton support</h3><p class="lesson-side-meta">Formation Django — Synapse Learners<br>Partie '+m.number+' · p. '+h(l.pages)+'<br>Exemples adaptés à Django 5.2.</p><a class="text-link" href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Ouvrir le PDF '+icon('external')+'</a></section></aside>';
}
function lessonBody(l){
 return '<section class="lesson-objectives"><h3>À la fin, tu sauras…</h3><ul>'+l.objectives.map(o=>'<li>'+icon('checkCircle')+'<span>'+rich(o)+'</span></li>').join('')+'</ul></section>'+l.sections.map((s,i)=>'<section class="lesson-section" id="section-'+i+'"><h2><span class="section-num">'+String(i+1).padStart(2,'0')+'</span>'+h(s.title)+'</h2>'+paragraphs(s.body)+(s.bullets?'<ul>'+s.bullets.map(b=>'<li>'+rich(b)+'</li>').join('')+'</ul>':'')+(s.code?codeCard(s.code,s.filename,s.language):'')+(s.callout?'<aside class="callout">'+rich(s.callout)+'</aside>':'')+'</section>').join('')+'<section class="takeaway"><h3>'+icon('light')+' Le déclic à retenir</h3><p>'+rich(l.takeaway)+'</p></section><div class="lesson-actions">'+button(icon('check')+(state.read[l.id]?'Cours lu':'J’ai lu cette leçon'),'mark-read','secondary','data-id="'+l.id+'"')+'<a class="btn btn-primary" href="#/lecon/'+l.id+'/pratique">Passer à la pratique '+icon('arrow')+'</a></div>';
}
function lessonPractice(l){
 const f=exerciseFeedback[l.id],ex=l.exercise;
 const workshop=l.moduleId==='fondations'?(l.id==='f2'||l.id==='f3'?'terminal':'mvt'):l.moduleId==='donnees'?'orm':'crud';
 return '<section class="exercise-box"><span class="eyebrow">À TOI DE JOUER</span><h2>Un petit exercice, un grand déclic.</h2><p>'+rich(ex.prompt)+'</p>'+codeCard(ex.code,'Complète le code','python')+'<form id="exercise-form" data-lesson="'+l.id+'"><label class="field-label" for="exercise-answer">Remplace ___ par la bonne expression</label><div class="answer-field"><input class="input" id="exercise-answer" name="answer" autocomplete="off" spellcheck="false" aria-describedby="exercise-result" placeholder="Ta réponse…" value="'+h(f?.answer||'')+'" required><button class="btn btn-primary" type="submit">Vérifier '+icon('check')+'</button></div></form><div id="exercise-result" aria-live="polite">'+(f?'<div class="feedback '+(f.correct?'':'error')+'"><strong>'+(f.correct?'Bien joué. ':'Pas encore. ')+'</strong>'+rich(f.correct?ex.explanation:'Relis le code et essaie encore. L’indice peut t’aider.')+'</div>':'')+'</div>'+button(icon('light')+'Un indice','exercise-hint','ghost','data-id="'+l.id+'"')+'<div id="exercise-hint" hidden class="hint">'+rich(ex.hint)+'</div></section><div class="card"><div class="row between wrap"><div><h3>Envie de voir ce mécanisme en action ?</h3><p class="muted" style="font-size:12px;margin-top:8px">L’atelier te laisse manipuler les concepts dans une simulation.</p></div><a class="btn btn-secondary" href="#/atelier/'+workshop+'">Ouvrir l’atelier '+icon('flask')+'</a></div></div><div class="lesson-actions"><a class="btn btn-ghost" href="#/lecon/'+l.id+'/cours">'+icon('back')+'Relire le cours</a><a class="btn btn-primary" href="#/lecon/'+l.id+'/quiz">Tester mes acquis '+icon('arrow')+'</a></div>';
}
function quizBody(l){
 if(!quizSession||quizSession.id!==l.id)quizSession={id:l.id,index:0,selected:null,answers:[],checked:false,finished:false,hint:false};
 const s=quizSession;
 if(s.finished){
 const score=s.answers.filter((a,i)=>a===l.quiz[i].correct).length,pass=score>=2,next=LESSONS[LESSONS.indexOf(l)+1];
 return '<section class="quiz-card result"><div class="result-medal">'+icon(pass?'trophy':'refresh')+'</div><span class="eyebrow">'+(pass?'UNE NOUVELLE ÉTAPE FRANCHIE':'TU ES EN TRAIN D’APPRENDRE')+'</span><h2>'+(pass?'Leçon validée. Bien joué !':'On consolide, puis on réessaie.')+'</h2><div class="score">'+score+' <span class="muted" style="font-size:23px">/ 3</span></div><p>'+(pass?'Tu as compris l’essentiel. Les cartes mémoire t’aideront à le retenir dans la durée.':'Il te faut 2 bonnes réponses sur 3 pour valider. Les explications ci-dessous te montrent exactement ce qu’il faut revoir.')+'</p><div class="row wrap">'+button(icon('refresh')+'Recommencer','quiz-restart','secondary','data-id="'+l.id+'"')+(pass&&next?lessonLink(next,'Leçon suivante'):!pass?'<a class="btn btn-primary" href="#/lecon/'+l.id+'/cours">Revoir le cours '+icon('book')+'</a>':'<a class="btn btn-primary" href="#/revisions">Consolider mes acquis '+icon('cards')+'</a>')+'</div><div class="quiz-review">'+l.quiz.map((q,i)=>'<details><summary>'+icon(s.answers[i]===q.correct?'checkCircle':'info')+' '+h(q.question)+'</summary><p><strong>Bonne réponse :</strong> '+rich(q.options[q.correct])+'</p><p>'+rich(q.explanation)+'</p></details>').join('')+'</div></section>';
 }
 const q=l.quiz[s.index],correct=s.selected===q.correct;
 return '<section class="quiz-card"><div class="quiz-topline"><span>QUESTION '+(s.index+1)+' SUR 3</span><span>2 / 3 pour valider</span></div>'+progressBar(s.index/3*100)+'<h2 class="quiz-question">'+h(q.question)+'</h2><div class="quiz-options" role="group" aria-label="Choisis une réponse">'+q.options.map((o,i)=>'<button class="quiz-option '+(s.selected===i?'selected ':'')+(s.checked?(i===q.correct?'correct':i===s.selected?'wrong':''):'')+'" data-action="quiz-select" data-option="'+i+'" aria-pressed="'+(s.selected===i)+'" '+(s.checked?'disabled':'')+'><span class="letter">'+String.fromCharCode(65+i)+'</span><span>'+rich(o)+'</span>'+(s.checked&&i===q.correct?icon('check'):'')+'</button>').join('')+'</div>'+(s.checked?'<div class="feedback '+(correct?'':'error')+'" role="status"><strong>'+(correct?'Exactement. ':'Voici le point à retenir. ')+'</strong>'+rich(q.explanation)+'</div>':'')+(s.hint?'<div class="hint">'+icon('light')+' '+rich(q.hint)+'</div>':'')+'<div class="quiz-actions">'+button(icon('light')+'Un indice','quiz-hint','ghost',s.checked?'disabled':'')+(s.checked?button((s.index===2?'Voir mon résultat':'Question suivante')+icon('arrow'),'quiz-next'):button('Valider ma réponse'+icon('check'),'quiz-check','primary',s.selected===null?'disabled':''))+'</div></section><p class="review-help" style="margin-top:18px">Les erreurs font partie du parcours. Ton meilleur score est conservé.</p>';
}
function lessonNotes(l){return '<section class="card"><span class="eyebrow">FAIS-EN TES PROPRES MOTS</span><h2 style="font-size:23px;margin-bottom:13px">Ton carnet de bord</h2><p class="muted" style="font-size:13px;margin-bottom:22px">Un exemple qui t’a parlé, une question à creuser, un lien avec tes projets… Garde ici ce qui compte pour toi.</p><label for="lesson-note" class="sr-only">Notes pour '+h(l.title)+'</label><textarea id="lesson-note" class="note-textarea" data-note="'+l.id+'" maxlength="20000" placeholder="Ce que j’ai compris, ce que je veux tester…">'+h(state.notes[l.id]||'')+'</textarea><div class="note-status"><span id="note-save-status">Sauvegarde automatique sur cet appareil</span><span id="note-count">'+(state.notes[l.id]||'').length+' / 20 000</span></div><a class="text-link" href="#/notes">Retrouver toutes mes notes '+icon('arrow')+'</a></section>';}
function lessonPage(id,tab){
 const l=lessonById(id);if(!l)return notFound();
 currentTab=['cours','pratique','quiz','notes'].includes(tab)?tab:'cours';
 if(state.lastLesson!==id){state.lastLesson=id;save();}
 const m=moduleById(l.moduleId),bookmarked=state.favorites.includes(id);
 return '<div class="chapter-banner"><a class="text-link" href="#/parcours/'+m.id+'">'+icon('back')+'Module '+m.number+' · '+m.title+'</a><span class="tag tag-outline">'+icon('clock')+l.duration+' min</span><button class="icon-btn '+(bookmarked?'active':'')+'" data-action="favorite" data-id="'+id+'" aria-label="'+(bookmarked?'Retirer des favoris':'Ajouter aux favoris')+'" aria-pressed="'+bookmarked+'">'+icon('bookmark')+'</button></div><div class="lesson-layout"><article class="lesson-article"><span class="eyebrow" style="color:#91a080">LEÇON '+String(l.order).padStart(2,'0')+' / '+LESSONS.length+'</span><h1 class="lesson-title">'+h(l.title)+'</h1><p class="lesson-lead">'+h(l.intro)+'</p><nav class="lesson-tabs" aria-label="Étapes de la leçon">'+[['cours','book','Comprendre'],['pratique','code','Pratiquer'],['quiz','target','Se tester'],['notes','note','Mes notes']].map(t=>'<a class="tab '+(currentTab===t[0]?'active':'')+'" href="#/lecon/'+id+'/'+t[0]+'" '+(currentTab===t[0]?'aria-current="page"':'')+'>'+icon(t[1])+t[2]+'</a>').join('')+'</nav><div id="lesson-panel">'+(currentTab==='cours'?lessonBody(l):currentTab==='pratique'?lessonPractice(l):currentTab==='quiz'?quizBody(l):lessonNotes(l))+'</div></article>'+lessonAside(l)+'</div>';
}
const WORKSHOP_META=[
 {id:'mvt',title:'Le voyage d’une requête',subtitle:'Suis une URL jusqu’à sa réponse HTML. Observe le rôle de la vue, du modèle et du template.',icon:'layers',color:'mint',tag:'Architecture MVT',time:'5 min'},
 {id:'terminal',title:'Ton premier environnement',subtitle:'Entraîne-toi aux bonnes commandes, de Python au projet Django. Une étape à la fois.',icon:'terminal',color:'lavender',tag:'Terminal guidé',time:'8 min'},
 {id:'orm',title:'Des données à portée de main',subtitle:'Filtre, trie et cherche des centres. Observe le QuerySet et sa traduction SQL pédagogique.',icon:'database',color:'yellow',tag:'Explorateur ORM',time:'5 min'},
 {id:'crud',title:'Aux commandes de Musculor',subtitle:'Crée et modifie des centres. Change de rôle pour comprendre ce que les permissions autorisent.',icon:'shield',color:'peach',tag:'CRUD & permissions',time:'8 min'}
];
function workshopArt(w){return '<div class="lab-art '+w.color+'" aria-hidden="true">'+(w.id==='mvt'?'<span class="art-block">'+icon('database')+'</span><span class="art-arrow">→</span><span class="art-block">'+icon('code')+'</span><span class="art-arrow">→</span><span class="art-block">'+icon('layers')+'</span>':w.id==='terminal'?'<div class="art-code">› python -m venv .venv<br>› source .venv/bin/activate<br><span style="opacity:.55">(.venv) Prêt à construire_</span></div>':w.id==='orm'?'<div class="art-code">Centre.objects<br>&nbsp;&nbsp;.filter(pays="France")<br>&nbsp;&nbsp;.order_by("nom")</div>':'<span class="art-shield">'+icon('shield')+'</span><span class="art-block">'+icon('check')+'</span>')+'</div>';}
function workshopsPage(){return '<div class="page-intro"><span class="eyebrow">LE LABORATOIRE</span><h1>La meilleure façon de comprendre ?<br>Essayer.</h1><p>Quatre ateliers pour rendre Django concret. Manipule, observe, recommence : tu peux tout tester sans installation.</p></div><div class="workshop-grid">'+WORKSHOP_META.map(w=>'<a class="workshop-card" href="#/atelier/'+w.id+'">'+workshopArt(w)+'<h2>'+w.title+'</h2><p>'+w.subtitle+'</p><div class="row between"><span class="tag">'+w.tag+'</span><span class="text-link">Essayer '+icon('arrow')+'</span></div></a>').join('')+'</div><p class="lab-intro-note">'+icon('info')+' Les ateliers sont des simulations pédagogiques. Pour exécuter du Python et Django, les leçons te guident sur ton ordinateur.</p>';}
function workshopPage(type){
 const w=WORKSHOP_META.find(x=>x.id===type);if(!w)return notFound();
 return '<a class="text-link mb-24" href="#/ateliers">'+icon('back')+'Tous les ateliers</a>'+(window.Workshops?window.Workshops.render(type):'<div class="card"><h1>'+w.title+'</h1><p>L’atelier n’a pas pu être chargé. Actualise la page.</p></div>');
}
function cardPool(){return LESSONS.filter(l=>reviewModule==='all'||l.moduleId===reviewModule).flatMap(l=>l.flashcards.map((c,i)=>({...c,id:l.id+'-'+i,lesson:l}))).filter(c=>includeKnown||!state.knownCards.includes(c.id));}
function revisionsPage(){
 const cards=cardPool();if(cardIndex>=cards.length)cardIndex=0;const card=cards[cardIndex];
 const weak=LESSONS.filter(l=>state.quiz[l.id]&&state.quiz[l.id].best<3);
 return '<div class="page-intro"><span class="eyebrow">UN PEU CHAQUE JOUR</span><h1>Transforme les déclics en réflexes.</h1><p>Retrouve l’idée avant de retourner la carte. Puis évalue toi-même ce que tu maîtrises et ce que tu veux revoir.</p></div><div class="review-controls"><div class="segmented" aria-label="Mode de révision"><button class="'+(reviewMode==='cards'?'active':'')+'" data-action="review-mode" data-mode="cards">Cartes mémoire</button><button class="'+(reviewMode==='weak'?'active':'')+'" data-action="review-mode" data-mode="weak">À retravailler '+(weak.length?'('+weak.length+')':'')+'</button></div>'+(reviewMode==='cards'?'<label class="sr-only" for="review-module">Filtrer par module</label><select id="review-module" class="filter-select"><option value="all">Tout le parcours · 48 cartes</option>'+MODULES.map(m=>'<option value="'+m.id+'" '+(reviewModule===m.id?'selected':'')+'>'+m.number+' · '+m.title+'</option>').join('')+'</select>':'')+'</div>'+(reviewMode==='weak'?(weak.length?'<div class="weak-list">'+weak.map(l=>'<div class="weak-item"><span class="module-icon" style="background:#f6f2e3;color:#aa9b62">'+icon('target')+'</span><div><h3>'+h(l.title)+'</h3><p>Meilleur score : '+state.quiz[l.id].best+'/3 · '+(done(l.id)?'Validé, à consolider':'À revoir pour valider')+'</p></div>'+lessonLink(l,'Réessayer','secondary','quiz')+'</div>').join('')+'</div>':'<div class="card empty-state"><div class="empty-icon">'+icon('target')+'</div><h2>Une révision qui suit tes besoins.</h2><p>Les leçons dont le quiz n’a pas encore obtenu 3/3 apparaîtront ici.</p><a class="btn btn-primary" href="#/parcours">Continuer le parcours '+icon('arrow')+'</a></div>'):'<div class="review-layout"><div class="flash-counter"><span>'+state.knownCards.length+' / 48 cartes acquises</span><label><input type="checkbox" id="include-known" '+(includeKnown?'checked':'')+'> Inclure les acquises</label></div>'+(card?'<button class="flashcard '+(cardFlipped?'flipped':'')+'" data-action="card-flip" aria-labelledby="card-content" aria-describedby="card-instruction"><span class="eyebrow">'+moduleById(card.lesson.moduleId).title+' · '+(cardFlipped?'LA RÉPONSE':'LA QUESTION')+'</span><h2 id="card-content">'+rich(cardFlipped?card.back:card.front)+'</h2><span class="flip-hint" id="card-instruction">'+icon('refresh')+(cardFlipped?'Clique pour revoir la question':'Réfléchis, puis clique pour retourner')+'</span></button><div class="flash-counter"><a class="text-link" href="#/lecon/'+card.lesson.id+'/cours">Revoir la leçon '+icon('arrow')+'</a><span>Carte '+(cardIndex+1)+' / '+cards.length+'</span></div><div class="flash-footer">'+button(icon('refresh')+'À revoir','card-review','secondary',cardFlipped?'':'disabled')+button(icon('check')+'Je maîtrise','card-know','primary',cardFlipped?'':'disabled')+'</div><p class="review-help">Retourne la carte avant de t’évaluer. Les cartes acquises quittent la pile à réviser.</p>':'<div class="card empty-state"><div class="empty-icon">'+icon('trophy')+'</div><h2>Toutes ces cartes sont acquises.</h2><p>Tu peux inclure les cartes acquises pour les revoir ou passer à un autre module.</p>'+button('Revoir les cartes acquises','include-known','secondary')+'</div>')+'</div>');
}
function notesPage(){
 const list=notesMode==='notes'?LESSONS.filter(l=>(state.notes[l.id]||'').trim()):LESSONS.filter(l=>state.favorites.includes(l.id));
 return '<div class="page-intro"><span class="eyebrow">TA BIBLIOTHÈQUE PERSONNELLE</span><h1>Garde ce qui fait tilt.</h1><p>Tes idées, tes exemples et les leçons à retrouver. Un espace à toi, enregistré dans ce navigateur.</p></div><div class="review-controls"><div class="segmented" aria-label="Contenu de la bibliothèque"><button class="'+(notesMode==='notes'?'active':'')+'" data-action="notes-mode" data-mode="notes">Mes notes</button><button class="'+(notesMode==='favorites'?'active':'')+'" data-action="notes-mode" data-mode="favorites">Mes favoris</button></div><a class="text-link" href="#/preferences">'+icon('download')+'Sauvegarder ma progression</a></div>'+(list.length?'<div class="notes-grid">'+list.map(l=>'<article class="note-card"><div class="row between"><span class="eyebrow">MODULE '+moduleById(l.moduleId).number+' · LEÇON '+l.order+'</span><button class="icon-btn '+(state.favorites.includes(l.id)?'active':'')+'" data-action="favorite" data-id="'+l.id+'" aria-label="'+(state.favorites.includes(l.id)?'Retirer des favoris':'Ajouter aux favoris')+'">'+icon('bookmark')+'</button></div><h3>'+h(l.title)+'</h3><p class="note-preview">'+h(notesMode==='notes'?state.notes[l.id]:l.intro)+'</p><a class="text-link" href="#/lecon/'+l.id+'/'+(notesMode==='notes'?'notes':'cours')+'">'+(notesMode==='notes'?'Ouvrir mes notes':'Revenir à la leçon')+' '+icon('arrow')+'</a></article>').join('')+'</div>':'<div class="card empty-state"><div class="empty-icon">'+icon(notesMode==='notes'?'note':'bookmark')+'</div><h2>'+(notesMode==='notes'?'Les bonnes idées méritent une place.':'Tes prochains favoris sont dans le parcours.')+'</h2><p>'+(notesMode==='notes'?'Dans chaque leçon, ouvre « Mes notes » pour conserver tes idées. Elles apparaîtront ici.':'Utilise le marque-page en haut d’une leçon pour la retrouver ici.')+'</p><a class="btn btn-primary" href="#/parcours">Explorer le parcours '+icon('arrow')+'</a></div>');
}
function preferencesPage(){
 return '<div class="page-intro"><span class="eyebrow">TON ESPACE, TES DONNÉES</span><h1>Apprends à ton rythme.</h1><p>La progression, les notes et les favoris sont conservés dans ce navigateur. Exporte-les pour les garder ou les transférer sur un autre appareil.</p></div><div class="settings-grid"><section class="card"><h2>Ta sauvegarde</h2><p>Un fichier regroupe tes scores, tes notes et tes cartes acquises. Importe-le dans un autre navigateur pour reprendre le parcours.</p><div class="row wrap">'+button(icon('download')+'Exporter','export')+button(icon('upload')+'Importer','import','secondary')+'</div><input type="file" id="import-file" accept="application/json,.json" hidden><p class="muted" style="font-size:11px;margin-top:17px">L’import remplace la progression de ce navigateur après confirmation. Aucune synchronisation entre appareils n’est activée.</p></section><section class="card"><h2>Ce qui compte dans la progression</h2><p>Une leçon est validée à partir de <strong>2 bonnes réponses sur 3</strong>. Le meilleur score est conservé. Lire le cours ou réussir l’exercice ne valide pas automatiquement le quiz.</p><p><strong>Les XP :</strong> 10 par bonne réponse de ton meilleur quiz, 5 par exercice réussi, 2 par carte acquise. Refaire le même exercice ne les multiplie pas.</p><span class="tag">'+xp()+' XP · '+state.days.length+' jour'+(state.days.length>1?'s':'')+' d’activité</span></section><section class="card"><h2>Ton environnement de travail</h2><p>Les ateliers fonctionnent directement ici. Le code des leçons est à essayer dans ton propre projet Django 5.2, avec Python et un environnement virtuel.</p><a class="text-link" href="#/lecon/f2/cours">Préparer mon environnement '+icon('arrow')+'</a><br><a class="text-link" href="#/sources">Consulter les sources et les adaptations '+icon('arrow')+'</a></section><section class="card danger-zone"><h2>Repartir du début</h2><p>Efface les scores, notes, favoris et cartes acquises de ce navigateur. Exporte une sauvegarde si tu souhaites les conserver.</p>'+button('Réinitialiser ma progression','reset','secondary')+'</section></div>';
}
function sourcesPage(){
 return '<div class="page-intro"><span class="eyebrow">LE POINT DE DÉPART</span><h1>Ton cours, une nouvelle façon d’apprendre.</h1><p>Le plan du support fourni est conservé. Les explications sont reformulées et enrichies d’activités pour passer de la lecture à la pratique.</p></div><section class="card source-card"><h2>Formation Django — Synapse Learners</h2><p>Le document que tu as partagé structure le parcours en quatre parties. Le projet Musculor reste notre fil rouge : construire le site d’un réseau de centres sportifs.</p><a class="btn btn-primary" href="'+SOURCE+'" target="_blank" rel="noopener noreferrer">Ouvrir le document original '+icon('external')+'</a><table class="source-table"><thead><tr><th>Partie du support</th><th>Repères PDF</th><th>Dans l’atelier</th></tr></thead><tbody>'+MODULES.map(m=>'<tr><td>'+m.number+' · '+m.title+'</td><td>p. '+m.pages+'</td><td>'+moduleLessons(m.id).length+' leçons</td></tr>').join('')+'</tbody></table><p style="font-size:11px;margin-top:15px">Les temps affichés sont des estimations de lecture et d’activité. Les pages servent de repères dans le document.</p></section><section class="card source-card"><h2>Des précisions pour apprendre juste</h2><p>Le support utilise notamment Django 4.1.2. Ce parcours prend Django 5.2 comme version de référence et apporte ces précisions, documentées dans les sources officielles :</p><ul><li><code>authenticate()</code> renvoie un objet utilisateur ou <code>None</code>, et non un booléen.</li><li><code>login_required</code> vérifie la connexion. Les droits de création, modification et suppression demandent aussi des permissions.</li><li>Le modèle utilisateur personnalisé est préparé dès le début, avant la première migration, puis expliqué dans la dernière partie.</li><li>Une migration se diagnostique. Supprimer la base ou les migrations existantes n’est pas une réparation générale.</li><li>Les formulaires sont validés côté serveur. Les actions de suppression et de déconnexion utilisent POST et la protection CSRF.</li><li>Une relation un-à-un reste une vraie relation ; une clé étrangère est portée par le côté « plusieurs » d’une relation un-à-plusieurs.</li></ul></section><section class="card source-card"><h2>Pour vérifier et aller plus loin</h2><ul><li><a href="https://docs.djangoproject.com/fr/5.2/intro/tutorial01/" target="_blank" rel="noopener noreferrer">Première application Django : projets, applications et vues</a></li><li><a href="https://docs.djangoproject.com/fr/5.2/topics/db/queries/" target="_blank" rel="noopener noreferrer">Modèles, QuerySet et requêtes</a></li><li><a href="https://docs.djangoproject.com/fr/5.2/topics/forms/modelforms/" target="_blank" rel="noopener noreferrer">Validation et ModelForm</a></li><li><a href="https://docs.djangoproject.com/fr/5.2/topics/auth/default/" target="_blank" rel="noopener noreferrer">Authentification et permissions</a></li><li><a href="https://docs.djangoproject.com/fr/5.2/topics/auth/customizing/" target="_blank" rel="noopener noreferrer">Personnaliser le modèle utilisateur</a></li><li><a href="https://docs.djangoproject.com/fr/5.2/topics/migrations/" target="_blank" rel="noopener noreferrer">Comprendre les migrations</a></li><li><a href="https://docs.python.org/fr/3/library/venv.html" target="_blank" rel="noopener noreferrer">Créer un environnement virtuel Python</a></li></ul><p style="font-size:11px">Django Atelier est une adaptation pédagogique indépendante de ton document, et non le site officiel de Django ou de Synapse Learners.</p></section>';
}
function notFound(){return '<div class="card empty-state"><div class="empty-icon">'+icon('search')+'</div><h1 style="font-size:27px">Cette étape n’existe pas.</h1><p style="margin-top:15px">Retrouve les leçons et les ateliers depuis ton espace.</p><a class="btn btn-primary" href="#/accueil">Revenir à mon espace '+icon('arrow')+'</a></div>';}
function render(scroll=true){
 const r=route(),y=window.scrollY,active=document.activeElement,focusId=active?.id,focusData=active?.dataset?{action:active.dataset.action,id:active.dataset.id,option:active.dataset.option,mode:active.dataset.mode}:null;
 const page=r.page;
 let content=page==='accueil'?dashboard():page==='parcours'?coursePage(r.id):page==='lecon'?lessonPage(r.id,r.tab):page==='ateliers'?workshopsPage():page==='atelier'?workshopPage(r.id):page==='revisions'?revisionsPage():page==='notes'?notesPage():page==='preferences'?preferencesPage():page==='sources'?sourcesPage():notFound();
 document.getElementById('app').innerHTML=shell(content,page);
 const title=page==='lecon'?lessonById(r.id)?.title:({accueil:'Ton espace',parcours:'Le parcours',ateliers:'Les ateliers',atelier:WORKSHOP_META.find(x=>x.id===r.id)?.title,revisions:'Les révisions',notes:'Tes notes',preferences:'Préférences',sources:'Le support'})[page];
 document.title=(title||'Apprendre en construisant')+' — Django Atelier';
 if(page==='atelier'&&window.Workshops)window.Workshops.init();
 if(scroll){window.scrollTo(0,0);document.getElementById('main').focus({preventScroll:true});}else{
  window.scrollTo(0,y);
  let target=focusId?document.getElementById(focusId):null;
  if(!target&&focusData?.action)target=Array.from(document.querySelectorAll('[data-action]')).find(e=>e.dataset.action===focusData.action&&e.dataset.id===focusData.id&&e.dataset.option===focusData.option&&e.dataset.mode===focusData.mode);
  if(focusData?.action==='quiz-check')target=document.querySelector('[data-action="quiz-next"]');
  if(focusData?.action==='quiz-next')target=document.querySelector('[data-action="quiz-select"]')||document.querySelector('[data-action="quiz-restart"]');
  if(focusData?.action==='card-know'||focusData?.action==='card-review')target=document.querySelector('.flashcard')||document.querySelector('[data-action="include-known"]');
  if(target&&!target.disabled)target.focus({preventScroll:true});
 }
}
function searchResults(query){
 const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const q=norm(query.trim()),found=q?LESSONS.filter(l=>norm([l.title,l.intro,l.takeaway,...(l.tags||[])].join(' ')).includes(q)):LESSONS.slice(0,6);
 return found.length?found.map(l=>'<a class="search-result" href="#/lecon/'+l.id+'/cours" data-action="search-result">'+icon(moduleById(l.moduleId).icon)+'<div><strong>'+h(l.title)+'</strong><small>Module '+moduleById(l.moduleId).number+' · '+l.duration+' min</small></div>'+icon('arrow')+'</a>').join(''):'<div class="search-empty">Aucune leçon trouvée. Essaie « modèle », « URL » ou « connexion ».</div>';
}
function openSearch(){
 const d=document.getElementById('search-dialog');priorFocus=document.activeElement;
 d.innerHTML='<div class="search-top">'+icon('search')+'<label id="search-title" for="course-search" class="sr-only">Rechercher une leçon</label><input type="search" id="course-search" placeholder="Une notion, une leçon…" autocomplete="off"><button class="search-esc" data-action="close-search" aria-label="Fermer la recherche">Échap</button></div><div class="search-results" id="search-results">'+searchResults('')+'</div><div class="search-bottom">Cherche une notion pour retrouver sa leçon. Tab pour parcourir les résultats.</div>';
 d.showModal();d.querySelector('input').focus();
}
function closeSearch(){document.getElementById('search-dialog').close();if(priorFocus?.isConnected)priorFocus.focus();}
function confirmAction(title,message,label,callback){
 const d=document.getElementById('confirm-dialog');
 d.innerHTML='<h2 id="confirm-title">'+h(title)+'</h2><p>'+h(message)+'</p><div class="row">'+button('Annuler','cancel-confirm','secondary')+button(h(label),'accept-confirm','primary')+'</div>';
 d._onConfirm=callback;d.showModal();
}
function closeMenu(){const side=document.querySelector('.sidebar'),wasOpen=side?.classList.contains('open');side?.classList.remove('open');side?.removeAttribute('role');side?.removeAttribute('aria-modal');document.querySelector('.mobile-overlay')?.classList.remove('open');document.querySelector('.mobile-menu')?.setAttribute('aria-expanded','false');const page=document.querySelector('.page-shell');if(page)page.inert=false;document.body.style.overflow='';if(wasOpen)document.querySelector('.mobile-menu')?.focus();}
document.addEventListener('click',async function(event){
 if(event.target.closest('.skip-link')){event.preventDefault();document.getElementById('main').focus();document.getElementById('main').scrollIntoView({block:'start'});return;}
 const el=event.target.closest('[data-action]');if(!el)return;
 const action=el.dataset.action,id=el.dataset.id;
 if(action==='search'){openSearch();return;}
 if(action==='close-search'||action==='search-result'){closeSearch();return;}
 if(action==='open-menu'){document.querySelector('.sidebar').classList.add('open');document.querySelector('.sidebar').setAttribute('role','dialog');document.querySelector('.sidebar').setAttribute('aria-modal','true');document.querySelector('.page-shell').inert=true;document.body.style.overflow='hidden';document.querySelector('.mobile-overlay').classList.add('open');el.setAttribute('aria-expanded','true');document.querySelector('.mobile-close').focus();return;}
 if(action==='close-menu'){closeMenu();return;}
 if(action==='cancel-confirm'){document.getElementById('confirm-dialog').close();return;}
 if(action==='accept-confirm'){const d=document.getElementById('confirm-dialog'),cb=d._onConfirm;d.close();if(cb)cb();return;}
 if(action==='favorite'){if(state.favorites.includes(id))state.favorites=state.favorites.filter(x=>x!==id);else state.favorites.push(id);save();render(false);toast(state.favorites.includes(id)?'Leçon ajoutée à tes favoris.':'Leçon retirée des favoris.');return;}
 if(action==='mark-read'){state.read[id]=true;activeDay();save();render(false);toast('Lecture enregistrée. À toi de pratiquer !');return;}
 if(action==='section'){event.preventDefault();if(route().tab!=='cours')navigate('#/lecon/'+route().id+'/cours');setTimeout(()=>document.getElementById('section-'+el.dataset.index)?.scrollIntoView({behavior:'smooth',block:'start'}),10);return;}
 if(action==='copy'){
 const code=el.closest('.code-card').querySelector('pre').textContent;
 try{await navigator.clipboard.writeText(code);toast('Code copié.');}catch(err){const t=document.createElement('textarea');t.value=code;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();toast(ok?'Code copié.':'Sélectionne le code pour le copier.');}return;
 }
 if(action==='exercise-hint'){const box=document.getElementById('exercise-hint');box.hidden=!box.hidden;return;}
 if(action==='quiz-select'){quizSession.selected=Number(el.dataset.option);render(false);return;}
 if(action==='quiz-hint'){quizSession.hint=!quizSession.hint;render(false);return;}
 if(action==='quiz-check'){if(quizSession.selected===null)return;quizSession.checked=true;quizSession.answers[quizSession.index]=quizSession.selected;render(false);return;}
 if(action==='quiz-next'){
 const l=lessonById(quizSession.id);
 if(quizSession.index<2){quizSession.index++;quizSession.selected=null;quizSession.checked=false;quizSession.hint=false;}
 else{quizSession.finished=true;const score=quizSession.answers.filter((a,i)=>a===l.quiz[i].correct).length,prev=state.quiz[l.id];state.quiz[l.id]={best:Math.max(prev?.best||0,score),attempts:(prev?.attempts||0)+1,lastScore:score,lastAt:new Date().toISOString()};activeDay();save();}
 render(false);document.querySelector('.quiz-card')?.scrollIntoView({behavior:'smooth',block:'center'});return;
 }
 if(action==='quiz-restart'){quizSession=null;render(false);return;}
 if(action==='review-mode'){reviewMode=el.dataset.mode;render(false);return;}
 if(action==='notes-mode'){notesMode=el.dataset.mode;render(false);return;}
 if(action==='card-flip'){cardFlipped=!cardFlipped;render(false);return;}
 if(action==='card-know'||action==='card-review'){
 const pool=cardPool(),c=pool[cardIndex];if(!c)return;
 if(action==='card-know'){if(!state.knownCards.includes(c.id))state.knownCards.push(c.id);if(includeKnown)cardIndex=(cardIndex+1)%pool.length;}
 else{state.knownCards=state.knownCards.filter(x=>x!==c.id);cardIndex=(cardIndex+1)%pool.length;}
 cardFlipped=false;activeDay();save();render(false);return;
 }
 if(action==='include-known'){includeKnown=true;cardIndex=0;cardFlipped=false;render(false);return;}
 if(action==='export'){
 const blob=new Blob([JSON.stringify({app:'django-atelier',exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='django-atelier-progression-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Sauvegarde exportée.');return;
 }
 if(action==='import'){document.getElementById('import-file').click();return;}
 if(action==='reset'){confirmAction('Recommencer le parcours ?','Les notes, scores, favoris et cartes acquises de ce navigateur seront effacés. Cette action ne peut pas être annulée sans une sauvegarde.','Réinitialiser',()=>{state=emptyState();quizSession=null;exerciseFeedback={};cardIndex=0;save();render(false);toast('Ton espace est prêt pour un nouveau départ.');});return;}
});
document.addEventListener('submit',function(event){
 if(event.target.id!=='exercise-form')return;
 event.preventDefault();const id=event.target.dataset.lesson,l=lessonById(id),answer=new FormData(event.target).get('answer').trim();
 const correct=l.exercise.answers.some(a=>String(a).trim()===answer);
 exerciseFeedback[id]={answer,correct};if(correct){state.exercises[id]=true;activeDay();save();}
 render(false);document.getElementById('exercise-answer')?.focus({preventScroll:true});document.getElementById('exercise-result')?.scrollIntoView({behavior:'smooth',block:'nearest'});
});
document.addEventListener('input',function(event){
 const el=event.target;
 if(el.id==='course-search'){document.getElementById('search-results').innerHTML=searchResults(el.value);return;}
 if(el.dataset.note){state.notes[el.dataset.note]=el.value;save();const count=document.getElementById('note-count'),status=document.getElementById('note-save-status');if(count)count.textContent=el.value.length+' / 20 000';if(status)status.textContent=storageUnavailable?'Stockage indisponible — exporte ta progression':'Enregistré dans ce navigateur';}
});
document.addEventListener('change',async function(event){
 const el=event.target;
 if(el.id==='review-module'){reviewModule=el.value;cardIndex=0;cardFlipped=false;render(false);}
 if(el.id==='include-known'){includeKnown=el.checked;cardIndex=0;cardFlipped=false;render(false);}
 if(el.id==='import-file'&&el.files[0]){
 const file=el.files[0];if(file.size>2000000){toast('Ce fichier est trop volumineux. Choisis une sauvegarde Django Atelier.');return;}
 try{const data=JSON.parse(await file.text());if(data.app!=='django-atelier'||data.version!==1)throw new Error('format');
 const imported=sanitizeState(data);confirmAction('Importer cette sauvegarde ?','La progression actuelle de ce navigateur sera remplacée par celle du fichier sélectionné.','Importer',()=>{state=imported;quizSession=null;exerciseFeedback={};save();render(false);toast('Ta progression a été restaurée.');});}
 catch(err){toast('Le fichier n’est pas une sauvegarde Django Atelier valide.');}el.value='';
 }
});
document.addEventListener('keydown',function(event){
 if(event.key==='Tab'&&document.querySelector('.sidebar.open')){
  const items=Array.from(document.querySelectorAll('.sidebar.open a,.sidebar.open button')).filter(e=>e.offsetWidth&&e.offsetHeight),first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
 if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(event.target.tagName)&&!document.querySelector('dialog[open]')){event.preventDefault();openSearch();}
 if(event.key==='Escape'){closeMenu();}
});
document.getElementById('search-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeSearch();}});
window.addEventListener('hashchange',()=>{closeMenu();render(true);});
fetch('lessons.json').then(r=>{if(!r.ok)throw new Error('load');return r.json();}).then(data=>{
 LESSONS=data.sort((a,b)=>a.order-b.order);state=readState();render(false);
}).catch(()=>{document.getElementById('app').innerHTML='<main class="loading-screen"><span class="loading-logo">dj</span><h1>Le cours n’a pas pu se charger.</h1><p>Vérifie ta connexion, puis réessaie.</p><button class="btn btn-primary" onclick="location.reload()">Réessayer</button></main>';});
})();
