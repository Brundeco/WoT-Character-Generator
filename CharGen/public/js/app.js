let pixelArray = new Array(64).fill(false);
let mainContainer = document.querySelector('div', '.main-container');
let favoritesContainer = document.getElementById('favoContainer');


// Initialize or regenerate grid based on values in pixelArray
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


// Listen for divs with no-pixel class on whole document
document.addEventListener('click', function (e) {
    if (!e.target.matches('.no-pixel')) return;
    e.preventDefault();

    // Get clicked div/pixel with target event, toggle on and off 
    let pixelTarget = pixelArray[e.target.id]
    pixelTarget = !pixelTarget;

    // update pixelarray corresponding clicked div/pixel
    pixelArray[e.target.id] = pixelTarget;

    // Recall createGrid function to regenerate grid based on new values in pixelArray
    createGrid();
}, false);


// Refresh page to clear grid 
clearGrid = () => {
    location.reload();
}

let clearGridBtn = document.getElementById('clearGrid');
clearGridBtn.addEventListener('click', clearGrid);


// Push current pixelarray to firebase database
saveCharacter = () => {
    const db = firebase.database();
    const characters = db.ref('characters');
    characters.push(pixelArray);
    setTimeout(() => { location.reload() }, 1000);
}

let saveCharBtn = document.getElementById('saveChar');
saveCharBtn.addEventListener('click', saveCharacter);


// Collect all saved characters from firebase database to display 
loadListOfSavedChars = () => {

    // Clear container but only delete char previews, not the exit menu element
    let elements = document.querySelectorAll('div.char-preview')
    elements.forEach(element => {
        favoritesContainer.removeChild(element)
    });

    // Change class from display-none to display-flex to show div
    favoritesContainer.classList.add('display-flex');

    let autoIncr = 0;
    const db = firebase.database();
    const characters = db.ref('characters');

    // Listen to values in firebase database
    characters.once('value').then(function (snapshot) {
        snapshot.forEach(data => {

            // Create a parent div for each characterKey
            let previewContainer = document.createElement('div');
            previewContainer.className = 'char-preview fade-in'
            previewContainer.id = autoIncr++ // this id is used later to show character on grid
            favoritesContainer.appendChild(previewContainer)

            // create a childdiv for each value in characterKey (64 vals per key)
            let values = data.val();
            values.forEach(data => {
                let previewPixel = document.createElement('div')
                previewPixel.className = data + '-prev'
                previewContainer.appendChild(previewPixel)
            })
        });
    })
}

let showCharsBtn = document.getElementById('loadChars');
showCharsBtn.addEventListener('click', loadListOfSavedChars);


// Close list with characters by removing display-flex class
let closeFav = document.getElementById('closeFavList');
closeFav.addEventListener('click', e = () => {
    let closeNav = document.getElementById('favoContainer')
    closeNav.classList.remove('display-flex')
})


// Display characters on main grid
document.addEventListener('click', function (e) {
    if (!e.target.matches('.char-preview')) return;
    e.preventDefault();

    const db = firebase.database();
    const characters = db.ref('characters');
    let closeNav = document.getElementById('favoContainer')
    let targetCharId = e.target.id

    characters.once('value').then(function (snapshot) {
        // targetCharId corresponds to correct char key in database
        let targetCharKey = Object.keys(snapshot.val())[targetCharId];
        db.ref('/characters/' + targetCharKey).once('value').then(function (snapshot) {
            // Get the pixelarray of clicked character
            let targetCharArray = snapshot.val()
            // update pixelarray once again
            pixelArray = targetCharArray
            // Regenerate grid to display character in UI
            createGrid();
            // Remove display-flex class to close list and view char on main grid
            closeNav.classList.remove('display-flex')
        })
    })
}, false);


// Activate loop on raspberry pi
toggleLedmatrixLoop = () => {
    const db = firebase.database();
    db.ref('/loopstatus').once('value').then(function (snapshot) {
        let newVal = snapshot.val();
        newVal = !newVal;
        db.ref().update({ loopstatus: newVal });
    })
}

let triggerLoopBtn = document.getElementById('activateLoop');
triggerLoopBtn.addEventListener('click', toggleLedmatrixLoop)
