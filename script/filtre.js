const tabCategories = [{id: 0, name: "Tous"}];

verifyToken();
recupererCategoriesAndBuildFiltre();
addEventListenerLog();

//----------functions--------------------

function remplirGalleryOfWorks(jsonData, filtre) {
    //vider la galerie
    document.querySelector(".gallery").innerHTML = "";
    
    for (let figure of jsonData){
        if (filtre === 0) {
            document.querySelector(".gallery").innerHTML += buildFigureWork(figure);
        } else if(figure.categoryId == filtre) {
            document.querySelector(".gallery").innerHTML += buildFigureWork(figure);
        }
    }
}

function buildFigureWork(figure) {
    return `<figure>
                <img src="${figure.imageUrl}" alt="${figure.title}">
                <figcaption>${figure.title}</figcaption>
            </figure>`;
}

function construireFiltres() {
    for(let i = 0; i < tabCategories.length; i++) {
        let idFiltre = 'btn-' + i;
        let filtre = `<div id="${idFiltre}"><p>${tabCategories[i].name}</p></div>`;
        document.querySelector('#filtres').innerHTML += filtre;
    }
    addEventListenerAuFiltres();
}

function addEventListenerAuFiltres() {
    for(let i = 0; i < tabCategories.length; i++) {
        document.getElementById('btn-' + i).addEventListener('click', ()=>getWorks(i));
    }
}

function verifyToken() {
    let monToken = retreiveToken();
    document.getElementById('log').innerHTML = !monToken ? 'login' : 'logout';
    document.getElementById('filtres').className = monToken ? 'hide-filtre' : 'filtre';
    document.querySelector(".mes-projet div").className = !monToken ? 'hide-mes-projet-modifier' : '';
    document.querySelector(".mes-projet div").addEventListener('click', ()=>loadPopup());
    document.querySelector(".mode-edition").className = !monToken ? 'hide-mode-edition' : 'mode-edition';
}

function retreiveToken () {
    return localStorage.getItem('monToken');
}

function addEventListenerLog() {
        document.getElementById('log').addEventListener('click', ()=>{
            let monToken = retreiveToken();
            if (!monToken) {
                redirectionToLogin();
            } else {
                removeToken();
                verifyToken();
            }
        });
}

function removeToken (){
    return localStorage.removeItem('monToken');
}

function redirectionToLogin() {
    window.location.href = window.location.origin + '/pages/login.html';
}

function loadPopup() {
    fetch('./pages/popup.html')
    //recupération du contenu de la page sous forme texte
    .then(response => response.text())
    .then(data => {
        const container = document.createElement('div');
        container.innerHTML = data;
        container.id = "popup"
        const popupPostion = document.getElementById('popup-position');
        popupPostion.className = 'show-popup-position';
        //recupération de la hauteur global de la page 
        let pageHeight = document.documentElement.scrollHeight;
        //application de hauteur global de la page sur popup position
        popupPostion.style.height = pageHeight + 'px';
        //injection du container construit
        popupPostion.appendChild(container);
        addEventListenerToPopupBtns();
        remplirPopupGalerie();
    })
    .catch(error => console.error('Error loading the file:', error));
}

function saveSelectedFilter(filter) {
    localStorage.setItem('monFiltre', filter);
}
