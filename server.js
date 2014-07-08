#!/bin/env node

var fs      = require('fs');
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);


var PianoLive = function() {

    var self = this;


    self.setupVariables = function() {

        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };

    self.initializeServer = function() {
        app.use(express.static(__dirname + '/static', { maxAge: 0 }));

        io.on('connection', function(socket){
          socket.on('note', function(msg){
            this.broadcast.emit('note', msg);
          });
        });
    };


    self.initialize = function() {
        self.setupVariables();
        self.initializeServer();
    };


    self.start = function() {
        http.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};

var pianoLive = new PianoLive();
pianoLive.initialize();
pianoLive.start();