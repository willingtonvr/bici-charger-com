

var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/usuario'

var exports = module.exports = {};

exports.check = function(data,callback){
    var current = {status:'no ejecutado'}
    request.get(url+'/'+data.codigo,
      function(error, response,body){
      var resp =JSON.parse(body)
      //console.log(body);

      if (error) {
        console.log('---- ERROR -----');
        console.log(error)
      }

      if (resp.status==='success'){
            // ok el usuario existe "status":"success"
          current = body
      }
      else {
          current = {status:'no existe',payload: data}
      }
      callback(current)
    });

  }

exports.upload = function(data,callback){
    var current = {status:'no ejecutado'}
    //console.log(data)
    request.put(url+'/'+data.codigo,
    {
      json:true,
      body:data
    },
    function(error, response,body){
      console.log('puttin response');
      console.log(body);
      //var resp =JSON.parse(body)
      var resp = body
      if (error) { console.log('erorr' + error)}
      if (resp.status==='success'){

          current = {status:'updated', payload: data }
      }
      else {
          current = {status:'upload no existe el dispositivo',payload: data}
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
