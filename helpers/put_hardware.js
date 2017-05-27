
var request = require('request');
//var hardware = require('./hardware-driver/arduino')


    var payload ={

    nombre:'Arduino01',
    device_address : {
      msb: 41,
      lsb:42
    },
    n_slots: 3,
    slot: [{numero: 1,estado: 'off' },{numero: 2,estado: 'off' },{numero: 3,estado: 'off' } ],
    voltaje: [{numero: 1,valor: 4.5 },{numero: 2,valor: 8.1 },{numero: 3,valor: 9.0 } ],
    corriente: [{numero: 1,valor: 4.5 },{numero: 2,valor: 8.1 },{numero: 3, valor: 9.9 } ]

    }


   console.log(payload)
   console.log('---------------------')
    //var request = require('request');

/*
    request(
        { method: 'PUT'
        , uri: 'http://localhost:4000/cargador/hardware/' + payload.na
        , multipart:
          [ { 'content-type': 'application/json'
            ,  body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
            }
          , { body: 'I am an attachment' }
          ]
        }
      , function (error, response, body) {
          if(response.statusCode == 201){
            console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand)
          } else {
            console.log('error: '+ response.statusCode)
            console.log(body)
          }
        }
      )

*/
 // funciones del hardware
    request.put('http://localhost:4000/cargador/hardware/'+payload.nombre,
    {
      json:true,
      body:payload
    },
    function(error, response,body){
     console.log(body);

    });
