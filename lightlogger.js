var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
var parser = port.pipe(new Readline());

var serialdata = null;

parser.on('data', function(data){
    serialdata = data;
});

setInterval(function () {
    console.log('Data:', serialdata);
    // port.flush();
}, 5000);
