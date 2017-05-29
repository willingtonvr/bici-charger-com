
var request = require('request');
var config = require('../config')
var url = config.server+':'+ config.port +'/cargador/hardware'
var data={}
data.nombre='Arduino01'

var current = {status:'no ejecutado'}
  //console.log(data)
request.get(url+'/'+data.nombre,
function(error, response,body){
    //console.log('puttin response');
    //console.log(body);
    //var resp =JSON.parse(body)
    var resp = body
    if (error) { console.log('erorr' + error)}
    console.log(body);

  });
