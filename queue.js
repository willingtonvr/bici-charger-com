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
var q_hwr_in = []  // comandos de llegada hardware
var q_hwr_out = []  // comandos de llegada hardware
var hwr_status ={}
var prev_state ={}


var base_hardware =
{
  nombre:'Arduino01',
  device_address : {
    msb: 0x41,
    lsb: 0x42
  },
  n_slots: 3
}
// mas del estilo C/C++

setInterval(main, config.queueInterval);
setInterval(readHardwareFromServer,5000)

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
   q_hwr_in.push(data)
 })

hardware_helper.status(base_hardware, hardware_status_cb)

//fucking callback hell !
function main() {

    if (q_inp.length > 0) {
      var data = q_inp.shift()
      // console.log('cola de input:');
      // console.log(data);
      user_helper.check(data,user_callback)
    }
    if (q_add.length > 0) {
      var data =q_add.shift()
      console.log('Usuario No existe:');
      console.log(data);
    }
    if (q_proc.length > 0) {
      var data = q_proc.shift()
      hardware_helper.status(base_hardware, hardware_status_cb)
      console.log('---- procesar ----');
      var paquete =JSON.parse(data);
      var usuario = paquete.payload
      console.log(usuario);
      if (usuario.bicicletas[0].slot == 0) {  // la bicicleta no esta asignada
        console.log('bicicleta '+  usuario.bicicletas[0].nombre + ': apagada' );

        // acutalizar el estado en el servidor
        for(var i in hwr_status.slot ){

          console.log('slot ' + i + ' ' + hwr_status.slot[i].estado);
          if (hwr_status.slot[i].estado ==='off'){
            output=i;
          }
        }
        var data = {
          nombre:'Arduino01',
          device_address : {
            msb: 0x41,
            lsb: 0x42
          },
          n_slots: 3
        }

        data.slot =[ {numero: parseInt(output) +1 ,estado: 'on'} ]

        console.log('-- actualizar slot --');
        console.log(data);
        hardware_helper.upload(data,hardware_callback)

      }

    }
    if (q_hwr_in.length > 0) {
      var datahwd = q_hwr_in.shift()
      //console.log('cola de hardware:');
      //console.log(datahwd);
        var data = {
          nombre:'Arduino01',
          device_address : {
            msb: 0x41,
            lsb: 0x42
          },
          n_slots: 4
        }

        switch (datahwd.tipo) {
          case 'voltaje':
            data.voltaje =  {numero: datahwd.slot , valor: datahwd.valor }
            break;
          case 'corriente':

            data.corriente =  {numero: datahwd.slot , valor: datahwd.valor }
            break;
          case 'temperatura':

            data.temperatura =  {numero: datahwd.slot , valor: datahwd.valor }
            break;
          /*
          case 'led':
            data.led =  {numero: datahwd.slot , valor: data.valor }
            break;
          */
        }

        hardware_helper.upload(data,hardware_callback)

    }
    if (q_hwr_out.length > 0) {
      // envaimos los comandos
      var cmd = q_hwr_out.shift()
      //onsole.log('--- comando -----');
      //console.log(cmd);
      hardware.sendData(cmd.device, cmd.operation, cmd.output, cmd.color)
    }

}

function user_callback(estado){

  if (estado.status==='no existe'){
    //console.log('AGREGAR : ');
    q_add.push(estado)
  } else {
    //console.log('procesar : ');
    q_proc.push(estado)
  }
}

function hardware_callback(estado){
    hardware_helper.status(base_hardware, hardware_status_cb)
}
function readHardwareFromServer(){
  hardware_helper.status(base_hardware, hardware_status_cb)
}
function hardware_status_cb(estado){

  hwr_status = estado.payload[0]
  if (hardware.bootWait) return;
  if (typeof prev_state.slot =='undefined' ){
    prev_state.slot = hwr_status.slot
    for(var i in hwr_status.slot ){
      if (hwr_status.slot[i].estado ==='on'){
        prev_state.slot[i].estado ='off'
      } else {
        prev_state.slot[i].estado ='on'
      }
    }
  }
  var cmd = {
    device : {
        msb : 0x41,
        lsb : 0x42
      },
    operation : {
        type : 0x53,
        number : 0xAC
      },
    color : {
        r : 0,
        g : 200,
        b : 0
      },
      output : 0
    }
  //console.log('----- slot status------');
  for(var i in hwr_status.slot ){


    if (hwr_status.slot[i].estado ==='on'){
      cmd.color.r =0
      cmd.color.g =150
      cmd.color.b =0

    } else {
      cmd.color.r =150
      cmd.color.g =0
      cmd.color.b =0
    }
    cmd.output = i
    if (hwr_status.slot[i].estado != prev_state.slot[i].estado){
      console.log('slot ' + i + ' SVR: ' + hwr_status.slot[i].estado + ' HWR: ' + prev_state.slot[i].estado)
      hardware.sendData(cmd.device, cmd.operation, cmd.output, cmd.color)
      prev_state.slot[i].estado=hwr_status.slot[i].estado
    }
  }
}
