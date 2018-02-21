const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const MongoClient = require('mongodb').MongoClient;
const service = require('feathers-mongodb');

const MONGO_URI = "mongodb://sean:password@ds115866.mlab.com:15866/aphex";

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({extended: true}));
// Enable REST services
app.configure(express.rest());
// Enable Socket.io
app.configure(socketio());

//Connect to the db, create and register a Feathers service.
app.use('/messages', service({
    paginate: {
        default: 2,
        max: 4
    }
}));

var seedData = [
    {
        decade: '1970s',
        artist: 'Debby Boone',
        song: 'You Light Up My Life',
        weeksAtOne: 10
    },
    {
        decade: '1980s',
        artist: 'Olivia Newton-John',
        song: 'Physical',
        weeksAtOne: 10
    },
    {
        decade: '1990s',
        artist: 'Mariah Carey',
        song: 'One Sweet Day',
        weeksAtOne: 16
    }
];

// A basic error handler, just like Express
app.use(express.errorHandler());

//Connect to Aphex MongoDB
MongoClient.connect(MONGO_URI, function(err, db){
    if(err) throw err;
    var dbo = db.db('aphex');
    var testobj = {
        name: 'Sean',
        title: 'Student'
    };

    console.log('connection successful');

    dbo.collection("messages").insertOne(testobj, function(err, res) {
        if(err) throw err;
        console.log("1 entry inserted");
        db.close();
        console.log('connection closed');
    });
});

// Conect to Aphex MongoDB using feathers plugin
// MongoClient.connect(MONGO_URI, function(client){
//     // Set the model for feathers
//     app.service('messages').messages = client.db('feathers').collection('messages');
//
//     //create a dummy message
//     app.service('messages').create({
//         text: 'Message created on server'
//     });
// });