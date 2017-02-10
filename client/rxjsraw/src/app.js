import Rx from 'rxjs/Rx';
var Navigo = require('navigo')
var mqtt = require('mqtt');
 
Rx.Observable.of(1,2,3)
console.log('starting w import')


window.goprod = ()=>{
  console.log('in goprod')
  router.navigate('/products/list');
}

var el = function(sel) {
  return document.querySelector(sel);
}

var setContent = function(content) {
  el('#content').innerHTML = content;
};

var router;
var routing = function(mode){
  router = new Navigo(null, true);
  router
    .on({
      'products/:id': function (params) {
        setContent('Products id='+params.id);
        console.log(params.id);
      },
      'products': function () {
        setContent('About');
      },
      'dog': function () {
        setContent('Ulysses');
      },
      '*': function () {
        setContent('Home')
      }
    })
    .resolve();  
}

var init = function () {
  routing();
};

window.onload = init;