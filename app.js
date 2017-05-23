var Zbar = require('zbar');
var request = require('request');
//var hardware = require('./hardware-driver/arduino')
zbar = new Zbar('/dev/video0');


zbar.stdout.on('data', function(buf) {
  console.log('Requests by QR code: ' + buf.toString())

   var data = buf.toString().slice(0,-1).split('-')



    var payload ={
     Tipo : {
            nombre:'Alfa',
            voltaje: 12
            },
     Usuario : {
            nombre : 'Pepe',
            codigo: data[0]
            },
     nombre : data[1]

   }
   console.log(payload)
   console.log('---------------------')
    //var request = require('request');

    request.post('http://localhost:4000/cargador/bicicleta',
    {
      json:true,
      body:payload
    },
    function(error, response,body){
      console.log(body);
    });


 })

 // funciones del hardware
