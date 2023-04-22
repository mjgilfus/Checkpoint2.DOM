/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeDisplay = document.getElementById('coffee_counter');
  coffeeDisplay.innerText = coffeeQty;
}

function clickCoffee(data) {
  let coffeeIncrement = data.coffee += 1;
  updateCoffeeView(coffeeIncrement);
  renderProducers(data)
;}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(element => {
    let half = element.price / 2;
    if (coffeeCount >= half){
      element.unlocked = true;
    }
    return element;
});
};

function getUnlockedProducers(data) {
  let producers = data.producers;
  return producers.filter(element => {
    if (element.unlocked === true){
      return element;
    
    }
  })
}

function makeDisplayNameFromId(id) {
  let arr = [... id]
  var bool = false;
  for (let i=0; i < arr.length; i++){
    if (bool === true || i === 0){
      arr[i] = arr[i].toUpperCase()
      bool = false;
    }

    if (arr[i] === "_"){
      bool = true;
      arr[i] = " ";
    }
  }
  return arr.join('');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  const childLeng = parent.childNodes.length;
  for (i= 0; i< childLeng; i++){
    parent.removeChild(parent.firstChild);
  }
  // your code here
}

function renderProducers(data) {
  const producerContainer = document.getElementById('producer_container');
  unlockProducers(data.producers, data.coffee);

  var currentProducers = getUnlockedProducers(data);
  deleteAllChildNodes(producerContainer);

  currentProducers.forEach(element => {
    // Creates a Producer <div>
    const producerDiv = makeProducerDiv(element);
    producerContainer.appendChild(producerDiv);
  });

  // your code here
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.filter(element =>{
    if (element.id === producerId){
      return element;
    }
  })[0];
}

function canAffordProducer(data, producerId) {
  let producer = getProducerById(data, producerId)
    if (data.coffee >= producer.price){
      return true;
    }
    return false;
  }
  
  // your code here


function updateCPSView(cps) {
  const cpsAmt = document.getElementById('cps');
    cpsAmt.innerText = cps;

  // your code here
}

function updatePrice(oldPrice) {
  const newPrice = Math.floor(oldPrice * 1.25);
  return newPrice;
  // your code here
}

function attemptToBuyProducer(data, producerId) {
  const producer = getProducerById(data, producerId);
  const afford = canAffordProducer(data, producerId);

  if (afford === true){
    producer.qty++
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    const currCPS = data.totalCPS;
    const newCPS = producer.cps + currCPS;
    updateCPSView(newCPS);
    data.totalCPS = newCPS;
    return true;
  }
  return false;
  // your code here
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    var producerID = event.target.id
    .split('_')
    .filter(element => {
      if (element !== 'buy') {
        return element
      }
    }).join('_')
    if (canAffordProducer(data, producerID)) {
      attemptToBuyProducer(data, producerID)
      renderProducers(data)
      updateCoffeeView(data.coffee)
    }
    else {
      window.alert("Not enough coffee!")
    }
  }
  else {
    return ''
  }
  // your code here
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  unlockProducers(data.producers, data.coffee);
  renderProducers(data);
  // your code here
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
