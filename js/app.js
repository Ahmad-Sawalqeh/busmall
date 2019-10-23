'use strict';

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

var list = document.getElementById('list');

// set when rendering Items
Item.leftObject = null;
Item.rightObject = null;
Item.middleObject = null;

var names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var paths = ['img/bag.jpg', 'img/banana.jpg', 'img/bathroom.jpg', 'img/boots.jpg', 'img/breakfast.jpg', 'img/bubblegum.jpg', 'img/chair.jpg', 'img/cthulhu.jpg', 'img/dog-duck.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/pet-sweep.jpg', 'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.png', 'img/tauntaun.jpg', 'img/unicorn.jpg', 'img/usb.gif', 'img/water-can.jpg', 'img/wine-glass.jpg'];

for (var i = 0 ; i < names.length; i++) {
  new Item(names[i], paths[i]);
}

Item.container.addEventListener('click', clickHandler);

renderNewImages();

/*******************************  functions  *****************************/
function getRandomItem() {
  var index = Math.floor(Math.random() * Item.all.length);
  return Item.all[index];
}

function randomInRange(min, max) {
  var range = max - min + 1; // add one since we will be flooring
  var rand = Math.floor(Math.random() * range) + min
  return rand;
}

function createListElement() {
  list.innerHTML = '';
  for (var j = 0; j < Item.all.length; j++) {
    var li = document.createElement('li');
    li.textContent = Item.all[j].title + ' was clicked ' + Item.all[j].clickCtr + ' and was shown ' + Item.all[j].shownCtr + ' times';
    list.appendChild(li);
  }
}

function renderNewImages() {
  // ensure that previous Item not shown on next round also not in the current round
  var forbidden = [Item.leftObject, Item.rightObject, Item.middleObject];
  // var forbidden = [];
  do {
    Item.leftObject = getRandomItem();
  } while (forbidden.includes(Item.leftObject))
  // add left Item to forbidden list so we don't double up
  forbidden.push(Item.leftObject);
  do {
    Item.rightObject = getRandomItem();
  } while(forbidden.includes(Item.rightObject));
  // add left Item to forbidden list so we don't double up
  forbidden.push(Item.rightObject);
  do {
    Item.middleObject = getRandomItem();
  } while (forbidden.includes(Item.middleObject))
  // add left Item to forbidden list so we don't double up
  forbidden.push(Item.middleObject);
  
  Item.leftObject.shownCtr++;
  Item.rightObject.shownCtr++;
  Item.middleObject.shownCtr++;

  var leftItemImageElement = Item.leftImage;
  var rightItemImageElement = Item.rightImage;
  var middleItemImageElement = Item.middleImage;

  leftItemImageElement.setAttribute('src', Item.leftObject.src);
  leftItemImageElement.setAttribute('alt', Item.leftObject.title);
  rightItemImageElement.setAttribute('src', Item.rightObject.src);
  rightItemImageElement.setAttribute('alt', Item.rightObject.title);
  middleItemImageElement.setAttribute('src', Item.middleObject.src);
  middleItemImageElement.setAttribute('alt', Item.middleObject.title);

  Item.leftTitle.textContent = Item.leftObject.title;
  Item.rightTitle.textContent = Item.rightObject.title;
  Item.middleTitle.textContent = Item.middleObject.title;
}

function clickHandler(event) {
  
  var clickedId = event.target.id;
  var imgClicked;
  
  if(clickedId === 'left-image') {imgClicked = Item.leftObject;}
  else if (clickedId === 'right-image') {imgClicked = Item.rightObject;}
  else if (clickedId === 'middle-image') {imgClicked = Item.middleObject;}
  
  if(imgClicked) {
    imgClicked.clickCtr++;
    Item.roundCtr++;  
    // createListElement();
    if(Item.roundCtr === Item.roundLimit) {      
      alert('You already clicked 25 times!\nPress OK to display the statistics of your choices');    

      Item.container.removeEventListener('click', clickHandler);
      createListElement();    
    } else {
      renderNewImages();
    }
  }
}


// function addElement(tag, container, text) {
//   var element = document.createElement(tag);
//   container.appendChild(element);
//   if(text) {
//     element.textContent = text;
//   }
//   return element;
// }



// finish