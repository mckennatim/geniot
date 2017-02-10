#!/usr/bin/env node
'use strict';

var http = require('http');
var app = require('./app');
var cfg = require('../../hrs-cfg').cfg();

app.set('port', process.env.PORT || cfg.port);
var server = http.createServer(app);

server.listen(app.get('port'), function () {
		console.log('Express server listening on port ' + server.address().port);
});