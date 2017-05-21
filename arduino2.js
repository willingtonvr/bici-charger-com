// serial port initialization:
 var serialport = require('serialport'), // include the serialport library
     SerialPort = serialport, // make a local instance of serial
     portName = process.argv[2],         // get the port name from the command line
     portConfig = {
         baudRate: 9600,
         // call myPort.on('data') when a newline is received:
         //parser: serialport.parsers.readline('}')
         parser: SerialPort.parsers.byteDelimiter([0x7D])
     };
     var current='ON'
     var r=0
     var g=0
     var b=0XFF
     var bufferOn = new Buffer(11);
     bufferOn[0]=0x7B
     bufferOn[1]=0x41
     bufferOn[2]=0x42
     bufferOn[3]=0x53
     bufferOn[4]=0xA9
     bufferOn[5]=0x00
     bufferOn[6]=0x00
     bufferOn[7]=0x00
     bufferOn[8]=0xFF
     bufferOn[9]=0x81
     bufferOn[10]=0x7D

     var bufferOff = new Buffer(11);
     bufferOff[0]=0x7B
     bufferOff[1]=0x41
     bufferOff[2]=0x42
     bufferOff[3]=0x53
     bufferOff[4]=0xA9
     bufferOff[5]=0x00
     bufferOff[6]=0x00
     bufferOff[7]=0x00
     bufferOff[8]=0x00
     bufferOff[9]=0x80
     bufferOff[10]=0x7D



// open the serial port:
var myPort = new SerialPort(portName, portConfig);

myPort.on('open', openPort); // called when the serial port opens
myPort.on('data', procesData);

function openPort() {
    var brightness = 0; // the brightness to send for the LED
    console.log('port open');
    console.log('baud rate: ' + myPort.options.baudRate);

    // since you only send data when the port is open, this function
    // is local to the openPort() function:
    function sendData() {

      r+=10;
      b-=10;
      if (r==0xFF) {
        r=0
        g+=10
      }
      if (g==0xFF){
        g=0
      }
      if (b==0x00) {
        b=0xFF
      }
      // led 2 = 0xA9
      var buffer = getpackcolor(0x41,0x42,0x53,0xA9, 0x00, r, g , b)
      myPort.write(buffer)
      console.log(buffer)
    }
    // set an interval to update the brightness 2 times per second:
    setInterval(sendData, 500);
}
function procesData(data){
  //console.log('---------')
  //console.log(data)
  //console.log("long: " + data.length)
  if (data.length == 11) {

  var func_val=data[4]
  var tipo_sens=lookforid(func_val);
  if (tipo_sens==='N_FUNC_VOLT2' || tipo_sens==='N_FUNC_VOLT1' ){
  console.log('---------')
  if ( verifychecksum(data)) {console.log('checksum OK');}
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

  //console.log("FUNC: " + func_val )
  console.log(tipo_sens + " -->");
  console.log(b3.toString(16)+b2.toString(16)+b1.toString(16)+b0.toString(16))
  console.log("fv1 :"+ floatView)
  console.log("fv2 :"+ floatView.toFixed(2))

  console.log('xxxxxxxx')
  }
}
else {
  console.log('frame error')
}
}
function verifychecksum(data){
  var chk=0
  for (var i = 1; i < 9; i++) {
    chk += data[i]
  }
  chk = chk & 0x00FF
  chk =0xFF - chk
  return (chk == data[9])

}
function lookforid(data){
  switch (data) {
      case 0xC1: return("N_FUNC_VOLT1") ;break; // Voltaje 1
      case 0xC2: return("N_FUNC_VOLT2") ;break; // Voltaje 2
      case 0xC3: return("N_FUNC_VOLT3") ;break; // Voltaje 3
      case 0xC4: return("N_FUNC_VOLT4") ;break; // Voltaje 4
      case 0xD1: return("N_FUNC_CORR1") ;break; // Corriente 1
      case 0xD2: return("N_FUNC_CORR2") ;break; // Corriente 2
      case 0xD3: return("N_FUNC_CORR3") ;break; // Corriente 3
      case 0xD4: return("N_FUNC_CORR4") ;break; // Corriente 4
      case 0xE2: return("N_FUNC_TIME2") ;break; // Tiempo 1
      case 0xE1: return("N_FUNC_TIME1") ;break; // Tiempo 1
      case 0xE3: return("N_FUNC_TIME3") ;break; // Tiempo 1
      case 0xE4: return("N_FUNC_TIME4") ;break; // Tiempo 1
      case 0xA1: return("N_FUNC_TEMP1") ;break; // Sensor 1
      case 0xA2: return("N_FUNC_TEMP2") ;break; // Sensor 2
      case 0xA3: return("N_FUNC_TEMP3") ;break; // Sensor 3
      case 0xA4: return("N_FUNC_TEMP4") ;break; // Sensor 4
      case 0xA8: return("N_FUNC_LED1")  ;break; // Led 1
      case 0xA9: return("N_FUNC_LED2")  ;break;// led 2
      case 0xAA: return("N_FUNC_LED3") ;break; // Led 3
      case 0xAB: return("N_FUNC_LED4") ;break; // led 4
      case 0xB0: return("N_FUNC_MOD")  ;break; // Id modulo
      case 0xA1: return("N_FUNC_USR")  ;break; // Id usuario
      case 0xD0: return("N_FUNC_BAT")  ;break; // tipo bateria

    default:
      return("N_FUNC_NULL")  // funcion vacia para hacer ACK
  }


}

function getpackcolor(id_modH,id_modL,tipo_f,nom_f, id_led, r,g,b ){
var buffer = new Buffer(11);
  buffer[0]=0x7B
  buffer[1]=id_modH & 0xFF
  buffer[2]=id_modL & 0xFF
  buffer[3]=tipo_f & 0xFF
  buffer[4]=nom_f & 0xFF
  buffer[5]=id_led & 0xFF
  buffer[6]=r & 0xFF
  buffer[7]=g & 0xFF
  buffer[8]=b & 0xFF
  var chk=0
  for (var i = 1; i < 9; i++) {
    chk += buffer[i]
  }
  chk = chk & 0x00FF
  chk =0xFF - chk
  buffer[9]=chk
  buffer[10]=0x7D
  return buffer
}
