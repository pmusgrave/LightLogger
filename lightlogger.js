////////////////////////////////////////////////////
//mongodb configuration
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/lightlogger';


////////////////////////////////////////////////////
//serialport configuration
var SerialPort = require('serialport');
var Readline = SerialPort.parsers.Readline;
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
var parser = port.pipe(new Readline());

var serialdata = null;
////////////////////////////////////////////////////

parser.on('data', function(data){
    serialdata = data;
});

setInterval(function () {
    console.log('Data:', serialdata);

    var time = new Date().toLocaleString();
    mongo.connect(url, function(err, db) {
        if (err) throw err;
        var collection = db.collection('light_readings');

        collection.insert({
            timestamp: time,
            light: serialdata
        }, function(err, data){
            db.close();
        })
    });
}, 100000);
