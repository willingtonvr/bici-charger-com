
var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/hardware'

var exports = module.exports = {};

exports.upload = function(data,callback){
    var current = {status:'no ejecutado'}
    console.log(data)
    request.put(url+'/'+data.nombre,
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
          current = {status:'no existe el dispositivo',payload: data}
      }
      callback(current)

    });

  }
