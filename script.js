/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  //add new text to coffee counter
  const coffeeDisplay = document.getElementById('coffee_counter');
  coffeeDisplay.innerText = coffeeQty;
}

function clickCoffee(data) {
  let coffeeInc
  coffeeInc = data.coffee += 1;
  updateCoffeeView(coffeeInc);
  renderProducers(data)
;}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  //for each  producer that thing is unlocked at half its price
  // lol i took so much time becuase i had lower case e in foreach 
  producers.forEach(element => {
    let half = element.price / 2;
    if (coffeeCount >= half){
      element.unlocked = true;
    }
    //i forgot we had to return the producer i kept trying to return producer instead of elemenet
    return element;
});
};

function getUnlockedProducers(data) {
  let producers = data.producers;
  //have to return which producers are true. i didn't think we could return first. 
  //i edited this code cuz i set ti to a variabe. i guess if we just return it i don't need to
  return producers.filter(element => {
    if (element.unlocked === true){
      return element;
    
    }
  })
}

function makeDisplayNameFromId(id) {
  // it has to start false that took me a while
  // so we just take all things with an id and change the snake text which i had to look up into a case sensitive thing to put on the page
  // but when it transforms to case text it's true. 
  let arr = [... id]
  //if the string index is not Title case it's false
  var bool = false;
  for (let i=0; i < arr.length; i++){
    //if the first letter is title case or the first index is NOT then uppercase it
    //each letter is false unless it's true, otherwise switch it only for the first letter of a word that is not titled at the first
    //of a word 
    //if the letter is the first of a word it titles and then if there's another word it swaps
    //because all letters are lowercase and then it's ok if all the rest of the letters are lowercas
    if (bool === true || i === 0){
      arr[i] = arr[i].toUpperCase()
      bool = false;
    }
    // the result of me figuring out what snake text and Title case is
    //have to make the underscores spaces but still have to join then at the end. 
    // so the underscore has to be a space and the string
    //has to be rewritten to display on the render properly. 
    if (arr[i] === "_"){
      bool = true;
      arr[i] = " ";
    }
  }
  //have to join all the elements to make a string to render
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
  //if you submit a parent you clear the list 
  // so it's the thing from class where we grab the node and how many children she has
  const childLeng = parent.childNodes.length;
  for (i= 0; i< childLeng; i++){
    //so we got all the children then Moloch feeds
    parent.removeChild(parent.firstChild);
  }
  
}

function renderProducers(data) {
  // grab the container
  const producerContainer = document.getElementById('producer_container');
  // find out whos available
  unlockProducers(data.producers, data.coffee);
  //clear the list then repopulate
  var currentProducers = getUnlockedProducers(data);
  
  deleteAllChildNodes(producerContainer);
  //repopulate here
  currentProducers.forEach(element => {
    //replace an old div with a new dive with new things
    const producerDiv = makeProducerDiv(element);
    //append new things
    producerContainer.appendChild(producerDiv);
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  //i figured this out earlier and just did a return instead of making a var and returning the var
  return data.producers.filter(element =>{
    if (element.id === producerId){
      //take the producer with that id and return it
      //i forgot i called the producer "element" in the filter but 'element' is the producer
      return element;
    }
    //and yeah this is from the lecture i have to 0 it
  })[0];
}

function canAffordProducer(data, producerId) {
  //should be obvious
  let producer = getProducerById(data, producerId)
    if (data.coffee >= producer.price){
      return true;
    }
    return false;
  }

function updateCPSView(cps) {
  const cpsAmt = document.getElementById('cps');
    cpsAmt.innerText = cps;
}

//from readme.md
function updatePrice(oldPrice) {
  const newPrice = Math.floor(oldPrice * 1.25);
  return newPrice;
  
}

//so you need producer and canafford
function attemptToBuyProducer(data, producerId) {
  const producer = getProducerById(data, producerId);
  const afford = canAffordProducer(data, producerId);
  //if you can afford you spend coffee
  //you make it more expensive for the next round
  //your cps goes up 
  //then you get a new cps from current plus new csp
  // so you replace the inner text of the cps in the html element
  if (afford === true){
    producer.qty++
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    const currCPS = data.totalCPS;
    const newCPS = producer.cps + currCPS;
    updateCPSView(newCPS);

    //replace the old coffe ps with the new
    data.totalCPS = newCPS;
    //it has to be a bool because of how the other functions use it
    return true;
  }
  return false;
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
  //apparently this is how often the site renders?
  //to be fair i asked a lot of people a lot of questions and this 
  //is what i figured out
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  unlockProducers(data.producers, data.coffee);
  renderProducers(data);
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
