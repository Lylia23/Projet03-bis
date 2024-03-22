const urlHost = 'http://localhost:5678/api';

function getWorks (filtre) {

    for (let i = 0; i < tabCategories.length; i++) {
        let id = 'btn-' + i;
        let btnFiltre = document.getElementById(id);
        btnFiltre.className = filtre == i ? "btn-filtre-on-clique" : "btn-filtre";
    }

    fetch(urlHost + '/works', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        remplirGalleryOfWorks(data, filtre);
        saveSelectedFilter(filtre);
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}

function remplirPopupGalerie() {
    document.getElementById('galerie-content').innerHTML = "";

    fetch(urlHost + '/works', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        for(let i = 0; i < data.length; i++) {
            let figure = data[i];
            document.getElementById('galerie-content').innerHTML += buildFigure(figure);
        }
        addEventListenerToTrash(data);
        addEventListenerToBtnAjout();
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}

function buildFigure(figure) {
    return `<div class="popup-galerie-image">
                <div>
                    <img class="trash" id="trash-${figure.id}" src="./assets/icons/trash.png">
                </div>
                <img class="popup-figure" src="${figure.imageUrl}" alt="${figure.title}">
            </div>`;
}

function deleteWorks (workId) {
    fetch(urlHost + '/works/' + workId, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
    .then()
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
    remplirPopupGalerie();
    const filter = retreiveSavedFilter();
    getWorks(filter);
}

function createWorks(image, title, category) {
    const formData = new FormData();

    formData.append('image', image);
    formData.append('title', title);
    formData.append('category', category);

    fetch(urlHost + '/works', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function recupererCategoriesAndBuildFiltre(){
    fetch(urlHost + '/categories', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + retreiveToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        for(let element of data) {
            tabCategories.push(element);
        }
        construireFiltres();
        getWorks(0);
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}
