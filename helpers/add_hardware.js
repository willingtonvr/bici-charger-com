
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={

    nombre:'Arduino03',
    device_address : {
      msb: 41,
      lsb:42
    },
    n_slots: 3,
    slot: [{numero: 1,estado: 'on' },{numero: 2,estado: 'off' },{numero: 3,estado: 'off' } ],
    voltaje: [{numero: 1,valor: 4.0 },{numero: 2,valor: 0.0 },{numero: 3,valor: 0.0 } ],
    corriente: [{numero: 1,valor: 0.5 },{numero: 2,valor: 0.3 },{numero: 3, valor: 0.2 } ]

    }


   console.log(payload)
   console.log('---------------------')
    //var request = require('request');

    request.post('http://localhost:4000/cargador/hardware',
    {
      json:true,
      body:payload
    },
    function(error, response,body){
     console.log(body);

    });




 // funciones del hardware
