var bLogic = require('./bici-charger-logic')
var cargador = bLogic()

cargador.on('usuario-novalido',function(estado) {

  console.log('usuario-novalido');
  console.log(estado);
  console.log('----------');

})

cargador.on('usuario-valido',function(estado) {
  console.log('usuario-valido');
  console.log(estado);
  console.log('----------');


})

cargador.on('hardware-uploaded',function(data) {

  console.log('hardware-uploaded');
  console.log(data);
  console.log('----------');

})

cargador.on('encender-slot',function(data) {

  console.log('encender-slot');
  console.log(data);
  console.log('----------');

})

cargador.on('apagar-slot',function(data) {
  console.log('apagar-slot');
  console.log(data);
  console.log('----------');


})

cargador.start()
