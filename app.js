var Zbar = require('zbar');
var request = require('request');

zbar = new Zbar('/dev/video0');

var SerialPort = require("serialport").SerialPort;
var serialport = new SerialPort("/dev/ttyACM0");
serialport.on('open', function(){
console.log('Serial Port Opend');

serialport.on('data', function(data){
      console.log(data);
  });
});


zbar.stdout.on('data', function(buf) {
  console.log('Requests by QR code: ' + buf.toString())

   var data = buf.toString().slice(0,-1).split('-')

   console.log({
     user : data[0],
     bicicleta : data[1]
   })
   console.log('---------------------')
    var payload ={
     usuario : data[0],
     bicicleta : data[1]
   }

    //var request = require('request');

    request.post('http://localhost:8080/qrinput',
    {
      json:true,
      body:payload
    },
    function(error, response,body){
      console.log(body);
    });


 })

/*

callback debe decir al arduino que hacer

*/

/*
otra fucnion en uart.ondata  ---> para leer los daros de la estacion y hacer post de los parametros
*/
