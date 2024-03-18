function deletePopup() {
    const popup = document.querySelector('#popup');
    if (popup) {
        popup.remove();
        const popupPostion = document.getElementById('popup-position');
        popupPostion.className = 'hide-popup-position';
        popupPostion.style.height = '0px';
    }
}

function goBack() {
    document.getElementById('galerie-content').className = "popup-galerie";
    document.getElementById('formulaire-content').className ="hide-content";
    document.querySelector('.btn-container .btn span').innerHTML = "Ajouter une photo";
    document.getElementById('go-back').style.visibility = "hidden";
    document.getElementById('popup-titre').innerHTML = "Galerie photo";
}

function addEventListenerToPopupBtns() {
    document.getElementById('exit').addEventListener('click', ()=>deletePopup());
    document.getElementById('go-back').addEventListener('click', ()=>goBack());
    document.getElementById('go-back').style.visibility = "hidden";
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
            let figureHtml = `<div class="popup-galerie-image">
                                <div>
                                    <img class="trash" id="trash-${figure.id}" src="./assets/icons/trash.png">
                                </div>
                                <img class="popup-figure" src="${figure.imageUrl}" alt="${figure.title}">
                            </div>`;
            document.getElementById('galerie-content').innerHTML += figureHtml;
        }
        addEventListenerToTrash(data);
        addEventListenerToBtnAjout();
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error)); 
}

function addEventListenerToTrash(data) {
    for(let i = 0; i < data.length; i++) {
        let figure = data[i];
        document.getElementById(`trash-${figure.id}`).addEventListener('click', ()=> {
            deleteWorks(figure.id);
        });
    }
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

function retreiveSavedFilter() {
    return Number(localStorage.getItem('monFiltre'));
}

function addEventListenerToBtnAjout() {
        document.querySelector('.btn-container .btn').addEventListener('click', ()=> {
            const textBtn =  document.querySelector('.btn-container .btn span').innerHTML;
            if (textBtn === 'Valider' && validateTextAndPhoto()){
                saveWork();              
            }else {
                switchContent();
            }
        });
}

function switchContent() {
    document.getElementById('galerie-content').className = "hide-content";
    document.getElementById('formulaire-content').className ="popup-ajout-projet";
    document.getElementById('go-back').style.visibility = "visible";
    document.querySelector('.btn-container .btn span').innerHTML = "Valider";
    document.querySelector('.btn-container .btn').classList.add("btn-not-valid");
    document.getElementById('popup-titre').innerHTML = "Ajout photo";
    addEventListenerToImageUploaderAndInputText();
}

function saveWork() {
    const photoFormulaire= document.getElementById('photo-formulaire').files[0];
    const titreFormulaire= document.getElementById('titre-formulaire').value;
    const categorieFormulaire= document.getElementById('categorie-formulaire').value;
    createWorks(photoFormulaire, titreFormulaire, categorieFormulaire);
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

function chargerImage(inputFile) {

    var file = inputFile.files[0];
    const acceptedExtensions = ['jpg', 'png'];
    //récuperation de l'extension du fichier
    const fileExtension = file.name.split('.').pop();
    if (file.size > 4194304 || !acceptedExtensions.includes(fileExtension)) {
        document.getElementById('file-condition').style.color = "red";
    } else {
        document.getElementById('file-condition').style.color = "#444444";
        var reader = new FileReader();
        reader.onload = (event) => document.getElementById("image-to-send").src = event.target.result;
        if (file) {
            reader.readAsDataURL(file);
        } else {
            document.getElementById("image-to-send").src = "./assets/icons/picture-svgrepo-com.png";
        }
    }

    if (validateTextAndPhoto()) {
        document.querySelector('.btn-container .btn').classList.remove("btn-not-valid");
    } else {
        document.querySelector('.btn-container .btn').classList.add("btn-not-valid");
    }
    
}

function addEventListenerToImageUploaderAndInputText() {
    document.getElementById('photo-formulaire').addEventListener('change', () => 
        chargerImage(document.getElementById('photo-formulaire'))
    );

    document.getElementById('titre-formulaire').addEventListener('keyup', () => 
        validateTextInInput()
    );
}

function validateTextInInput() {
    if (validateTextAndPhoto()) {
        document.querySelector('.btn-container .btn').classList.remove("btn-not-valid");
    } else {
        document.querySelector('.btn-container .btn').classList.add("btn-not-valid");
    }
}

function validateTextAndPhoto() {
    const textValue = document.getElementById('titre-formulaire').value;
    const photoColor = document.getElementById('file-condition').style.color;

    const isText = textValue && textValue.length > 0;
    const isPhoto = photoColor !== 'red';
    
    return isText && isPhoto
}