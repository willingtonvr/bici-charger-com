
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={
            nombre:'5678',
            Tipo: {nombre:'Alfa'},
            usuario: {codigo:'123456789'},
            estado:'off',
            slot:0,
            power:0,
            uses:0
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




 // funciones del hardware
