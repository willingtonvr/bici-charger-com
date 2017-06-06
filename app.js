var bLogic = require('./bici-charger-logic')
var hardware_helper = require('./helpers/hardware_handler')
var async = require('async');
var cargador = bLogic()
var hwr_status ={}
var base_hardware =
{
  nombre:'Arduino01',
  device_address : {
    msb: 0x41,
    lsb: 0x42
  },
  n_slots: 4
}

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
  paquete.payload.hwr = base_hardware
  var usuario = paquete.payload
  var dtauser=JSON.stringify(usuario)
  console.log('usuario Conectado: '+ usuario.nombre );
  if (usuario.bicicletas[0].slot == 0) {  // la bicicleta no esta asignada
    console.log('bicicleta '+  usuario.bicicletas[0].nombre + ': apagada' );

    async.waterfall([
      async.apply(hardware_helper.status2,dtauser),
      cargador.buscar_slot,
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

  } else {
    console.log('bicicleta '+  usuario.bicicletas[0].nombre + ': Encendida' );
    console.log('bicicleta '+  usuario.bicicletas[0].uses + ': veces conectada' );

    async.waterfall([
      async.apply(hardware_helper.status2,dtauser),
      cargador.buscar_slot_off,
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

  }
  console.log('----------');



})

cargador.on('hardware-uploaded',function(data) {

  hardware_helper.upload(data,function(estado){
    if (estado.status !='updated'){
      console.log('----- begin error -----');
      console.log(estado);
      console.log('----- end error -----');
    }
  })
})

cargador.start()
