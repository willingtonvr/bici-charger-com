// Archivo general del configuracion
var config = {}

config.server =process.env.REMOTE_SERVER || 'http://localhost'
config.port = process.env.REMOTE_PORT || 4000
config.camera = process.env.CAMERA || '/dev/video0'
config.baudRate = process.env.CAMERA || 9600
config.SerialPort = process.env.CAMERA || '/dev/ttyACM0'
config.queueInterval = process.env.QUEUE_INTERVAL || 500
config.hardwareName =process.env.HARWARE_NAME || 'Arduino01'
config.bootWait = process.env.BOOT_WAIT || 10000
module.exports = config
