
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={

            nombre:'Juan Diego Jaramillo',
            codigo: 987654321,
	    bicicletas: []	
            }


   console.log(payload)
   console.log('---------------------')
    //var request = require('request');

    request.post('http://localhost:4000/cargador/usuario',
    {
      json:true,
      body:payload
    },
    function(error, response,body){
      console.log(body);
    });




 // funciones del hardware
