// Envoie les données d'inscription au backend Flask
function signupUser(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    // Créez une requête AJAX pour envoyer les données au backend Flask
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/signup', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Rediriger vers une page de confirmation ou autre
            alert('Inscription réussie !');
        }
    };
    xhr.send(JSON.stringify({ name: name, email: email, password: password }));
}

// Ajoutez un gestionnaire d'événement pour le formulaire d'inscription
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', signupUser);
