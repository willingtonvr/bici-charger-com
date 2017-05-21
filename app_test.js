var hardware = require('./hardware-driver/arduino')

device = {
  msb : 0x41,
  lsb : 0x42
}

operation = {
  type : 0x53,
  number : 0xA9
}

color = {
  r : 255,
  g : 0,
  b : 2500
}

hardware.on('frame-parsed', function(data){
  console.log(data)
})

setTimeout(hardware.sendData(device, operation, 0x00, color), 30000);

console.log('Magic happends')
