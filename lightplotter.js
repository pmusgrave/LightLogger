////////////////////////////////////////////////////
//mongodb configuration
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/lightlogger';

///////////////////////////////////////////////////
var plotly = require('plotly')("psmusgrave", "r1yzjyPgIlxDuQllpW5A");

mongo.connect(url, function(err, db) {
    if (err) throw err;
    var collection = db.collection('light_readings');

    var data = [
        {
            x: collection.find({}, {_id: false, timestamp: true, light: false}).toArray(function(err,documents){}),
            y: collection.find({}, {_id: false, timestamp: false, light: true}).toArray(function(err,documents){}),
            type: "scatter"
        }
    ];
    db.close();
    var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
    plotly.plot(data, graphOptions, function (err, msg) {
        console.log(msg);
    });
});
