

var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/usuario'

var exports = module.exports = {};

exports.check = function(data,callback){
    var current = {status:'no ejecutado'}
    request.get(url+'/'+data.codigo,
      function(error, response,body){
      var resp =JSON.parse(body)
      if (error) { console.log(error)}

      if (resp.status==='success'){
            // ok el usuario existe "status":"success"
          current = {status:'existe', payload: data }
      }
      else {
          current = {status:'no existe',payload: data}
      }
      callback(current)
    });

  }

exports.add = function(a_nombre,a_codigo){
  var payload ={
    nombre:a_nombre,
    codigo: a_codigo
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


}
