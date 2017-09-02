////////////////////////////////////////////////////
//mongodb configuration
var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/lightlogger';

///////////////////////////////////////////////////
var plotly = require('plotly')("psmusgrave", "r1yzjyPgIlxDuQllpW5A");

mongo.connect(url, function(err, db) {
    if (err) throw err;
    var data = db.collection('light_readings').find().toArray(function(err,documents){
        var x = [];
        var y = [];
        for (var i in documents){
            x.push(documents[i].timestamp);
            y.push(documents[i].light);
        }

        var graphData = {
            x: x,
            y: y,
            type: "scatter"
        }
        var graphOptions = {filename: "date-axes", fileopt: "overwrite"};
        plotly.plot(graphData, graphOptions, function (err, msg) {
            console.log(msg);
        });

        db.close();
    });
});
