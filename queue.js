// lo mismo que app pero con colas
var Zbar = require('zbar')
var request = require('request')
var user_helper = require('./helpers/user_handler')
var config = require('./config')
//var hardware = require('./hardware-driver/arduino')

var q_inp = []  // datos que llegan por zbar
var q_add = []  // usuarios a agrear
var q_proc = []  // usuarios a procesar aqui el usuarui es valido
var q_hwr = []  // comandos del hardware

setInterval(check_queue, config.queueInterval);

console.log('iniciando z bar');
zbar = new Zbar(config.camera);
zbar.stdout.on('data', function(buf) {
  console.log('Request by QR code: ' + buf.toString())
  var data = buf.toString().slice(0,-1).split('-')
  var qdata={
    codigo: data[0],
    bicicleta: data[1]
    }
  q_inp.push(qdata)
 })


//fucking callback hell !

// loop de proceso
function check_queue() {

    if (q_inp.length > 0) {
      var data = q_inp.shift()
      console.log('cola de input:');
      console.log(data);
      user_helper.check(data,handle_check)
    }

    if (q_add.length > 0) {
      var data =q_add.shift()
      console.log('cola de add:');
      console.log(data);
    }

    if (q_proc.length > 0) {
      var data = q_proc.shift()
      console.log('cola de proc:');
      console.log(data);
    }

}

function handle_check(estado){
  //console.log(estado);
  if (estado.status==='no existe'){
    //console.log('AGREGAR : ');
    q_add.push(estado)
  } else {
    //console.log('procesar : ');
    q_proc.push(estado)
  }
  console.log(estado);

}
