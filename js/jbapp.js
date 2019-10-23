'use strict';

/*
  Practice domain modeling by planning out an app w that allows users to choose their favorite between two goats
  Let students participate by suggesting the steps needed to make the app run
  Continue until students have provided enough detail that they feel confident they could build the app themselves

  App Flow:
  - Welcome and instructions
  - Randomly put 2 goats on the screen
    - Random number generator
    - a function to display goats
  - A user clicks on a goat
    - event listener needs to be on the image to fire the event handler
    - the event handler fires
      - ? check if total clicks is 25 ?
        - stop letting the user click
        - display the clicks
      -? If not ?
        - track which goat was clicked on
        - update clicke images count of how many times it has been clicked on
        - update both images'count of times shown
        - Randomly Pick 2 goats, run the same code that put them on the screen to begin with

  HTML
    - have a container for left and right images
    - Give the images id's so we can select them
    - let the user know what they are supposed to do
      - instructions

  More javascript details
  We need Objects with all the image properties
  var Image = function ()
  {
    name : 'cool goat',
    clicks: 0,
    times shown: 0,
    url : 'cool-goat.jpg'
  }

  We need an Array to hold all image Objects

  function to randomly pick an image{
    Prevent last picked goats from being picked
      - STRETCH pick all goats evenly as possible
    Math.floor  Math.random() * array.length()
    make sure left and right image are unique
  }

  click on an image, targetted by id
  add event listener('click', function(){
    keep track of the image that is clicked
    prevent all currently displayed images from being re clicked {
    }
  })

  function to display all the clicks at the end () {
    generate a table or list
    populate the data - adds to the inner html of an existing element (table or list)
    divide object's times clicked by total shown
  }

*/



/* TODO
* HTML with image container and 2 images with ids
* set left and right goat images to random
*   - but not 2 same images at same time
*/


function Goat(title, src) {
  this.title = title;
  this.src = src;
  this.clickCtr = 0;
  this.shownCtr = 0;
  Goat.all.push(this);
}

Goat.roundCtr = 0;
Goat.roundLimit = 10;

Goat.all = [];

Goat.container = document.getElementById('goat-container');
Goat.leftImage = document.getElementById('left-goat-image');
Goat.rightImage = document.getElementById('right-goat-image');

Goat.leftTitle = document.getElementById('left-goat-title');
Goat.rightTitle = document.getElementById('right-goat-title');

// set when rendering goats
Goat.leftObject = null;
Goat.rightObject = null;

new Goat('Kissing Goat', 'images/kissing-goat.jpg');
new Goat('Sassy Goat', 'images/sassy-goat.jpg');
new Goat('Goat Away', 'images/goat-away.jpg');
new Goat('Goat Out of Hand', 'images/goat-out-of-hand.jpg');
new Goat('Smiling Goat', 'images/smiling-goat.jpg');
new Goat('Sweater Goat', 'images/sweater-goat.jpg');
new Goat('Cruisin Goat', 'images/cruisin-goat.jpg');
new Goat('Float Your Goat', 'images/float-your-goat.jpg');

function renderNewGoats() {

  // ensure that previous goats not shown on next round
  var forbidden = [Goat.leftObject, Goat.rightObject];

  do {

    Goat.leftObject = getRandomGoat();

  } while (forbidden.includes(Goat.leftObject))

  // add left goat to forbidden list so we don't double up
  forbidden.push(Goat.leftObject);

  do {

    Goat.rightObject = getRandomGoat();

  } while(forbidden.includes(Goat.rightObject));

  // WARNING: if you got really unlucky the above code would result in infinite loop
  // Can you think of safer ways?
  
  Goat.leftObject.shownCtr++;
  Goat.rightObject.shownCtr++;

  var leftGoatImageElement = Goat.leftImage;
  var rightGoatImageElement = Goat.rightImage;

  leftGoatImageElement.setAttribute('src', Goat.leftObject.src);
  leftGoatImageElement.setAttribute('alt', Goat.leftObject.title);
  rightGoatImageElement.setAttribute('src', Goat.rightObject.src);
  rightGoatImageElement.setAttribute('alt', Goat.rightObject.title);

  Goat.leftTitle.textContent = Goat.leftObject.title;
  Goat.rightTitle.textContent = Goat.rightObject.title;
}

function getRandomGoat() {
  var index = Math.floor(Math.random() * Goat.all.length);
  return Goat.all[index];
}

// not using this, just showing the better way vs. ceil
function randomInRange(min, max) {
  var range = max - min + 1; // add one since we will be flooring
  var rand = Math.floor(Math.random() * range) + min
  return rand;
}

function updateTotals() {

  var tableBody = document.getElementById('report');

  // Remove all children so that content doesn't get duplicated
  // easiest way is to set innerHTML
  // WARNING: will not remove event listeners, so be careful with that
  tableBody.innerHTML = '';

  for (var i = 0; i < Goat.all.length; i++) {
    var goat = Goat.all[i];
    var row = addElement('tr', tableBody);
    addElement('td', row, goat.title);
    addElement('td', row, '' + goat.clickCtr);
    addElement('td', row, '' + goat.shownCtr);
  }
}

function addElement(tag, container, text) {
  var element = document.createElement(tag);
  container.appendChild(element);
  if(text) {
    element.textContent = text;
  }
  return element;
}

function clickHandler(event) {

  var clickedId = event.target.id;
  var goatClicked;

  if(clickedId === 'left-goat-image') {
    goatClicked = Goat.leftObject;
  } else if (clickedId === 'right-goat-image') {
    goatClicked = Goat.rightObject;
  } else {
    console.log('Um, what was clicked on???', clickedId);
  }

  if(goatClicked) {
    goatClicked.clickCtr++;
    Goat.roundCtr++;

    updateTotals();

    if(Goat.roundCtr === Goat.roundLimit) {

      alert('No more clicking for you!');

      Goat.container.removeEventListener('click', clickHandler);

    } else {

      renderNewGoats();
    }
  }
}

// Notice that we're attaching event listener to the container, 
// but event.target will allow us to which child element was actually clicked
Goat.container.addEventListener('click', clickHandler);

updateTotals();

renderNewGoats();