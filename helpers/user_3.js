
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={

            nombre:'Manuela Herrera',
            codigo: 123456789,
	    bicicletas: []
            }


            console.log(payload)
            console.log('---------------------')

             //var request = require('request');
             var request = require('request');
             var config = require('../config')
             var url = config.server+':'+ config.port +'/cargador/usuario'
             request.post(url,
             {
               json:true,
               body:payload
             },
             function(error, response,body){
               console.log(body);
             });
          // funciones del hardware
