// lo mismo que app pero con eventos
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var Zbar = require('zbar')
var request = require('request')
var user_helper = require('./helpers/user_handler')
var hardware_helper = require('./helpers/hardware_handler')
var config = require('./config')


var q_inp = []  // datos que llegan por zbar
var q_add = []  // usuarios a agrear
var q_proc = []  // usuarios a procesar aqui el usuarui es valido
var q_hwr_in = []  // comandos de llegada hardware
var q_hwr_out = []  // comandos de llegada hardware
var hwr_status ={}
var prev_state ={}

module.exports = bLogic;
function bLogic() {
  if (! (this instanceof bLogic)) return new bLogic();
  this._started = false;
  EventEmitter.call(this);
}


inherits(bLogic, EventEmitter);

bLogic.prototype.start = function start() {
  var self = this
  self.zbar ={}
  self.zbar.parent = this
  console.log('started');
  if (self._started) return
  self._started = Date.now()
  self.InitZbar()
  self.InitHardware()
  self.base_hardware =
  {
    nombre:'Arduino01',
    device_address : {
      msb: 0x41,
      lsb: 0x42
    },
    n_slots: 4
  }

};

bLogic.prototype.InitZbar = function InitZbar() {
    console.log('iniciando Z bar');

    this.zbar = new Zbar(config.camera);
    this.zbar.stdout.parent = this

    this.zbar.stdout.on('data', function(buf) {
    console.log('Request by QR code: ' + buf.toString())
    var bl = this.parent
    var data = buf.toString().slice(0,-1).split('-')
    var qdata={
      codigo: data[0],
      bicicleta: data[1]
    }
    user_helper.check(qdata,function(estado){
      if (estado.status==='no existe'){
        bl.emit('usuario-novalido',estado)
      } else {
        bl.emit('usuario-valido',estado)
      }
    })
  })
}


bLogic.prototype.InitHardware = function InitHardware(){
  var hardware = require('./hardware-driver/arduino')
  exports.hardware = hardware
  hardware.parent = this
  hardware.on('frame-parsed', function(datahwd){
  // copia los datos base
  var data = JSON.parse(JSON.stringify( this.parent.base_hardware))

  switch (datahwd.tipo) {
    case 'voltaje':
    data.voltaje =  {numero: datahwd.slot , valor: datahwd.valor }
    break;
    case 'corriente':

    data.corriente =  {numero: datahwd.slot , valor: datahwd.valor }
    break;
    case 'temperatura':

    data.temperatura =  {numero: datahwd.slot , valor: datahwd.valor }
    break;
    /*
    case 'led':
    data.led =  {numero: datahwd.slot , valor: data.valor }
    break;
    */
  }

  hardware_helper.upload(data,function(status){
    this.parent.emit('hardware-uploaded',data)
  
    })

  })
}

//fucking callback hell !
bLogic.prototype.main  = function main () {


  if (q_proc.length > 0) {
    var data = q_proc.shift()
    hardware_helper.status(base_hardware, hardware_status_cb)
    console.log('---- procesar ----');
    var paquete =JSON.parse(data);
    var usuario = paquete.payload
    console.log(usuario);
    if (usuario.bicicletas[0].slot == 0) {  // la bicicleta no esta asignada
      console.log('bicicleta '+  usuario.bicicletas[0].nombre + ': apagada' );

      // acutalizar el estado en el servidor
      for(var i in hwr_status.slot ){

        console.log('slot ' + i + ' ' + hwr_status.slot[i].estado);
        if (hwr_status.slot[i].estado ==='off'){
          output=i;
        }
      }
      var data = {
        nombre:'Arduino01',
        device_address : {
          msb: 0x41,
          lsb: 0x42
        },
        n_slots: 4
      }

      data.slot =[ {numero: parseInt(output) +1 ,estado: 'on'} ]

      console.log('-- actualizar slot --');
      console.log(data);
      hardware_helper.upload(data,hardware_callback)

    }

  }
  if (q_hwr_in.length > 0) {


  }
  if (q_hwr_out.length > 0) {
    // envaimos los comandos
    var cmd = q_hwr_out.shift()
    //onsole.log('--- comando -----');
    //console.log(cmd);
    hardware.sendData(cmd.device, cmd.operation, cmd.output, cmd.color)
  }

}



function hardware_callback(estado){
  hardware_helper.status(base_hardware, hardware_status_cb)
}
function readHardwareFromServer(){
  hardware_helper.status(base_hardware, hardware_status_cb)
}
function hardware_status_cb(estado){

  hwr_status = estado.payload[0]
  if (hardware.bootWait) return;
  if (typeof prev_state.slot =='undefined' ){
    prev_state.slot = hwr_status.slot
    for(var i in hwr_status.slot ){
      if (hwr_status.slot[i].estado ==='on'){
        prev_state.slot[i].estado ='off'
      } else {
        prev_state.slot[i].estado ='on'
      }
    }
  }
  var cmd = {
    device : {
      msb : 0x41,
      lsb : 0x42
    },
    operation : {
      type : 0x53,
      number : 0xAC
    },
    color : {
      r : 0,
      g : 200,
      b : 0
    },
    output : 0
  }
  //console.log('----- slot status------');
  for(var i in hwr_status.slot ){


    if (hwr_status.slot[i].estado ==='on'){
      cmd.color.r =0
      cmd.color.g =150
      cmd.color.b =0

    } else {
      cmd.color.r =150
      cmd.color.g =0
      cmd.color.b =0
    }
    cmd.output = i
    if (hwr_status.slot[i].estado != prev_state.slot[i].estado){
      console.log('slot ' + i + ' SVR: ' + hwr_status.slot[i].estado + ' HWR: ' + prev_state.slot[i].estado)
      hardware.sendData(cmd.device, cmd.operation, cmd.output, cmd.color)
      prev_state.slot[i].estado=hwr_status.slot[i].estado
    }
  }
}
