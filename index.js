var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.set('view engine', 'pug');
app.get('/', function(req, res){
    res.render('index', { title: 'Socket.IO chat' })
});

var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
// var url = 'mongodb://localhost:27017/myproject';
var url = 'mongodb://kriz:Ts83@ds027799.mlab.com:27799/padum';

// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var insertDocuments = function (db, cords) {
        // Get the documents collection
        var collection = db.collection('mynewcollection');
        // Insert some documents
        collection.insertMany([cords], function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
//    console.log("Inserted cords into the mynewcollection");
        });
    }

    io.on('connection', function (socket) {
        socket.on('mousemove', function (evt) {
            var currentTime = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');
            var cords = {
                x: evt.x,
                y: evt.y,
                timeStamp: currentTime
            }
            console.log('x:', evt.x, 'y:', evt.y);
            insertDocuments(db, cords);
            io.emit('mousemove', evt);

        });
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
