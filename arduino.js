//var Zbar = require('zbar');
var request = require('request');

//zbar = new Zbar('/dev/video0');

var SerialPort = require("serialport");
var serialport = new SerialPort("/dev/ttyACM0");
//serialport.on('open', function(){
//console.log('Serial Port Opend');

var buffer = new Buffer(11);
buffer[0]=0x7B
buffer[1]=0x41
buffer[2]=0x42
buffer[3]=0x53
buffer[4]=0xA9
buffer[5]=0x00
buffer[6]=0x00
buffer[7]=0x00
buffer[8]=0xFF
buffer[9]=0x81
buffer[10]=0x7D

serialport.on('open',function (error) {
    if (error) {
        console.log('Error while opening the port ' + error);
    } else {
        console.log('CST port open');

    }
});
serialport.on('data', function(data){
      console.log(data);
      console.log('-------------');

  });





/*

callback debe decir al arduino que hacer

*/

/*
otra fucnion en uart.ondata  ---> para leer los daros de la estacion y hacer post de los parametros
*/
