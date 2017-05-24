var Zbar = require('zbar')
var request = require('request')
var user_helper = require('./helpers/user_handler')
var config = require('./config')
var test = {
  existe:'no definido',
  conectado: false
}


//var hardware = require('./hardware-driver/arduino')
zbar = new Zbar(config.camera);


zbar.stdout.on('data', function(buf) {
  console.log('Requests by QR code: ' + buf.toString())
  var data = buf.toString().slice(0,-1).split('-')
  user_helper.check(data[0],handle_check)
  console.log('--Zbar on')
  console.log(test);
 })
//fucking callback hell !

 function handle_check(estado){
   //console.log(estado);
   if (estado.status==='no existe'){
     console.log('AGREGAR : ' + data[0] + ' ' + data[1] );
     test.existe='Agreado'
     test.conectado = false
   }
   test.existe='si existe'
   test.conectado = true
   console.log('--handle_check')
   console.log(test);
 }

 // funciones del hardware
