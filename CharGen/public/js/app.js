let pixelArray = new Array(64).fill(false);
let mainContainer = document.querySelector('div', '.main-container');

createGrid = () => {
    let autoIncr = 0;
    mainContainer.innerHTML = "";

    pixelArray.forEach(pixel => {
        let charPixel = document.createElement('div');
        charPixel.id = autoIncr++;
        charPixel.className = 'no-pixel';
        mainContainer.appendChild(charPixel);
        charPixel.classList.add((pixel === false) ? 'no-pixel' : 'pixel')
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
}

let saveCharBtn = document.getElementById('saveChar');
saveCharBtn.addEventListener('click', saveCharacter);

