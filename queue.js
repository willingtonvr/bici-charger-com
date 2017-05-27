// lo mismo que app pero con colas
var Zbar = require('zbar')
var request = require('request')
var user_helper = require('./helpers/user_handler')
var hardware_helper = require('./helpers/hardware_handler')
var config = require('./config')
var hardware = require('./hardware-driver/arduino')

var q_inp = []  // datos que llegan por zbar
var q_add = []  // usuarios a agrear
var q_proc = []  // usuarios a procesar aqui el usuarui es valido
var q_hwr = []  // comandos del hardware

// mas del estilo C/C++
setInterval(main, config.queueInterval);

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

 hardware.on('frame-parsed', function(data){
   //console.log(data)
   q_hwr.push(data)
 })
// conecta mos el arduino


//fucking callback hell !

//


function main() {

    if (q_inp.length > 0) {
      var data = q_inp.shift()
      console.log('cola de input:');
      console.log(data);
      user_helper.check(data,user_callback)
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
    if (q_hwr.length > 0) {
      var datahwd = q_hwr.shift()
      //console.log('cola de hardware:');
      console.log(datahwd);
      if (datahwd.tipo ==='voltaje' || datahwd.tipo ==='corriente'){
        var data ={
          nombre:'Arduino01',
          device_address : {
            msb: 41,
            lsb: 42
          },
          n_slots: 3
        }

        switch (datahwd.tipo) {
          case 'voltaje':
            data.voltaje =  {numero: datahwd.slot , valor: datahwd.valor }
            break;
          case 'corriente':
            data.corriente =  {numero: datahwd.slot , valor: datahwd.valor }
            break;
          /*
          case 'temperatura':
            data.temperatura =  {numero: datahwd.slot , valor: data.valor }
            break;
          case 'led':
            data.led =  {numero: datahwd.slot , valor: data.valor }
            break;
          */
        }

        hardware_helper.upload(data,hardware_callback)
      }
    }

}

function user_callback(estado){
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

function hardware_callback(estado){
  // if (estado.status!='updated'){
      console.log('respuesta server');
      console.log(estado);
  //}
}
