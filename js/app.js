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

// set when rendering Items
Item.leftObject = null;
Item.rightObject = null;
Item.middleObject = null;


var names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var paths = ['img/bag.jpg', 'img/banana.jpg', 'img/bathroom.jpg', 'img/boots.jpg', 'img/breakfast.jpg', 'img/bubblegum.jpg', 'img/chair.jpg', 'img/cthulhu.jpg', 'img/dog-duck.jpg', 'img/dragon.jpg', 'img/pen.jpg', 'img/pet-sweep.jpg', 'img/scissors.jpg', 'img/shark.jpg', 'img/sweep.png', 'img/tauntaun.jpg', 'img/unicorn.jpg', 'img/usb.gif', 'img/water-can.jpg', 'img/wine-glass.jpg'];


for (var i = 0 ; i < names.length; i++) {
  new Item(names[i], paths[i]);
}
document.getElementById('clear'),addEventListener('click', function(){
  localStorage.clear();
});
function renderNewItems() {
  // ensure that previous Item not shown on next round
  // var forbidden = [Item.leftObject, Item.rightObject, Item.middleObject];
  var forbidden = [];
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

function getRandomItem() {
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
  var list = document.getElementById('list');
    for (var j = 0; j < Item.all.length; j++) {
      var li = document.createElement('li');
      li.textContent = Item.all[j].title + ' was clicked ' + Item.all[j].clickCtr + ' and was shown ' + Item.all[j].shownCtr + ' times';
      list.appendChild(li);
    }
}
/************************************************* */
function updateItems() {
  console.log("inside updateItems");
  var ItemsString = JSON.stringify(Item.all);
  localStorage.setItem('orders', ItemsString);
}

//get all drinks
function getStorage() {
  console.log("inside getStorage");
  var data = localStorage.getItem('orders');
  var ItemsData = JSON.parse(data);
  if (ItemsData) {
    for (let i = 0; i < ItemsData.length; i++) {
      var rawItemObject = ItemsData[i];
      new Item(
        rawItemObject.title,
        rawItemObject.src,
        rawItemObject.clickCtr,
        rawItemObject.shownCtr,
      );
    }
    renderNewItems();
    // updateTotals();
  }
  // console.log('local Storage Data', ItemsData);
}
/**************************************************/

renderNewItems();
// getStorage();
// localStorage.removeItem('order');
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

    

    if(Item.roundCtr === Item.roundLimit) {

      alert('No more clicking for you!');

      Item.container.removeEventListener('click', clickHandler);

      updateTotals();
      updateItems();
      // getStorage();
      // updateItems()

      // makeAItemChart();

    } else {

      renderNewItems();
    }
  }
}

// Notice that we're attaching event listener to the container, 
// but event.target will allow us to which child element was actually clicked
Item.container.addEventListener('click', clickHandler);

getStorage();







// function addElement(tag, container, text) {
//   var element = document.createElement(tag);
//   container.appendChild(element);
//   if(text) {
//     element.textContent = text;
//   }
//   return element;
// }

function makeAItemChart(){

  var itemNamesArray = [];
  var itemLikesArray =[];
  var itemShownArray =[];

  for(var i = 0; i < Item.all.length; i++){
    var singleItemName = Item.all[i].name;
    itemNamesArray.push(singleItemName);
  }

  for(var i = 0; i < Item.all.length; i++){
    var singleItemLikes = Item.all[i].clickCtr;
    itemLikesArray.push(singleItemLikes);
    var singleItemLikes = Item.all[i].shownCtr;
    itemShownArray.push(singleItemLikes);

  }

  var ctx = document.getElementById('myChart').getContext('2d');
  var ItemChart = new Chart(ctx, {
  // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'],
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


// finish
