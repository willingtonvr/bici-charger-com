

var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/tipo'

//var hardware = require('./hardware-driver/arduino')


    var payload ={

            nombre:'Gamma',
            voltaje: 48
            }

   console.log(url);          
   console.log(payload)
   console.log('---------------------')
    //var request = require('request');

    request.post(url,
    {
      json:true,
      body:payload
    },
    function(error, response,body){
      console.log(body);
    });




 // funciones del hardware
