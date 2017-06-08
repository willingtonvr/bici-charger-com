
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={

    nombre:'Arduino01',
    device_address : {
      msb: 0x41,
      lsb: 0x42
    },
    n_slots: 4,
    slot: [{numero: 1,estado: 'off' },{numero: 2,estado: 'off' },{numero: 3,estado: 'off' },{numero: 4,estado: 'off' } ],
    voltaje: [{numero: 1,valor: 4.0 },{numero: 2,valor: 0.0 },{numero: 3,valor: 0.0 },{numero: 4,valor: 0.0 } ],
    corriente: [{numero: 1,valor: 0.5 },{numero: 2,valor: 0.3 },{numero: 3, valor: 0.2 },{numero: 4,valor: 0.0 } ],
    temperatura: [{numero: 1,valor: 3.0 },{numero: 2,valor: 5.0 },{numero: 3, valor: 10.0 },{numero: 4,valor: 0.0 }]

    }

    console.log(payload)
    console.log('---------------------')
     //var request = require('request');
     var request = require('request');
     var config = require('../config')
     var url = config.server+':'+ config.port +'/cargador/hardware'
     request.post(url,
     {
       json:true,
       body:payload
     },
     function(error, response,body){
       console.log(body);
     });



 // funciones del hardware
