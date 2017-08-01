/*
* Creating, adding attributes and appending of DOM elements
*/
const createDOMNode = name => document.createElement(name);
const getDOMNode = selector => document.querySelector(selector);
const getDOMNodes = selector => document.querySelectorAll(selector);

const clearNodes = (...nodes) => {
  toArray(nodes).forEach(node => { node.innerHTML = '' });
};

const setElementAttributes = attributes => element => {
  for (let key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
};

const appendChildNode = parent => element => {
  parent.appendChild(element);
  return element;
};

const appendNode = (name,attributes) => (parent) => {
  return pipe(
    setElementAttributes(attributes),
    appendChildNode(parent)
  )(createDOMNode(name));
};

const toArray = (...list) => [].slice.call(list);


const animate = (el, animationName, remove = true) => {
  el.classList.toggle(animationName);
  el.addEventListener('animationend', function animationHandler() {
    if (remove) el.classList.toggle(animationName);
    el.removeEventListener('animationend', animationHandler);
  });
};


// Kris Selbekk Apr 5, 2017 - randomize array
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const randomize = arr => {
  return arr.sort(function() { return Math.random() * 2 - 1 });
};

const map = (fn, ...list) => list.map(fn);
const _pipe = (f, g) => (...args) => g(f(...args));
const pipe = (...fns) => fns.reduce(_pipe);
const compose = (...fns) => fns.reduceRight(_pipe);
