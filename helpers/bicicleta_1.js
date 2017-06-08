
    var payload ={
            nombre:'54345',
            Tipo: {nombre:'Alfa'},
            usuario: {codigo:'987654321'},
            estado:'off',
            slot:0,
            power:0,
            uses:0
            }


   console.log(payload)
   console.log('---------------------')
    //var request = require('request');
    var request = require('request');
    var config = require('../config')
    var url = config.server+':'+ config.port +'/cargador/bicicleta'
    request.post(url,
    {
      json:true,
      body:payload
    },
    function(error, response,body){
      console.log(body);
    });




 // funciones del hardware
