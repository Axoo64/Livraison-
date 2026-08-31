/* ==========================================================================
   MODÈLE DE SITE VITRINE — comportements communs
   --------------------------------------------------------------------------
   Aucune donnée client ici : tout est lu depuis l'objet FICHE défini dans le
   <head> de chaque démo. Ce fichier ne change pas d'un habillage à l'autre.
   ========================================================================== */

(function(){
  'use strict';

  /* ---------- Menu mobile ---------- */
  const panel = document.getElementById('panel');
  const burger = document.getElementById('burger');
  const panelClose = document.getElementById('panelClose');

  if(burger && panel){
    burger.addEventListener('click', () => {
      panel.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    const fermer = () => {
      panel.classList.remove('open');
      document.body.style.overflow = '';
    };
    panelClose.addEventListener('click', fermer);
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', fermer));
    document.addEventListener('keydown', e => {
      if(e.key === 'Escape' && panel.classList.contains('open')) fermer();
    });
  }

  /* ---------- Galerie ---------- */
  // Les grilles sont construites une seule fois au chargement, puis on se
  // contente de montrer/cacher. Reconstruire à chaque clic relancerait
  // l'animation d'apparition et donnerait une impression de rechargement.
  const grilles = {};
  const zone = document.getElementById('galerie');
  const onglets = document.getElementById('onglets');

  // `const FICHE` déclaré dans le <head> vit dans la portée lexicale globale,
  // pas sur `window` : c'est `typeof` qu'il faut interroger, pas window.FICHE.
  const ficheDispo = typeof FICHE !== 'undefined' && FICHE && FICHE.galerie;

  if(zone && ficheDispo){
    Object.keys(FICHE.galerie).forEach((cat, i) => {
      const grille = document.createElement('div');
      grille.className = 'grid';
      grille.dataset.cat = cat;
      if(i > 0) grille.style.display = 'none';

      FICHE.galerie[cat].photos.forEach((photo, index) => {
        const tuile = document.createElement('div');
        tuile.className = 'tile reveal';
        tuile.innerHTML =
          '<div class="ph" data-ph="' + photo.legende + '"' + fond(photo.fichier) + '></div>' +
          '<div class="cap">' + photo.legende + '</div>';
        tuile.addEventListener('click', () => ouvrirLightbox(cat, index));
        grille.appendChild(tuile);
      });

      grilles[cat] = grille;
      zone.appendChild(grille);

      const bouton = document.createElement('button');
      bouton.className = 'tab' + (i === 0 ? ' active' : '');
      bouton.type = 'button';
      bouton.textContent = FICHE.galerie[cat].titre;
      bouton.addEventListener('click', () => montrerCategorie(cat, bouton));
      onglets.appendChild(bouton);
    });
  }

  // Renvoie l'attribut de fond si le fichier existe, sinon rien : le style
  // .ph prend alors le relais et affiche un emplacement présentable.
  function fond(fichier){
    return fichier ? ' style="background-image:url(\'' + fichier + '\')" class="ph filled"' : '';
  }

  function montrerCategorie(cat, bouton){
    Object.keys(grilles).forEach(c => { grilles[c].style.display = c === cat ? '' : 'none'; });
    onglets.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    bouton.classList.add('active');
    // Les tuiles cachées n'ont jamais croisé l'observateur d'apparition :
    // on les affiche directement pour éviter des vignettes invisibles.
    grilles[cat].querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lb');
  const lbPh = document.getElementById('lbPh');
  const lbCap = document.getElementById('lbCap');
  let lbCat = null, lbIndex = 0;

  function ouvrirLightbox(cat, index){
    lbCat = cat; lbIndex = index;
    afficherLightbox();
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function afficherLightbox(){
    const photos = FICHE.galerie[lbCat].photos;
    if(!photos || !photos.length) return;
    // Bornage : évite toute sortie de tableau si l'index dérape.
    lbIndex = ((lbIndex % photos.length) + photos.length) % photos.length;
    const photo = photos[lbIndex];
    lbPh.setAttribute('data-ph', photo.legende);
    if(photo.fichier){
      lbPh.style.backgroundImage = "url('" + photo.fichier + "')";
      lbPh.classList.add('filled');
    } else {
      lbPh.style.backgroundImage = '';
      lbPh.classList.remove('filled');
    }
    lbCap.textContent = photo.legende + ' — ' + (lbIndex + 1) + '/' + photos.length;
  }

  function fermerLightbox(){
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  if(lb){
    document.getElementById('lbClose').addEventListener('click', fermerLightbox);
    document.getElementById('lbPrev').addEventListener('click', () => { lbIndex--; afficherLightbox(); });
    document.getElementById('lbNext').addEventListener('click', () => { lbIndex++; afficherLightbox(); });
    lb.addEventListener('click', e => { if(e.target === lb) fermerLightbox(); });
    document.addEventListener('keydown', e => {
      if(!lb.classList.contains('open')) return;
      if(e.key === 'Escape') fermerLightbox();
      if(e.key === 'ArrowRight'){ lbIndex++; afficherLightbox(); }
      if(e.key === 'ArrowLeft'){ lbIndex--; afficherLightbox(); }
    });
  }

  /* ---------- Formulaire ---------- */
  const form = document.getElementById('form');
  const envoye = document.getElementById('envoye');
  const submit = document.getElementById('submit');

  function erreur(id, actif){
    const champ = document.getElementById(id);
    if(champ) champ.classList.toggle('error', actif);
  }
  function emailValide(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  if(form){
    form.addEventListener('submit', e => {
      e.preventDefault();
      const nom = document.getElementById('nom').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const okNom = nom.length > 0, okMail = emailValide(email), okMsg = message.length > 0;
      erreur('f-nom', !okNom); erreur('f-email', !okMail); erreur('f-message', !okMsg);
      if(!okNom || !okMail || !okMsg){
        const premier = form.querySelector('.error input, .error textarea');
        if(premier) premier.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = 'Envoi...';

      // Même logique que sur un site livré : si aucune application mail ne
      // prend la main, on le dit au lieu d'afficher une fausse confirmation.
      let passee = false;
      const noter = () => { passee = true; };
      window.addEventListener('blur', noter);
      document.addEventListener('visibilitychange', noter);

      const sujet = encodeURIComponent('Demande via le site — ' + nom);
      const corps = encodeURIComponent('Nom : ' + nom + '\nEmail : ' + email + '\n\n' + message);
      window.location.href = 'mailto:' + FICHE.email + '?subject=' + sujet + '&body=' + corps;

      setTimeout(() => {
        window.removeEventListener('blur', noter);
        document.removeEventListener('visibilitychange', noter);
        const abouti = passee || document.hidden;
        document.getElementById('envoyeTitre').textContent =
          abouti ? 'Message prêt à partir' : "Votre message n'a pas pu être envoyé";
        document.getElementById('envoyeTexte').textContent = abouti
          ? "Votre logiciel de messagerie s'est ouvert avec votre demande déjà rédigée."
          : "Aucune application mail ne s'est ouverte. Appelez-nous directement au " + FICHE.telephone + ".";
        form.style.display = 'none';
        envoye.classList.add('show');
        submit.disabled = false;
        submit.textContent = 'Envoyer';
      }, 1200);
    });
  }

  /* ---------- Apparition au défilement ---------- */
  document.querySelectorAll('.kicker, h2, .lede, .card, .strip div, .split .ph, .info-line, form')
    .forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Lien de navigation actif ---------- */
  const liens = document.querySelectorAll('nav a[data-nav]');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        liens.forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
      }
    });
  }, {threshold:.4});
  document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));

})();
