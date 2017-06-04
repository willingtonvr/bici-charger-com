var bLogic = require('./bici-charger-logic')
var hardware_handler = require('./helpers/hardware_handler')
var async = require('async');
var cargador = bLogic()
var hwr_status ={}

cargador.on('usuario-novalido',function(estado) {

  console.log('usuario-novalido');
  console.log(estado);
  console.log('----------');

})

cargador.on('usuario-valido',function(estado) {
  // cuando tenemos un usuario valido
  // 0. si el usuario esta conectado, desconectarlo
  // 1. verficar si hay un slot para conectar la bicicleta
  // 2. parapadear en azul para que conecte la bicileta
  // 3. encender el cargador correspondiente.
  //
  var paquete =JSON.parse(estado);
  var usuario = paquete.payload
  var dtauser=JSON.stringify(usuario)
  console.log('usuario Conectado: '+ usuario.nombre );
  if (usuario.bicicletas[0].slot == 0) {  // la bicicleta no esta asignada
    console.log('bicicleta '+  usuario.bicicletas[0].nombre + ': apagada' );

    async.waterfall([
      async.apply(cargador.buscar_slot,dtauser),
      cargador.blink,
      cargador.turnon,
      cargador.upload
    ], function (err, result) {
      if(err){
        console.log(err)

      }else {
        console.log('-- Conectado --');
        console.log(result)
      }
    });


    /*
    cargador.blink(2,'azul',usuario, function(a,b,c){
      console.log(a);
      console.log(b);
      console.log(c);

    })
    */
    /*
    cargador.buscar_slot(dtauser, function(a,b,c,d){
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
    })
    */

  }
  console.log('----------');



})

cargador.on('hardware-uploaded',function(data) {

  console.log('hardware-uploaded');
  console.log(data);
  console.log('----------');

})

cargador.start()
