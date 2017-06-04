// lo mismo que app pero con eventos
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var Zbar = require('zbar')
var request = require('request')
var user_helper = require('./helpers/user_handler')
var hardware_helper = require('./helpers/hardware_handler')
var config = require('./config')

var hwr_status ={}
var prev_state ={}
var base_hardware =
{
  nombre:'Arduino01',
  device_address : {
    msb: 0x41,
    lsb: 0x42
  },
  n_slots: 4
}

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
    hardware.parent.emit('hardware-uploaded',status)

    })

  })
}
bLogic.prototype.buscar_slot = function(arg1,callback){
  console.log('buscando usuario');
  var rescolor='azul'
  var rslot=0

  callback(null,rslot,rescolor,arg1)

}

bLogic.prototype.blink = function (slot,color_name,usuario,callback){

  var cmd = {
    device : {
      msb : base_hardware.device_address.msb,
      lsb : base_hardware.device_address.lsb
    },
    operation : {
      type : 0x53,
      number : 0xAE
    },
    output : slot
  }
  var color={}
  switch (color_name) {
    case 'azul':
      color.r=0
      color.g=0
      color.b=150
    break;
    case 'rojo':
      color.r=150
      color.g=0
      color.b=0
    break;
    case 'verde':
      color.r=0
      color.g=150
      color.b=0
    break;

    default:
    color.r=0
    color.g=0
    color.b=0
  }
  exports.hardware.sendData(cmd.device, cmd.operation, cmd.output, color)
  callback(null,slot,usuario)
}

bLogic.prototype.turnon = function(slot,usuario,callback){
  var led_NO=0
  switch (slot+1) {
    case 1: led_NO=0xA8;
    break;
    case 2: led_NO=0xA9;
    break;
    case 3: led_NO=0xAA;
    break;
    case 4: led_NO=0xAB;
    break;
  }

  var cmd = {
    device : {
      msb : base_hardware.device_address.msb,
      lsb : base_hardware.device_address.lsb
    },
    operation : {
      type : 0x53,
      number : led_NO
    },
    output : slot
  }

var color={r:0,
    g:0,
    b:255}
// prende el rele
exports.hardware.sendData(cmd.device, cmd.operation, cmd.output, color)
// prende el neopixel
color.r=0
color.g=150
color.b=0
cmd.operation.number = 0xAC
exports.hardware.sendData(cmd.device, cmd.operation, cmd.output, color)

callback(null,slot,usuario)
}

bLogic.prototype.upload = function(slot,user,callback){

  console.log('subiendo estado');
  console.log('slot:' + slot);
  console.log(user);
  console.log('- uuuuuuu -');
  callback(null,'subido')
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
module.exports = bLogic;
