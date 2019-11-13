// Import all DOM elements
let mainContainer = document.querySelector('div', '.main-container');
let favoritesContainer = document.getElementById('favoContainer');
let favoritesCharList = document.getElementById('favoritesCharList');
let triggerLoopBtn = document.getElementById('activateLoop');
let clearGridBtn = document.getElementById('clearGrid');
let saveCharBtn = document.getElementById('saveChar');
let showCharsBtn = document.getElementById('loadChars');
let autoCharBtn = document.getElementById('autoChar');
let pixelArray = new Array(64).fill(false);


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
document.addEventListener('click', function(e) {
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
clearGridBtn.addEventListener('click', clearGrid);


// Push current pixelarray to firebase database
saveCharacter = () => {
    const db = firebase.database();
    const characters = db.ref('characters');
    characters.push(pixelArray);
    setTimeout(() => { location.reload() }, 1000);
}
saveCharBtn.addEventListener('click', saveCharacter);


// Collect all saved characters from firebase database to display 
loadListOfSavedChars = () => {
    // Clear container but only delete char previews, not the exit menu element
    let elements = document.querySelectorAll('div.char-preview')
    elements.forEach(element => {
        favoritesContainer.removeChild(element)
    });

    showCharsBtn.classList = 'display-none'

    // Change class from display-none to display-flex to show div
    favoritesContainer.classList.add('display-flex');
    let autoIncr = 0;
    let menuStatus
    const db = firebase.database();
    const characters = db.ref('characters');

    // Listen to values in firebase database
    characters.once('value').then(function(snapshot) {
        snapshot.forEach(data => {

            // Create a parent div for each characterKey
            let previewContainer = document.createElement('div');
            previewContainer.className = 'char-preview fade-in'
            previewContainer.id = autoIncr++ // this id is used later to show character on grid
                favoritesContainer.appendChild(previewContainer)
            previewContainer.addEventListener('click', () => displayCharsInUI(previewContainer.id))

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
showCharsBtn.addEventListener('click', loadListOfSavedChars);


// Close list with characters by removing display-flex class
closeFavCharList = () => {
    favoritesContainer.classList.remove('display-flex')
    showCharsBtn.classList = 'cta-btn-general'
}
favoritesCharList.addEventListener('click', closeFavCharList)


// Display characters on main grid
displayCharsInUI = (id) => {
    const db = firebase.database();
    const characters = db.ref('characters');
    let targetCharId = id

    characters.once('value').then(function(snapshot) {
        // targetCharId corresponds to correct char key in database
        let targetCharKey = Object.keys(snapshot.val())[targetCharId];
        db.ref('/characters/' + targetCharKey).once('value').then(function(snapshot) {
            // Get the pixelarray of clicked character
            let targetCharArray = snapshot.val()
                // update pixelarray once again
            pixelArray = targetCharArray
                // Regenerate grid to display character in UI
            createGrid();
            // Remove display-flex class to close list and view char on main grid
            favoritesContainer.classList.remove('display-flex')
        })
    })
    setTimeout(() => {
        showCharsBtn.classList = 'cta-btn-general'
    }, 1000);

}


// Activate loop on raspberry pi
toggleLedmatrixLoop = () => {
    const db = firebase.database();
    db.ref('/loopstatus').once('value').then(function(snapshot) {
        let newVal = snapshot.val();
        newVal = !newVal;
        db.ref().update({ loopstatus: newVal });
    })
}
triggerLoopBtn.addEventListener('click', toggleLedmatrixLoop)


// Fill grid with a random generated character
autoGenerateCharacter = () => {
    let newArray = []
    for (let i = 0; i < 32; i++) {
        let random_boolean = Math.random() >= 0.5;
        let pixel = document.createElement('div')
        pixel = random_boolean
        newArray.push(pixel)
    }
    pixelArray = newArray
    let newRevArray = pixelArray.reverse()
    newRevArray.forEach(element => {
        pixelArray.push(element)
    });
    createGrid()
}
autoCharBtn.addEventListener('click', autoGenerateCharacter)