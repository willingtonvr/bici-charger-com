var SerialPort = require('serialport')
var utils = require('./functions')
var config = require('../config')

var baudRate = process.argv[3] || config.baudRate
var portName = process.argv[2] || config.SerialPort

var port = new SerialPort(portName, {
  baudRate : baudRate,
  parser : SerialPort.parsers.byteDelimiter([0x7D])
});
port.bootWait = true
port.on('open', function(){
  console.log('port ' + portName + ' open');
  console.log('baud rate: ' + port.options.baudRate);
  setTimeout(flagBoot,config.bootWait) // esperamos a que el hardware este listo
});

port.on('data', procesData);

port.sendData = function (device_address, operation, led, color) {
  if(this.isOpen()){
    var buffer = utils.getPackColor(device_address.msb, device_address.lsb, operation.type, operation.number, led, color.r, color.g , color.b)
    if (!port.bootWait) this.write(buffer)
  }
}

function procesData(data){
  if (data.length == 11) {
    var func_val=data[4]
    var tipo_sens=utils.lookForId(func_val);
    if (utils.verifyChecksum(data)){
        var buffer = new ArrayBuffer(4);
        var b3=data[5]
        var b2=data[6]
        var b1=data[7]
        var b0=data[8]
        var dv = new DataView(buffer,0,4)
        dv.setUint8(0,b3)
        dv.setUint8(1,b2)
        dv.setUint8(2,b1)
        dv.setUint8(3,b0)
        var floatView = dv.getFloat32(0)
        tipo_sens.valor = floatView
        if (!port.bootWait) this.emit('frame-parsed',tipo_sens)
      }
    else{
      if (!port.bootWait) this.emit('frame-error', {
        error : 'badchecksum'
      })
    }
  }
  else {
    if (!port.bootWait) this.emit('frame-error', {
      error : 'bad length'
    })
  }
}
function flagBoot(){
  port.bootWait = false
  console.log('Hardware Ready');
}

module.exports = port
