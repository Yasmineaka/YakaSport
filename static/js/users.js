// Fonction pour créer une publication
function createPost() {
    const postContent = prompt("Entrez le contenu de la publication :");
    if (postContent !== null && postContent.trim() !== '') {
      // Ajout de la publication à la liste des publications
      addPost(postContent);
      // Sauvegarde toutes les données, y compris la nouvelle publication et les commentaires
      sauvegarderToutesLesDonnees();
    }
  }
  
  // Fonction pour ajouter une publication à la liste
  function addPost(postContent, postNumber, image) {
    const postList = document.getElementById('postList');
    const newPost = document.createElement('div');
    newPost.classList.add('post');
    newPost.innerHTML = `
      <h2>Nouvelle Publication</h2>
      <p>${postContent}</p>
      ${image ? `<img src="${image}" alt="Image publiée">` : ''}
      <div class="comments">
        <h3>Commentaires</h3>
        <ul class="comment-list" id="commentList${postNumber}">
          <!-- Les commentaires pour ce post seront ajoutés ici par JavaScript -->
        </ul>
        <input type="text" placeholder="Votre commentaire..." id="commentInput${postNumber}">
        <button onclick="addComment('commentList${postNumber}', 'commentInput${postNumber}')">Envoyer</button>
      </div>
    `;
  
    // Ajoute la publication au début de la liste
    postList.insertBefore(newPost, postList.firstChild);
  
    // Sauvegarde de la publication dans le Web Storage (localStorage)
    sauvegarderPublication(postContent, postNumber, image);
  }
  
  // Fonction pour sauvegarder la publication dans le Web Storage (localStorage)
  function sauvegarderPublication(postContent, postNumber, image) {
    const publicationsExistantes = JSON.parse(localStorage.getItem('publications')) || [];
    publicationsExistantes.unshift({ contenu: postContent, numero: postNumber, image });
    localStorage.setItem('publications', JSON.stringify(publicationsExistantes));
  }
  
  // Fonction pour afficher les publications de l'administrateur
  function afficherPublications() {
    const postList = document.getElementById('postList');
    const publicationsExistantes = JSON.parse(localStorage.getItem('publications')) || [];
  
    publicationsExistantes.forEach((publication) => {
      addPost(publication.contenu, publication.numero, publication.image); // Appelle la fonction pour ajouter chaque publication à la liste
    });
  }
  
  // Fonction pour afficher les commentaires d'une publication
  function afficherCommentaires(numeroPublication) {
    const commentListId = 'commentList' + numeroPublication;
    const commentList = document.getElementById(commentListId);
    const commentairesExistants = JSON.parse(localStorage.getItem(commentListId)) || [];
  
    commentairesExistants.forEach((commentaireHTML) => {
      const nouveauCommentaire = document.createElement('li');
      nouveauCommentaire.classList.add('comment'); // Ajoute la classe 'comment' pour appliquer les styles CSS spécifiques
      nouveauCommentaire.innerHTML = commentaireHTML;
      commentList.appendChild(nouveauCommentaire);
    });
  }
  
  // Fonction pour ajouter un commentaire sous le post spécifié
  function addComment(commentListId, commentInputId) {
    const commentInput = document.getElementById(commentInputId).value;
    if (commentInput.trim() !== '') {
      const commentList = document.getElementById(commentListId);
      const nouveauCommentaire = document.createElement('li');
      nouveauCommentaire.classList.add('comment'); // Ajoute la classe 'comment' pour appliquer les styles CSS spécifiques
      nouveauCommentaire.innerHTML = `
        <span class="comment-content">Utilisateur connecté : ${commentInput}</span>
        <span class="comment-delete" onclick="supprimerCommentaire(this)">Supprimer</span>
        <ul class="sub-comments"></ul>
        <input type="text" placeholder="Votre commentaire..." class="sub-comment-input">
        <button onclick="ajouterSousCommentaire(this)">Envoyer</button>
      `;
      commentList.appendChild(nouveauCommentaire);
      document.getElementById(commentInputId).value = '';
  
      // Sauvegarde du commentaire dans le Web Storage (localStorage)
      sauvegarderCommentaire(commentListId, nouveauCommentaire.innerHTML);
    }
  }
  
  // Fonction pour ajouter un sous-commentaire
  function ajouterSousCommentaire(boutonCommentaire) {
    const subCommentInput = boutonCommentaire.parentElement.querySelector('.sub-comment-input').value;
    if (subCommentInput.trim() !== '') {
      const subCommentList = boutonCommentaire.parentElement.querySelector('.sub-comments');
      const nouveauSousCommentaire = document.createElement('li');
      nouveauSousCommentaire.innerHTML = 'Utilisateur connecté (sous-commentaire) : ' + subCommentInput;
      subCommentList.appendChild(nouveauSousCommentaire);
      boutonCommentaire.parentElement.querySelector('.sub-comment-input').value = '';
  
      // Sauvegarde du sous-commentaire dans le Web Storage (localStorage)
      sauvegarderSousCommentaire(boutonCommentaire, nouveauSousCommentaire.innerHTML);
    }
  }
  
  // Fonction pour sauvegarder le commentaire dans le Web Storage (localStorage)
  function sauvegarderCommentaire(commentListId, commentaireHTML) {
    const commentairesExistants = JSON.parse(localStorage.getItem(commentListId)) || [];
    commentairesExistants.push(commentaireHTML);
    localStorage.setItem(commentListId, JSON.stringify(commentairesExistants));
  }
  
  // Fonction pour sauvegarder le sous-commentaire dans le Web Storage (localStorage)
  function sauvegarderSousCommentaire(boutonCommentaire, sousCommentaireHTML) {
    const subCommentList = boutonCommentaire.parentElement.querySelector('.sub-comments');
    const subCommentListId = 'subCommentList' + subCommentList.parentElement.querySelector('.comment-content').innerText.replace(/\s+/g, '');
    const sousCommentairesExistants = JSON.parse(localStorage.getItem(subCommentListId)) || [];
    sousCommentairesExistants.push(sousCommentaireHTML);
    localStorage.setItem(subCommentListId, JSON.stringify(sousCommentairesExistants));
  }
  
  // Fonction pour charger les commentaires depuis le Web Storage lors du chargement de la page
  window.onload = function() {
    afficherPublications();
    const postElements = document.querySelectorAll('.post');
    postElements.forEach((postElement) => {
      const commentListId = 'commentList' + postElement.querySelector('h2').innerText.replace(/\s+/g, '');
      afficherCommentaires(commentListId);
    });
  }
  
  // Fonction pour supprimer le commentaire
  function supprimerCommentaire(elementCommentaire) {
    const commentList = elementCommentaire.parentElement.parentElement;
    const commentListId = commentList.id;
    const commentaireHTML = elementCommentaire.parentElement.innerHTML;
  
    const commentairesExistants = JSON.parse(localStorage.getItem(commentListId));
    const commentairesMisAJour = commentairesExistants.filter((commentaire) => commentaire !== commentaireHTML);
    localStorage.setItem(commentListId, JSON.stringify(commentairesMisAJour));
  
    elementCommentaire.parentElement.remove();
  }
  
  // Fonction pour afficher/masquer les sous-commentaires
  function afficherSousCommentaires(boutonCommentaire) {
    const sousCommentaires = boutonCommentaire.parentElement.querySelector('.sub-comments');
    sousCommentaires.classList.toggle('show');
  }
  
  // Gérer l'événement de sélection d'une image
  document.getElementById('imageInput').addEventListener('change', handleImageUpload);
  
  // Fonction pour gérer le téléchargement d'une image
  function handleImageUpload(event) {
    const imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function() {
      const imageContent = reader.result;
      // Appeler la fonction pour ajouter la publication avec l'image
      addPost('Publication avec image', Date.now(), imageContent);
    };
    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }
  }