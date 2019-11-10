let pixelArray = new Array(64).fill(false);
let mainContainer = document.querySelector('div', '.main-container');
let favoritesContainer = document.getElementById('favoContainer');

createGrid = () => {
    let autoIncr = 0;
    mainContainer.innerHTML = "";

    pixelArray.forEach(pixel => {
        let charPixel = document.createElement('div');
        charPixel.id = autoIncr++;
        charPixel.className = 'no-pixel divide-pixel';
        mainContainer.appendChild(charPixel);
        charPixel.classList.add((pixel === false) ? 'false' : 'true')
    });
}

createGrid()

document.addEventListener('click', function (e) {

    if (!e.target.matches('.no-pixel')) return;
    e.preventDefault();

    let pixelTarget = pixelArray[e.target.id]
    pixelTarget = !pixelTarget;
    pixelArray[e.target.id] = pixelTarget;

    createGrid();

}, false);

clearGrid = () => {
    location.reload();
}

let newCharBtn = document.getElementById('clearGrid');
newCharBtn.addEventListener('click', clearGrid);

saveCharacter = () => {
    const db = firebase.database();
    console.log(db)
    const characters = db.ref('characters');
    characters.push(pixelArray);
    setTimeout(() => { location.reload() }, 1000);
}

let saveCharBtn = document.getElementById('saveChar');
saveCharBtn.addEventListener('click', saveCharacter);


loadSavedChars = () => {

    favoritesContainer.classList.add('display-flex');

    const db = firebase.database();
    const characters = db.ref('characters');

    characters.once('value').then(function (snapshot) {
        // let charKeys;
        let values;
        snapshot.forEach(data => {
            // charKeys = Object.keys(snapshot.val());
            let previewContainer = document.createElement('div');
            previewContainer.className = 'char-preview'
            favoritesContainer.appendChild(previewContainer)

            values = data.val();
            values.forEach(data => {
                // console.log(data)
                let previewPixel = document.createElement('div')
                previewPixel.className = data + '-prev'
                previewContainer.appendChild(previewPixel)
            })
        });
    })
}

let showCharsBtn = document.getElementById('loadChars');
showCharsBtn.addEventListener('click', loadSavedChars);


let closeFav = document.getElementById('closeFavList');
console.log(closeFav);

closeFav.addEventListener('click', e = () => {
    let closeNav = document.getElementById('favoContainer')
    closeNav.classList.remove('display-flex')
    location.reload();
})
