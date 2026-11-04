/* Django Atelier — simulations pédagogiques autonomes, sans exécution Python. */
(function () {
  'use strict';
  const $ = (selector, parent) => (parent || document).querySelector(selector);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const STORE = 'django-atelier-workshops-v1';
  const SEED = [
    {id:1,nom:'Musculor Paris',pays:'France',description:'Un centre fictif pour apprendre Django.'},
    {id:2,nom:'Musculor Lyon',pays:'France',description:'Une salle fictive au cœur de Lyon.'},
    {id:3,nom:'Musculor Marseille',pays:'France',description:'Un espace fictif dédié au mouvement.'},
    {id:4,nom:'Musculor Alger',pays:'Algérie',description:'Un centre fictif à Alger.'},
    {id:5,nom:'Musculor Barcelone',pays:'Espagne',description:'Un centre fictif à Barcelone.'},
    {id:6,nom:'Musculor Montréal',pays:'Canada',description:'Un centre fictif à Montréal.'},
    {id:7,nom:'Musculor Bruxelles',pays:'Belgique',description:'Un centre fictif à Bruxelles.'},
    {id:8,nom:'Musculor Oran',pays:'Algérie',description:'Un centre fictif à Oran.'}
  ];
  const cloneSeed = () => SEED.map(item => ({...item}));
  let stored;
  try {
    stored = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (!Array.isArray(stored) || stored.length > 60 || !stored.every(item => Number.isInteger(item.id) && item.id > 0 && typeof item.nom === 'string' && typeof item.pays === 'string' && typeof item.description === 'string')) stored = null;
  } catch (_) { stored = null; }
  const state = {
    type:'mvt',
    mvt:{scenario:'detail',step:0},
    terminal:{os:'unix',step:0,logs:[],feedback:'',feedbackKind:'',draft:''},
    orm:{country:'',search:'',order:'nom'},
    crud:{rows:stored || cloneSeed(),role:'gestionnaire',editing:null,feedback:'',feedbackKind:'',pending:null,storageOK:true}
  };
  const icons = {
    arrow:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z"/></svg>',
    reset:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10a8 8 0 1 1 2 8M4 4v6h6"/></svg>',
    check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    code:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/></svg>',
    search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>',
    lock:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>',
    plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    edit:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4M4 20l5-1L20 8a2.8 2.8 0 0 0-4-4L5 15Z"/></svg>',
    trash:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/></svg>'
  };
  function button(action, text, style, extra) {
    return '<button type="button" class="btn '+(style || 'btn-secondary')+'" data-workshop-action="'+action+'" '+(extra || '')+'>'+text+'</button>';
  }
  function codeBlock(title, code) {
    return '<div class="lab-code"><div class="lab-code-bar"><span>'+esc(title)+'</span><span class="lab-code-dots" aria-hidden="true"><i></i><i></i><i></i></span></div><pre tabindex="0"><code>'+esc(code)+'</code></pre></div>';
  }
  function heading(number, title, description) {
    return '<header class="lab-heading"><div><span class="eyebrow">ATELIER '+number+'</span><h1>'+title+'</h1><p class="muted">'+description+'</p></div><span class="lab-simulation-badge">'+icons.code+' Simulation interactive</span></header>';
  }
  function feedback(text, kind) {
    return '<div class="lab-feedback '+(kind ? 'is-'+kind : '')+'" role="status" aria-live="polite">'+(text ? esc(text) : '')+'</div>';
  }
  const mvtSteps = {
    request:{label:'Requête',file:'Navigateur',symbol:'01'},
    urls:{label:'Route',file:'urls.py',symbol:'02'},
    view:{label:'Vue',file:'views.py',symbol:'03'},
    orm:{label:'Données',file:'models.py · ORM',symbol:'04'},
    template:{label:'Template',file:'detail.html',symbol:'05'},
    response:{label:'Réponse',file:'Navigateur',symbol:'06'}
  };
  const scenarios = {
    detail:{name:'Un centre existant',url:'/centres/2/',path:['request','urls','view','orm','template','response'],status:'200 OK',tone:'success'},
    list:{name:'La liste des centres',url:'/centres/',path:['request','urls','view','orm','template','response'],status:'200 OK',tone:'success'},
    missing:{name:'Un identifiant inconnu',url:'/centres/999/',path:['request','urls','view','orm','response'],status:'404 Not Found',tone:'error'},
    route:{name:'Une URL inconnue',url:'/page-inconnue/',path:['request','urls','response'],status:'404 Not Found',tone:'error'}
  };
  function mvtDetail(scenario, key) {
    const list = scenario === 'list';
    const route = scenario === 'route';
    const missing = scenario === 'missing';
    const sc = scenarios[scenario];
    if (key === 'request') return {title:'Le navigateur demande une ressource',body:'La requête HTTP contient une méthode et un chemin. Ici, GET demande une lecture. Aucun centre ne sera modifié.',code:'GET '+sc.url+' HTTP/1.1',file:'Requête HTTP'};
    if (key === 'urls') return route
      ? {title:'Aucune route ne correspond',body:'Django compare le chemin aux motifs déclarés. Aucun motif ne correspond : le parcours s’arrête avant la vue métier et aboutit à une réponse 404.',code:'urlpatterns = [\n    path("centres/", include("centres.urls")),\n]\n\n# /page-inconnue/ ne correspond pas à ce préfixe.',file:'musculor/urls.py'}
      : {title:'L’URL sélectionne la bonne vue',body:list?'Le projet confie le préfixe centres/ à centres.urls avec include(). Le motif vide correspond au reste du chemin et appelle la vue accueil.':'Le projet confie le préfixe centres/ à centres.urls avec include(). Le convertisseur <int:pk> extrait ensuite un entier, transmis à la vue detail.',code:list?'path("", views.accueil, name="accueil")':'path("<int:pk>/", views.detail, name="detail")\n\n# pk = '+(missing ? '999' : '2'),file:'centres/urls.py'};
    if (key === 'view') return {title:'La vue organise le traitement',body:'La vue reçoit request, décide quelles données charger et quelle réponse produire. Une vue peut aussi répondre directement, sans modèle ni template.',code:list?'def accueil(request):\n    centres = Centre.objects.all()\n    return render(request, "centres/accueil.html", {"centres": centres})':'def detail(request, pk):\n    centre = get_object_or_404(Centre, pk=pk)\n    return render(request, "centres/detail.html", {"centre": centre})',file:'centres/views.py'};
    if (key === 'orm') return {title:missing?'L’objet demandé n’existe pas':'L’ORM retrouve les données',body:missing?'La route était valide, mais aucun Centre n’a l’identifiant 999. get_object_or_404 transforme cette absence en Http404. Le template de détail n’est pas rendu.':list?'Le QuerySet représente les centres à récupérer. Il est évalué lorsque les résultats sont nécessaires, notamment pendant l’affichage.':'L’ORM cherche le centre dont la clé primaire vaut 2. Dans nos données fictives, il trouve Musculor Lyon.',code:missing?'get_object_or_404(Centre, pk=999)\n# → Http404':list?'Centre.objects.all()\n# → QuerySet de 8 centres fictifs':'get_object_or_404(Centre, pk=2)\n# → Centre(nom="Musculor Lyon", pays="France")',file:'Accès aux données'};
    if (key === 'template') return {title:'Le template transforme le contexte en HTML',body:'Le template reçoit les variables préparées par la vue. Les données sont intégrées au HTML avant que celui-ci soit envoyé au navigateur.',code:list?'{% for centre in centres %}\n  <h2>{{ centre.nom }}</h2>\n  <p>{{ centre.pays }}</p>\n{% empty %}\n  <p>Aucun centre pour le moment.</p>\n{% endfor %}':'<h1>{{ centre.nom }}</h1>\n<p>{{ centre.pays }}</p>\n\n<!-- Après rendu : -->\n<h1>Musculor Lyon</h1>\n<p>France</p>',file:list?'templates/centres/accueil.html':'templates/centres/detail.html'};
    return {title:sc.tone === 'success'?'Le navigateur reçoit la page':'Le navigateur reçoit une erreur 404',body:sc.tone === 'success'?'La réponse transporte un statut HTTP 200 et le HTML produit. Le navigateur peut maintenant afficher la page.':route?'L’URL ne correspondait à aucune route. Une page d’erreur 404 est renvoyée. Le code de la vue detail n’a jamais été exécuté.':'L’URL correspondait à une route, mais l’objet était absent. Le résultat est également une réponse 404, pour une raison différente.',code:'HTTP/1.1 '+sc.status+'\nContent-Type: text/html\n\n'+(sc.tone === 'success'?(list?'<h1>Nos centres Musculor</h1>':'<h1>Musculor Lyon</h1>'):'<h1>Page introuvable</h1>'),file:'Réponse HTTP'};
  }
  function mvtScene() {
    const st=state.mvt,sc=scenarios[st.scenario];
    const current=sc.path[st.step], detail=mvtDetail(st.scenario,current);
    const nodes=Object.entries(mvtSteps).map(([key,value])=>{
      const index=sc.path.indexOf(key),status=index < 0 ? 'skipped' : index === st.step ? 'active' : index < st.step ? 'done' : 'pending';
      return '<button type="button" class="lab-mvt-node is-'+status+'" data-workshop-action="mvt-jump" data-step="'+index+'" '+(index < 0 ? 'disabled' : '')+' aria-current="'+(status === 'active'?'step':'false')+'"><span class="lab-node-symbol">'+(status === 'done'?icons.check:value.symbol)+'</span><strong>'+value.label+'</strong><span>'+value.file+'</span><small>'+({skipped:'Non emprunté',active:'Étape actuelle',done:'Parcouru',pending:'À venir'}[status])+'</small></button>';
    }).join('');
    return '<div class="lab-grid lab-mvt-grid"><div class="lab-panel card"><div class="lab-panel-top"><span class="eyebrow">LE TRAJET DE TA REQUÊTE</span><span class="tag" role="status" aria-live="polite">'+(st.step+1)+' / '+sc.path.length+'</span></div><div class="lab-mvt-map">'+nodes+'</div><div class="lab-step-actions">'+button('mvt-prev','Précédent','btn-secondary',st.step === 0?'disabled':'')+button('mvt-next',st.step === sc.path.length-1?'Parcours terminé':'Étape suivante '+icons.arrow,'btn-primary',st.step === sc.path.length-1?'disabled':'')+'</div><p class="lab-footnote">Le trajet est simplifié. Les middlewares ne sont pas représentés.</p></div><div class="lab-panel card lab-detail-panel"><span class="eyebrow">'+esc(mvtSteps[current].file)+'</span><h3>'+detail.title+'</h3><p>'+detail.body+'</p>'+codeBlock(detail.file,detail.code)+'<div class="lab-trace"><span class="eyebrow">TRACE PÉDAGOGIQUE</span>'+sc.path.slice(0,st.step+1).map((key,i)=>'<div><span>'+String(i+1).padStart(2,'0')+'</span>'+esc(mvtSteps[key].label)+(key === 'response'?' <strong class="lab-status is-'+sc.tone+'">'+esc(sc.status)+'</strong>':'')+'</div>').join('')+'</div></div></div>';
  }
  function renderMvt() {
    const st=state.mvt;
    return heading('01','Suis le voyage d’une requête.','Observe comment une URL devient une page, puis découvre les deux chemins qui peuvent mener à une erreur 404.')+'<div class="lab-toolbar card"><label class="lab-field">Scénario<select id="lab-mvt-scenario" data-workshop-change="mvt-scenario">'+Object.entries(scenarios).map(([key,sc])=>'<option value="'+key+'" '+(key===st.scenario?'selected':'')+'>'+sc.name+'</option>').join('')+'</select></label><div class="lab-request-url"><span>GET</span><code id="lab-mvt-url">'+scenarios[st.scenario].url+'</code></div>'+button('mvt-reset',icons.reset+' Rejouer','btn-secondary')+'</div><div id="lab-mvt-scene">'+mvtScene()+'</div>';
  }
  function terminalSteps() {
    const win=state.terminal.os==='windows';
    return [
      {title:'Vérifier Python',goal:'Vérifie que l’interpréteur est disponible.',command:win?'py --version':'python3 --version',aliases:win?['python --version']:['python --version'],hint:'L’option --version contient deux tirets courts.',output:'Python 3.12.x — exemple de sortie simulée.'},
      {title:'Créer un environnement virtuel',goal:'Isole les dépendances du projet dans le dossier .venv.',command:(win?'py':'python3')+' -m venv .venv',aliases:['python -m venv .venv'],hint:'Le module venv crée l’environnement ; il ne l’active pas.',output:'Dossier .venv créé dans cette simulation.'},
      {title:'Activer l’environnement',goal:'Active .venv dans ce terminal avant d’installer Django.',command:win?'.venv\\Scripts\\Activate.ps1':'source .venv/bin/activate',aliases:win?['.\\.venv\\Scripts\\Activate.ps1']:[],hint:win?'Cette commande correspond à PowerShell. Dans cmd.exe : .venv\\Scripts\\activate.bat.':'Cette commande correspond aux shells bash et zsh.',output:'(.venv) Environnement actif — simulation.'},
      {title:'Installer Django 5.2 LTS',goal:'Installe une version corrective de la série 5.2 avec le Python de l’environnement.',command:'python -m pip install "Django>=5.2,<5.3"',aliases:["python -m pip install 'Django>=5.2,<5.3'",'pip install "Django>=5.2,<5.3"','python -m pip install "Django~=5.2.0"'],hint:'Les guillemets protègent les caractères > et < du shell.',output:'Django 5.2.x et ses dépendances installés — simulation.'},
      {title:'Créer le projet',goal:'Crée la configuration musculor dans le dossier courant.',command:'python -m django startproject musculor .',aliases:['django-admin startproject musculor .'],hint:'Le point final désigne le dossier courant.',output:'manage.py et le dossier de configuration musculor/ créés — simulation.'},
      {title:'Créer l’application centres',goal:'Une application regroupe les fonctionnalités de gestion des centres.',command:'python manage.py startapp centres',hint:'startapp est une commande de manage.py.',output:'Application centres/ créée — simulation.'},
      {title:'Préparer les comptes utilisateurs',goal:'Crée accounts avant les premières migrations : le modèle utilisateur personnalisé sera configuré dès le départ.',command:'python manage.py startapp accounts',hint:'L’application doit exister avant de la déclarer dans INSTALLED_APPS.',output:'Application accounts/ créée — simulation.'},
      {title:'Configurer les applications et User',goal:'Cette étape se fait dans les fichiers, pas dans le terminal. Lis les deux extraits avant de poursuivre.',kind:'configuration',hint:'AUTH_USER_MODEL doit être configuré avant la première exécution de migrate.'},
      {title:'Générer la migration du modèle User',goal:'Transforme la définition de accounts.User en un fichier de migration versionnable.',command:'python manage.py makemigrations accounts',hint:'makemigrations crée le fichier ; migrate appliquera les changements.',output:'accounts/migrations/0001_initial.py : Create model User — simulation.'},
      {title:'Appliquer les migrations',goal:'Crée les tables nécessaires à partir du graphe de migrations.',command:'python manage.py migrate',hint:'Django respecte les dépendances entre les migrations.',output:'Migrations accounts, auth, admin, contenttypes et sessions appliquées — simulation.'},
      {title:'Lancer le serveur de développement',goal:'Démarre le serveur local pour travailler sur ton projet.',command:'python manage.py runserver',hint:'Ce serveur est destiné au développement local.',output:'Serveur simulé prêt. Sur ta machine, l’adresse habituelle est http://127.0.0.1:8000/.'}
    ];
  }
  function terminalBody() {
    const st=state.terminal,steps=terminalSteps(),done=st.step>=steps.length,step=steps[Math.min(st.step,steps.length-1)];
    let panel='';
    if(done) panel='<div class="lab-terminal-complete"><div class="lab-complete-icon">'+icons.check+'</div><span class="eyebrow">ENVIRONNEMENT COMPRIS</span><h3>Du terminal au premier serveur.</h3><p>Tu as parcouru les étapes de préparation. Pour réaliser le projet, reproduis-les dans un terminal sur ton ordinateur.</p><p class="lab-footnote">Cet atelier n’a installé aucun logiciel et n’a lancé aucun serveur.</p>'+button('terminal-reset','Recommencer','btn-primary')+'</div>';
    else if(step.kind==='configuration') panel='<span class="eyebrow">ÉTAPE '+(st.step+1)+' / '+steps.length+'</span><h3>'+step.title+'</h3><p>'+step.goal+'</p>'+codeBlock('accounts/models.py','from django.contrib.auth.models import AbstractUser\n\nclass User(AbstractUser):\n    pass')+codeBlock('musculor/settings.py — ajouts','INSTALLED_APPS = [\n    "django.contrib.admin",\n    "django.contrib.auth",\n    "django.contrib.contenttypes",\n    "django.contrib.sessions",\n    "django.contrib.messages",\n    "django.contrib.staticfiles",\n    "centres",\n    "accounts",\n]\n\nAUTH_USER_MODEL = "accounts.User"')+'<p class="lab-note">Conserve les applications Django du fichier existant. Ajoute centres et accounts à la liste : ne remplace pas toute la liste par ces deux noms.</p>'+button('terminal-config-done','Configuration comprise '+icons.arrow,'btn-primary');
    else panel='<span class="eyebrow">ÉTAPE '+(st.step+1)+' / '+steps.length+'</span><h3>'+step.title+'</h3><p>'+step.goal+'</p><form id="lab-terminal-form" novalidate><label class="lab-field" for="lab-terminal-command">Ta commande</label><div class="lab-command-input"><span aria-hidden="true">'+(st.step>=3?'(.venv) ':'')+'$</span><input id="lab-terminal-command" name="command" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" value="'+esc(st.draft)+'" placeholder="Saisis la commande…" aria-describedby="lab-terminal-feedback"></div><button type="submit" class="btn btn-primary">'+icons.play+' Vérifier la commande</button></form><details class="lab-hint"><summary>Un indice ?</summary><p>'+esc(step.hint)+'</p></details><details class="lab-hint"><summary>Voir la commande attendue</summary><code>'+esc(step.command)+'</code>'+button('terminal-insert','Insérer dans le champ','btn-secondary')+'</details>';
    return '<div class="lab-progress" role="progressbar" aria-valuenow="'+Math.min(st.step,steps.length)+'" aria-valuemin="0" aria-valuemax="'+steps.length+'" aria-label="Progression de l’atelier terminal"><span style="width:'+Math.round(Math.min(st.step,steps.length)/steps.length*100)+'%"></span></div><div class="lab-grid lab-terminal-grid"><div class="lab-panel card">'+panel+'<div id="lab-terminal-feedback">'+feedback(st.feedback,st.feedbackKind)+'</div></div><div class="lab-terminal-window"><div class="lab-terminal-bar"><span class="lab-terminal-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>musculor · terminal pédagogique</span><span>SIMULÉ</span></div><div class="lab-terminal-log" id="lab-terminal-log" role="log" aria-label="Historique simulé du terminal">'+(st.logs.length?st.logs.map(log=>'<div class="lab-log-entry"><div class="lab-log-command"><span>$</span> '+esc(log.command)+'</div><div class="lab-log-output '+(log.kind==='error'?'is-error':'')+'">'+esc(log.output)+'</div></div>').join(''):'<div class="lab-terminal-empty"><span>Prêt à construire ?</span><p>Les commandes validées apparaîtront ici.</p><small>Simulation guidée · aucun code exécuté</small></div>')+'</div></div></div>';
  }
  function renderTerminal() {
    return heading('02','Prends le terminal en main.','Prépare Musculor étape par étape, avec des commandes expliquées et un retour immédiat.')+'<div class="lab-toolbar card"><label class="lab-field">Ton environnement<select id="lab-terminal-os" data-workshop-change="terminal-os"><option value="unix" '+(state.terminal.os==='unix'?'selected':'')+'>Linux / macOS · bash ou zsh</option><option value="windows" '+(state.terminal.os==='windows'?'selected':'')+'>Windows · PowerShell</option></select></label><p class="lab-toolbar-note muted">Changer d’environnement recommence cet atelier.</p>'+button('terminal-reset',icons.reset+' Recommencer','btn-secondary')+'</div><div id="lab-terminal-body">'+terminalBody()+'</div>';
  }
  function queryData() {
    const st=state.orm,args=[],where=[],params=[];
    let rows=SEED.filter(item=>(!st.country || item.pays===st.country) && (!st.search || item.nom.toLocaleLowerCase('fr').includes(st.search.toLocaleLowerCase('fr'))));
    if(st.country){args.push('pays='+JSON.stringify(st.country));where.push('pays = %s');params.push(st.country);}
    if(st.search){args.push('nom__icontains='+JSON.stringify(st.search));where.push("LOWER(nom) LIKE LOWER(%s) ESCAPE '!'");params.push('%'+st.search.replace(/[!%_]/g,'!$&')+'%');}
    rows=rows.slice().sort((a,b)=>st.order==='id'?a.id-b.id:st.order==='-nom'?b.nom.localeCompare(a.nom,'fr'):a.nom.localeCompare(b.nom,'fr'));
    const queryset='Centre.objects.'+(args.length?'filter('+args.join(', ')+')':'all()')+'.order_by('+JSON.stringify(st.order)+')';
    const sql='SELECT id, nom, pays\nFROM centres_centre'+(where.length?'\nWHERE '+where.join('\n  AND '):'')+'\nORDER BY '+(st.order==='id'?'id ASC':st.order==='-nom'?'nom DESC':'nom ASC')+';';
    return {rows,queryset,sql,params};
  }
  function ormOutput() {
    const data=queryData();
    return '<div class="lab-grid lab-orm-grid"><div class="lab-panel card"><div class="lab-panel-top"><h3>Le résultat</h3><span class="lab-count">'+data.rows.length+' <small>/ '+SEED.length+' centres</small></span></div><div class="lab-table-wrap"><table class="lab-table"><thead><tr><th scope="col">ID</th><th scope="col">Nom</th><th scope="col">Pays</th></tr></thead><tbody>'+ (data.rows.length?data.rows.map(item=>'<tr><td><span class="lab-row-id">'+item.id+'</span></td><td><strong>'+esc(item.nom)+'</strong></td><td>'+esc(item.pays)+'</td></tr>').join(''):'<tr><td colspan="3"><div class="lab-empty-state">'+icons.search+'<strong>Aucun résultat</strong><span>Un QuerySet vide est un résultat valide. Essaie un autre filtre.</span></div></td></tr>')+'</tbody></table></div><p class="lab-footnote" role="status" aria-live="polite">'+data.rows.length+' résultat'+(data.rows.length>1?'s':'')+' pour les critères actuels. Jeu de données fictif.</p></div><div class="lab-panel card"><span class="eyebrow">DE PYTHON À LA BASE</span><h3>Une intention, deux écritures.</h3>'+codeBlock('QuerySet Django',data.queryset)+'<details class="lab-sql" open><summary>Voir le SQL équivalent simplifié</summary>'+codeBlock('SQL pédagogique · paramètres séparés',data.sql)+'<p class="lab-params"><strong>Paramètres</strong> <code>'+esc(JSON.stringify(data.params))+'</code></p></details><p class="lab-note">Un QuerySet Django est paresseux : il attend que ses résultats soient nécessaires. Ici, l’atelier l’évalue à chaque changement pour montrer le résultat. Le SQL exact et le tri dépendent de la base utilisée.</p></div></div>';
  }
  function renderOrm() {
    const countries=[...new Set(SEED.map(item=>item.pays))].sort((a,b)=>a.localeCompare(b,'fr'));
    return heading('03','Fais parler les données.','Filtre les centres et observe le lien entre les objets Python, la requête SQL et les lignes obtenues.')+'<div class="lab-toolbar card lab-orm-controls"><label class="lab-field">Pays<select data-workshop-change="orm-country"><option value="">Tous les pays</option>'+countries.map(country=>'<option '+(state.orm.country===country?'selected ':'')+'value="'+esc(country)+'">'+esc(country)+'</option>').join('')+'</select></label><label class="lab-field lab-field-grow">Nom du centre<input id="lab-orm-search" type="search" placeholder="Ex. : Paris, Musculor…" value="'+esc(state.orm.search)+'" maxlength="80" data-workshop-input="orm-search"></label><label class="lab-field">Trier par<select data-workshop-change="orm-order"><option value="nom" '+(state.orm.order==='nom'?'selected':'')+'>Nom · A → Z</option><option value="-nom" '+(state.orm.order==='-nom'?'selected':'')+'>Nom · Z → A</option><option value="id" '+(state.orm.order==='id'?'selected':'')+'>Identifiant</option></select></label>'+button('orm-reset',icons.reset+' Effacer les filtres','btn-secondary')+'</div><div id="lab-orm-output">'+ormOutput()+'</div>';
  }
  function saveCrud() {
    try{localStorage.setItem(STORE,JSON.stringify(state.crud.rows));state.crud.storageOK=true;}catch(_){state.crud.storageOK=false;}
  }
  function crudAllowed(action) {
    if(state.crud.role==='gestionnaire') return true;
    state.crud.feedback=state.crud.role==='visiteur'?'Accès simulé : 302 → connexion. Il faut d’abord s’authentifier pour '+action+'.':'Accès simulé : 403 Forbidden. Être connecté ne donne pas la permission de '+action+'.';
    state.crud.feedbackKind='error';
    const area=$('#lab-crud-feedback');if(area)area.innerHTML=feedback(state.crud.feedback,state.crud.feedbackKind);
    return false;
  }
  function crudTable() {
    const rows=state.crud.rows;
    return '<div class="lab-panel-top"><div><span class="eyebrow">BASE DE DÉMONSTRATION</span><h3>'+rows.length+' centre'+(rows.length>1?'s':'')+'</h3></div>'+button('crud-new',icons.plus+' Ajouter un centre','btn-primary')+'</div><div class="lab-crud-list">'+(rows.length?rows.map(row=>'<article class="lab-centre"><div class="lab-centre-mark" aria-hidden="true">M<span>'+String(row.id).padStart(2,'0')+'</span></div><div class="lab-centre-content"><h4>'+esc(row.nom)+'</h4><span class="lab-centre-country">'+esc(row.pays)+'</span><p>'+esc(row.description)+'</p></div><div class="lab-centre-actions">'+button('crud-edit',icons.edit+'<span>Modifier</span>','btn-secondary lab-icon-button','data-id="'+row.id+'" aria-label="Modifier '+esc(row.nom)+'"')+button('crud-delete',icons.trash+'<span>Supprimer</span>','btn-secondary lab-icon-button','data-id="'+row.id+'" aria-label="Supprimer '+esc(row.nom)+'"')+'</div></article>').join(''):'<div class="lab-empty-state">'+icons.plus+'<strong>La liste est vide</strong><span>Ajoute un centre pour poursuivre l’atelier.</span></div>')+'</div>';
  }
  function crudEditor() {
    const st=state.crud,editing=st.editing;
    if(editing===null) return '<div class="lab-editor-idle"><div class="lab-editor-symbol">'+icons.code+'</div><span class="eyebrow">À TOI DE JOUER</span><h3>Une interface. Quatre opérations.</h3><p>La liste représente la lecture. Ajoute un centre, modifie ses informations, puis observe la confirmation de suppression.</p><div class="lab-crud-letters"><span><b>C</b>Créer</span><span><b>R</b>Lire</span><span><b>U</b>Modifier</span><span><b>D</b>Supprimer</span></div><p class="lab-note">Change de rôle pour comprendre la différence entre une connexion et une permission. Les contrôles sont simulés ici ; une vraie application les applique côté serveur.</p></div>';
    const current=editing===0?{nom:'',pays:'France',description:''}:st.rows.find(item=>item.id===editing);
    if(!current){st.editing=null;return crudEditor();}
    return '<span class="eyebrow">'+(editing===0?'CREATE':'UPDATE')+'</span><h3>'+(editing===0?'Ton nouveau centre':'Modifier le centre')+'</h3><p class="muted">Les champs marqués d’un astérisque sont obligatoires.</p><form id="lab-crud-form" novalidate><label class="lab-field" for="lab-centre-nom">Nom du centre *<input id="lab-centre-nom" name="nom" type="text" required maxlength="80" value="'+esc(current.nom)+'" placeholder="Ex. : Musculor Toulouse"></label><label class="lab-field" for="lab-centre-pays">Pays *<input id="lab-centre-pays" name="pays" type="text" required maxlength="40" value="'+esc(current.pays)+'" placeholder="Ex. : France"></label><label class="lab-field" for="lab-centre-description">Description<textarea id="lab-centre-description" name="description" rows="4" maxlength="500" placeholder="Présente ce centre fictif…">'+esc(current.description)+'</textarea></label><div id="lab-crud-form-errors" role="alert"></div><div class="lab-form-actions"><button class="btn btn-primary" type="submit">'+icons.check+' '+(editing===0?'Créer le centre':'Enregistrer')+'</button>'+button('crud-cancel','Annuler','btn-secondary')+'</div></form><p class="lab-footnote">Équivalent pédagogique : valider le ModelForm, puis appeler form.save().</p>';
  }
  const roleDescriptions={
    visiteur:'Visiteur : lecture autorisée. Une action d’écriture demande une connexion.',
    membre:'Membre : connecté, avec accès en lecture. Aucune permission de création, modification ou suppression.',
    gestionnaire:'Gestionnaire : connecté, avec les permissions add_centre, change_centre et delete_centre.'
  };
  function crudBody() {
    const st=state.crud;
    return '<div class="lab-role-note">'+icons.lock+'<span>'+roleDescriptions[st.role]+'</span></div><div id="lab-crud-feedback">'+feedback(st.feedback,st.feedbackKind)+'</div><div class="lab-grid lab-crud-grid"><div class="lab-panel card" id="lab-crud-table">'+crudTable()+'</div><aside class="lab-panel card lab-crud-editor" id="lab-crud-editor">'+crudEditor()+'</aside></div><div class="lab-crud-footer"><p class="lab-footnote">'+(st.storageOK?'Tes centres fictifs sont conservés dans ce navigateur.':'L’enregistrement du navigateur est indisponible : données conservées pour cette session.')+'</p>'+button('crud-reset','Réinitialiser les données de démo','btn-secondary')+'</div><dialog id="lab-crud-dialog" class="lab-dialog" aria-labelledby="lab-dialog-title"><form method="dialog" id="lab-dialog-form"><span class="eyebrow">CONFIRMATION</span><h3 id="lab-dialog-title">Confirmer la suppression ?</h3><p id="lab-dialog-description"></p><div class="lab-form-actions">'+button('crud-confirm-cancel','Annuler','btn-secondary')+button('crud-confirm','Confirmer','btn-primary lab-danger-button')+'</div></form></dialog>';
  }
  function renderCrud() {
    return heading('04','Construis, modifie, expérimente.','Manipule une petite base de centres et teste les droits de trois profils. Les données sont fictives et restent dans ton navigateur.')+'<div class="lab-toolbar card"><label class="lab-field">Rôle de démonstration<select id="lab-crud-role" data-workshop-change="crud-role"><option value="visiteur" '+(state.crud.role==='visiteur'?'selected':'')+'>Visiteur · non connecté</option><option value="membre" '+(state.crud.role==='membre'?'selected':'')+'>Membre · lecture</option><option value="gestionnaire" '+(state.crud.role==='gestionnaire'?'selected':'')+'>Gestionnaire · CRUD</option></select></label><span class="lab-demo-chip">Aucun compte réel</span><p class="lab-toolbar-note muted">Essaie la même action avec chaque rôle.</p></div><div id="lab-crud-body">'+crudBody()+'</div>';
  }
  function paintMvt(){
    const focused=document.activeElement,action=focused?.dataset?.workshopAction,step=focused?.dataset?.step;
    const el=$('#lab-mvt-scene');if(el)el.innerHTML=mvtScene();const url=$('#lab-mvt-url');if(url)url.textContent=scenarios[state.mvt.scenario].url;
    if(action&&action.startsWith('mvt-')&&el){const selector='[data-workshop-action="'+action+'"]'+(step!==undefined?'[data-step="'+step+'"]':'');const target=$(selector,el);if(target&&!target.disabled)target.focus();else{const previous=$('[data-workshop-action="mvt-prev"]',el);if(previous&&!previous.disabled)previous.focus();}}
  }
  function paintTerminal(focus){const el=$('#lab-terminal-body');if(!el)return;el.innerHTML=terminalBody();const log=$('#lab-terminal-log');if(log)log.scrollTop=log.scrollHeight;if(focus){const input=$('#lab-terminal-command');if(input)input.focus();}}
  function paintOrm(){const el=$('#lab-orm-output');if(el)el.innerHTML=ormOutput();}
  function paintCrud(focus){const el=$('#lab-crud-body');if(!el)return;el.innerHTML=crudBody();if(focus){const input=$('#lab-centre-nom');if(input)input.focus();}}
  function normaliseCommand(value){return String(value).trim().replace(/^\$\s*/, '').replace(/\s+/g,' ');}
  function checkTerminal(event){
    if(event)event.preventDefault();
    const st=state.terminal,step=terminalSteps()[st.step],input=$('#lab-terminal-command');
    if(!step || step.kind || !input)return;
    const command=normaliseCommand(input.value);st.draft=input.value;
    if(!command){st.feedback='Saisis une commande avant de la vérifier.';st.feedbackKind='error';$('#lab-terminal-feedback').innerHTML=feedback(st.feedback,st.feedbackKind);input.focus();return;}
    const valid=[step.command,...(step.aliases||[])].map(normaliseCommand).includes(command);
    if(valid){st.logs.push({command,output:step.output});st.step++;st.draft='';st.feedback='Bien joué. '+step.title+' : étape validée.';st.feedbackKind='success';paintTerminal(true);}
    else{st.logs.push({command,output:'Commande non attendue à cette étape. Consulte l’indice puis réessaie.',kind:'error'});st.feedback='Pas encore. Vérifie la commande de cette étape, ses espaces et ses tirets. Tu peux ouvrir l’indice.';st.feedbackKind='error';paintTerminal(true);}
  }
  function submitCrud(event){
    if(event)event.preventDefault();
    const st=state.crud;if(!crudAllowed(st.editing===0?'créer un centre':'modifier un centre'))return;
    const nom=$('#lab-centre-nom'),pays=$('#lab-centre-pays'),description=$('#lab-centre-description');
    if(!nom || !pays || !description || st.editing===null)return;
    nom.removeAttribute('aria-invalid');pays.removeAttribute('aria-invalid');
    const values={nom:nom.value.trim().slice(0,80),pays:pays.value.trim().slice(0,40),description:description.value.trim().slice(0,500)};
    if(!values.nom || !values.pays){const missing=!values.nom?nom:pays;missing.setAttribute('aria-invalid','true');$('#lab-crud-form-errors').innerHTML='<p class="lab-inline-error">Le nom et le pays doivent être renseignés. Aucun centre n’a été enregistré.</p>';missing.focus();return;}
    if(st.editing===0){if(st.rows.length>=60){$('#lab-crud-form-errors').innerHTML='<p class="lab-inline-error">Cet atelier accepte jusqu’à 60 centres. Supprime un centre ou réinitialise la démo pour poursuivre.</p>';return;}const id=Math.max(0,...st.rows.map(item=>item.id))+1;st.rows.push({id,...values});st.feedback='Centre créé : '+values.nom+'. La liste est mise à jour.';}
    else{const index=st.rows.findIndex(item=>item.id===st.editing);if(index<0)return;st.rows[index]={id:st.editing,...values};st.feedback='Modifications enregistrées pour '+values.nom+'.';}
    st.feedbackKind='success';st.editing=null;saveCrud();paintCrud();
  }
  function openCrudDialog(kind,id){
    const st=state.crud;if(!crudAllowed(kind==='reset'?'réinitialiser les centres':'supprimer un centre'))return;
    const row=kind==='delete'?st.rows.find(item=>item.id===id):null;if(kind==='delete'&&!row)return;
    st.pending={kind,id};const dialog=$('#lab-crud-dialog');if(!dialog)return;
    $('#lab-dialog-title').textContent=kind==='reset'?'Réinitialiser la démo ?':'Supprimer ce centre ?';
    $('#lab-dialog-description').textContent=kind==='reset'?'Les centres de démonstration seront remplacés par les huit centres d’origine. Ton parcours d’apprentissage ne sera pas modifié.':'« '+row.nom+' » sera retiré de cette base fictive. Dans Django, le GET affiche cette confirmation ; un POST autorisé réalise la suppression.';
    dialog.showModal();const cancel=$('[data-workshop-action="crud-confirm-cancel"]',dialog);if(cancel)cancel.focus();
  }
  function closeCrudDialog(){const dialog=$('#lab-crud-dialog');if(dialog && dialog.open)dialog.close();state.crud.pending=null;}
  function confirmCrud(){
    const st=state.crud,pending=st.pending;if(!pending)return;if(!crudAllowed(pending.kind==='reset'?'réinitialiser les centres':'supprimer un centre')){closeCrudDialog();return;}
    if(pending.kind==='reset'){st.rows=cloneSeed();st.feedback='Les huit centres de démonstration ont été restaurés.';}
    else{const row=st.rows.find(item=>item.id===pending.id);st.rows=st.rows.filter(item=>item.id!==pending.id);st.feedback=(row?row.nom:'Le centre')+' a été supprimé de la démo.';}
    st.editing=null;st.feedbackKind='success';closeCrudDialog();saveCrud();paintCrud();
  }
  function handle(action,el,event){
    switch(action){
      case'mvt-scenario':if(scenarios[el.value]){state.mvt.scenario=el.value;state.mvt.step=0;paintMvt();}break;
      case'mvt-next':state.mvt.step=Math.min(state.mvt.step+1,scenarios[state.mvt.scenario].path.length-1);paintMvt();break;
      case'mvt-prev':state.mvt.step=Math.max(0,state.mvt.step-1);paintMvt();break;
      case'mvt-reset':state.mvt.step=0;paintMvt();break;
      case'mvt-jump':{const step=Number(el.dataset.step);if(Number.isInteger(step)&&step>=0&&step<scenarios[state.mvt.scenario].path.length){state.mvt.step=step;paintMvt();}}break;
      case'terminal-os':state.terminal.os=el.value==='windows'?'windows':'unix';state.terminal.step=0;state.terminal.logs=[];state.terminal.feedback='';state.terminal.feedbackKind='';state.terminal.draft='';paintTerminal();break;
      case'terminal-reset':state.terminal.step=0;state.terminal.logs=[];state.terminal.feedback='';state.terminal.feedbackKind='';state.terminal.draft='';paintTerminal(true);break;
      case'terminal-insert':{const input=$('#lab-terminal-command'),step=terminalSteps()[state.terminal.step];if(input&&step){input.value=step.command;state.terminal.draft=step.command;input.focus();}}break;
      case'terminal-submit':checkTerminal(event);break;
      case'terminal-config-done':if(terminalSteps()[state.terminal.step]?.kind==='configuration'){state.terminal.logs.push({command:'Configuration des fichiers',output:'centres et accounts déclarées ; AUTH_USER_MODEL = "accounts.User" — étape pédagogique.'});state.terminal.step++;state.terminal.feedback='Configuration comprise. Les migrations peuvent maintenant être préparées.';state.terminal.feedbackKind='success';paintTerminal(true);}break;
      case'orm-country':state.orm.country=el.value;paintOrm();break;
      case'orm-order':state.orm.order=['nom','-nom','id'].includes(el.value)?el.value:'nom';paintOrm();break;
      case'orm-search':state.orm.search=el.value.slice(0,80);paintOrm();break;
      case'orm-reset':state.orm={country:'',search:'',order:'nom'};{const root=$('#workshop-root');if(root){root.innerHTML=renderOrm();}}break;
      case'crud-role':state.crud.role=['visiteur','membre','gestionnaire'].includes(el.value)?el.value:'visiteur';state.crud.editing=null;state.crud.feedback='';state.crud.feedbackKind='';state.crud.pending=null;paintCrud();break;
      case'crud-new':if(crudAllowed('créer un centre')){state.crud.editing=0;state.crud.feedback='';paintCrud(true);}break;
      case'crud-edit':if(crudAllowed('modifier un centre')){const id=Number(el.dataset.id);if(state.crud.rows.some(row=>row.id===id)){state.crud.editing=id;state.crud.feedback='';paintCrud(true);}}break;
      case'crud-delete':openCrudDialog('delete',Number(el.dataset.id));break;
      case'crud-reset':openCrudDialog('reset');break;
      case'crud-cancel':state.crud.editing=null;paintCrud();break;
      case'crud-submit':submitCrud(event);break;
      case'crud-confirm':confirmCrud();break;
      case'crud-confirm-cancel':closeCrudDialog();break;
      default:return false;
    }
    return true;
  }
  function render(type){
    const allowed=['mvt','terminal','orm','crud'];state.type=allowed.includes(type)?type:'mvt';
    const content={mvt:renderMvt,terminal:renderTerminal,orm:renderOrm,crud:renderCrud}[state.type]();
    return '<section id="workshop-root" class="workshop" aria-label="Atelier Django interactif">'+content+'</section>';
  }
  function init(){
    const root=$('#workshop-root');if(!root || root.dataset.workshopReady==='true')return;root.dataset.workshopReady='true';
    root.addEventListener('click',event=>{const target=event.target.closest('[data-workshop-action]');if(target&&root.contains(target)){event.preventDefault();handle(target.dataset.workshopAction,target,event);}});
    root.addEventListener('change',event=>{const target=event.target.closest('[data-workshop-change]');if(target&&root.contains(target))handle(target.dataset.workshopChange,target,event);});
    root.addEventListener('input',event=>{const target=event.target.closest('[data-workshop-input]');if(target&&root.contains(target))handle(target.dataset.workshopInput,target,event);if(event.target.id==='lab-terminal-command')state.terminal.draft=event.target.value;});
    root.addEventListener('submit',event=>{if(event.target.id==='lab-terminal-form')checkTerminal(event);if(event.target.id==='lab-crud-form')submitCrud(event);});
    root.addEventListener('cancel',event=>{if(event.target.id==='lab-crud-dialog')state.crud.pending=null;},true);
    const log=$('#lab-terminal-log');if(log)log.scrollTop=log.scrollHeight;
  }
  window.Workshops={render,handle,init};
}());
