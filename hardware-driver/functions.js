module.exports = {
  verifyChecksum : function(data){
    var chk=0
    for (var i = 1; i < 9; i++) {
      chk += data[i]
    }
    chk = chk & 0x00FF
    chk =0xFF - chk
    return (chk == data[9])
  },
  lookForId : function(data){
    switch (data) {
      case 0xC1: return("N_FUNC_VOLT1") ;break; // Voltaje 1
      case 0xC2: return("N_FUNC_VOLT2") ;break; // Voltaje 2
      case 0xC3: return("N_FUNC_VOLT3") ;break; // Voltaje 3
      case 0xC4: return("N_FUNC_VOLT4") ;break; // Voltaje 4
      case 0xD1: return("N_FUNC_CORR1") ;break; // Corriente 1
      case 0xD2: return("N_FUNC_CORR2") ;break; // Corriente 2
      case 0xD3: return("N_FUNC_CORR3") ;break; // Corriente 3
      case 0xD4: return("N_FUNC_CORR4") ;break; // Corriente 4
      case 0xE2: return("N_FUNC_TIME2") ;break; // Tiempo 1
      case 0xE1: return("N_FUNC_TIME1") ;break; // Tiempo 1
      case 0xE3: return("N_FUNC_TIME3") ;break; // Tiempo 1
      case 0xE4: return("N_FUNC_TIME4") ;break; // Tiempo 1
      case 0xA1: return("N_FUNC_TEMP1") ;break; // Sensor 1
      case 0xA2: return("N_FUNC_TEMP2") ;break; // Sensor 2
      case 0xA3: return("N_FUNC_TEMP3") ;break; // Sensor 3
      case 0xA4: return("N_FUNC_TEMP4") ;break; // Sensor 4
      case 0xA8: return("N_FUNC_LED1")  ;break; // Led 1
      case 0xA9: return("N_FUNC_LED2")  ;break;// led 2
      case 0xAA: return("N_FUNC_LED3") ;break; // Led 3
      case 0xAB: return("N_FUNC_LED4") ;break; // led 4
      case 0xB0: return("N_FUNC_MOD")  ;break; // Id modulo
      case 0xA1: return("N_FUNC_USR")  ;break; // Id usuario
      case 0xD0: return("N_FUNC_BAT")  ;break; // tipo bateria
      default:
        return("N_FUNC_NULL")  // funcion vacia para hacer ACK
    }
  },
  getPackColor : function(id_modH,id_modL,tipo_f,nom_f, id_led, r,g,b ){
      var buffer = new Buffer(11);
      buffer[0]=0x7B
      buffer[1]=id_modH & 0xFF
      buffer[2]=id_modL & 0xFF
      buffer[3]=tipo_f & 0xFF
      buffer[4]=nom_f & 0xFF
      buffer[5]=id_led & 0xFF
      buffer[6]=r & 0xFF
      buffer[7]=g & 0xFF
      buffer[8]=b & 0xFF
      var chk=0
      for (var i = 1; i < 9; i++) {
        chk += buffer[i]
      }
      chk = chk & 0x00FF
      chk =0xFF - chk
      buffer[9]=chk
      buffer[10]=0x7D
      return buffer
    }
}
