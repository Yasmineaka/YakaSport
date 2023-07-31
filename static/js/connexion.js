// Envoie les données de connexion au backend Flask
function loginUser(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Créez une requête AJAX pour envoyer les données au backend Flask
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Rediriger vers le tableau de bord de l'utilisateur ou autre
            alert('Connexion réussie !');
        } else if (xhr.readyState === 4 && xhr.status === 401) {
            alert('Identifiants invalides');
        }
    };
    xhr.send(JSON.stringify({ email: email, password: password }));
}

// Ajoutez un gestionnaire d'événement pour le formulaire de connexion
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', loginUser);
