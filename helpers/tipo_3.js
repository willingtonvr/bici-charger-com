
var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/tipo'


    var payload ={

            nombre:'Alfa',
            voltaje: 24
            }


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
