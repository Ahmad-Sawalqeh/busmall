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

var clearLocalStorageButton = document.getElementById('clear');

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
// clearLocalStorageButton.addEventListener('click', clearLocalStorage);

getStorage();
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
    li.textContent = Item.all[j].title + ' had ' + Item.all[j].clickCtr + ' votes and was shown ' + Item.all[j].shownCtr + ' times';
    list.appendChild(li);
  }
}

function setStorage() {
  localStorage.setItem('orders', JSON.stringify(Item.all));
}

function getStorage() {
  var ItemsString = localStorage.getItem('orders');
  if (ItemsString) {
   var rowOfObjectsArray = JSON.parse(ItemsString);
  Item.all = rowOfObjectsArray;
  createListElement();
  }
}

function clearLocalStorage(){
  localStorage.clear();
  list.innerHTML = '';
  Item.container.removeEventListener('click', clickHandler);
  clearLocalStorageButton.removeAttribute('style');
  clearLocalStorageButton.removeEventListener('click', clearLocalStorage);
}

function renderNewImages() {
  // ensure that previous Item not shown on next round also not in the current round
  var forbidden = [Item.leftObject, Item.rightObject, Item.middleObject];
  // var forbidden = [];
  // for (var forbiddenObject = 0 ; forbiddenObject < 3 ; forbiddenObject++){
  //   do {
  //     forbidden[forbiddenObject] = getRandomItem();
  //   } while (forbidden.includes(forbidden[forbiddenObject]))
  //   forbidden.push(forbidden[forbiddenObject]);
  // } 


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
  




  var shownObjectsArrayCtr = [Item.leftObject, Item.rightObject, Item.middleObject];
  for(var i = 0 ; i < shownObjectsArrayCtr.length ; i++){
    shownObjectsArrayCtr[i].shownCtr++;
  }
  // Item.leftObject.shownCtr++;
  // Item.rightObject.shownCtr++;
  // Item.middleObject.shownCtr++;



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

function makeAItemChart(){

  var itemNamesArray = [];
  var itemLikesArray = [];
  var itemShownArray = [];

  for(var i = 0; i < Item.all.length; i++){
    itemNamesArray.push(Item.all[i].name);
    itemLikesArray.push(Item.all[i].clickCtr);
    itemShownArray.push(Item.all[i].shownCtr);
  }

  var ctx = document.getElementById('myChart').getContext('2d');
  var ItemChart = new Chart(ctx, {
  // The type of chart we want to create
    type: 'bar',
    // The data for our dataset
    data: {
      labels: names,
      datasets: [{
        label: 'Buss Mall Vote',
        backgroundColor: 'blue',
        borderColor: 'rgb(255, 99, 132)',
        data: itemLikesArray
      },{
        label: 'Buss Mall Shown',
        backgroundColor: 'red',
        borderColor: 'rgb(255, 99, 132)',
        data: itemShownArray
      }]
    },

    // Configuration options go here
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

function clickHandler(event) {
  
  var clickedId = event.target.id;
  var imgClicked;
  setStorage();
  
  if(clickedId === 'left-image') {imgClicked = Item.leftObject;}
  else if (clickedId === 'right-image') {imgClicked = Item.rightObject;}
  else if (clickedId === 'middle-image') {imgClicked = Item.middleObject;}
  
  if(imgClicked) {
    imgClicked.clickCtr++;
    Item.roundCtr++;  
    // createListElement();
    if(Item.roundCtr === Item.roundLimit) {      
      alert('You already clicked 25 times!\nPress OK to display the statistics of your choices');    
      addClearButton();
      // Item.container.removeEventListener('click', clickHandler);
      createListElement();
      makeAItemChart();      
    } else {
      renderNewImages();
    }
  }
}

function addClearButton(){
  clearLocalStorageButton.setAttribute('style','opacity:1;cursor: pointer;');
  clearLocalStorageButton.addEventListener('click', clearLocalStorage);
  Item.container.removeEventListener('click', clickHandler);
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
