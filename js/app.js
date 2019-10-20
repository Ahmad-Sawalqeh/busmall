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
        - update clicke img count of how many times it has been clicked on
        - update both img'count of times shown
        - Randomly Pick 2 goats, run the same code that put them on the screen to begin with

  HTML
    - have a container for left and right img
    - Give the img id's so we can select them
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
    prevent all currently displayed img from being re clicked {
    }
  })

  function to display all the clicks at the end () {
    generate a table or list
    populate the data - adds to the inner html of an existing element (table or list)
    divide object's times clicked by total shown
  }

*/



/* TODO
* HTML with image container and 2 img with ids
* set left and right goat img to random
*   - but not 2 same img at same time
*/


function Item(title, src) {
  this.title = title;
  this.src = src;
  this.clickCtr = 0;
  this.shownCtr = 0;
  Item.all.push(this);
}

Item.roundCtr = 0;
Item.roundLimit = 25;

Item.all = [];

Item.container = document.getElementById('container');
Item.leftImage = document.getElementById('left-image');
Item.rightImage = document.getElementById('right-image');
Item.middleImage = document.getElementById('middle-image');
Item.middleTitle = document.getElementById('middle-title');
Item.leftTitle = document.getElementById('left-title');
Item.rightTitle = document.getElementById('right-title');

// set when rendering goats
Item.leftObject = null;
Item.rightObject = null;
Item.middleObject = null;


var names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var paths = ['img/bag.jpg', 'img/banana.jpg', 'img/bathroom.jpg', 'img/boots.jpg', 'img/breakfast.jpg', 'img/bubblegum.jpg', 'img/chair.jpg', 'img/cthulhu.jpg', 'img/dog-duck.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/pet-sweep.jpg', 'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.png', 'img/tauntaun.jpg', 'img/unicorn.jpg', 'img/usb.gif', 'img/water-can.jpg', 'img/wine-glass.jpg'];


for (var i = 0 ; i < names.length; i++) {
  new Item(names[i], paths[i]);
}

function renderNewGoats() {

  // ensure that previous goats not shown on next round
  var forbidden = [Item.leftObject, Item.rightObject, Item.middleObject];

  do {

    Item.leftObject = getRandomGoat();

  } while (forbidden.includes(Item.leftObject))

  // add left goat to forbidden list so we don't double up
  forbidden.push(Item.leftObject);

  do {

    Item.rightObject = getRandomGoat();

  } while(forbidden.includes(Item.rightObject));

  do {

    Item.middleObject = getRandomGoat();

  } while (forbidden.includes(Item.middleObject))

  // add left goat to forbidden list so we don't double up
  forbidden.push(Item.middleObject);

  // WARNING: if you got really unlucky the above code would result in infinite loop
  // Can you think of safer ways?
  
  Item.leftObject.shownCtr++;
  Item.rightObject.shownCtr++;
  Item.middleObject.shownCtr++;

  var leftGoatImageElement = Item.leftImage;
  var rightGoatImageElement = Item.rightImage;
  var middleGoatImageElement = Item.middleImage;

  leftGoatImageElement.setAttribute('src', Item.leftObject.src);
  leftGoatImageElement.setAttribute('alt', Item.leftObject.title);
  rightGoatImageElement.setAttribute('src', Item.rightObject.src);
  rightGoatImageElement.setAttribute('alt', Item.rightObject.title);
  middleGoatImageElement.setAttribute('src', Item.middleObject.src);
  middleGoatImageElement.setAttribute('alt', Item.middleObject.title);

  Item.leftTitle.textContent = Item.leftObject.title;
  Item.rightTitle.textContent = Item.rightObject.title;
  Item.middleTitle.textContent = Item.middleObject.title;
}

function getRandomGoat() {
  var index = Math.floor(Math.random() * Item.all.length);
  return Item.all[index];
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

  for (var i = 0; i < Item.all.length; i++) {
    var goat = Item.all[i];
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
  var imgClicked;

  if(clickedId === 'left-image') {
    imgClicked = Item.leftObject;
  } else if (clickedId === 'right-image') {
    imgClicked = Item.rightObject;
  } else if (clickedId === 'middle-image') {
    imgClicked = Item.middleObject;
  }

  if(imgClicked) {
    imgClicked.clickCtr++;
    Item.roundCtr++;

    updateTotals();

    if(Item.roundCtr === Item.roundLimit) {

      alert('No more clicking for you!');

      Item.container.removeEventListener('click', clickHandler);

    } else {

      renderNewGoats();
    }
  }
}

// Notice that we're attaching event listener to the container, 
// but event.target will allow us to which child element was actually clicked
Item.container.addEventListener('click', clickHandler);

updateTotals();

renderNewGoats();


// finish
