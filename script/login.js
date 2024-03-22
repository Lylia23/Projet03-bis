const urlHost = 'http://localhost:5678/api';

addEventListenerToBtnConnexion();

function addEventListenerToBtnConnexion() {
    document.querySelector('.login-btn')
    .addEventListener('click', ()=>login(document.getElementById('email').value, document.getElementById('psw').value));
}

function login(emailParam, passwordParam) {

    if (validerLogin(emailParam, passwordParam)) {
        fetch(urlHost + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    email: emailParam,
                    password: passwordParam
                }
            )
        }).then(response => {
                if(response.status !== 200) {
                    document.getElementById('user-inconnu').className = "utilisateur-inconnu";
                    throw new Error("Authentication error !");
                } 
                return response.json();  
            })
            .then(data => {
                enregistrerToken(data.token);
                window.location.href = window.location.origin + '/index.html';
            })
            .catch(error => console.error('There was a problem with the fetch operation:', error));
    };
}

function validerLogin(emailValue, pswValue) {
    //regex de validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //si emailValue n'est pas vide et correspand a la regex donc il est correcte  
    let isCorrectEmail = emailValue !== '' && emailRegex.test(emailValue);
    document.querySelector('.email span').className = isCorrectEmail ? 'no-error-email' : 'error-email';
    //si pswValue n'est pas vide donc la valeur est correcte
    let isCorrectPsw = pswValue !== '';
    document.querySelector('.psw span').className = isCorrectPsw ? 'no-error-psw' : 'error-psw';

    return isCorrectEmail && isCorrectPsw;
}

function enregistrerToken (token) {
    localStorage.setItem('monToken', token);
}