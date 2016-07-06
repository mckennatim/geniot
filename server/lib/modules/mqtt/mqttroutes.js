var express = require('express');
var router = express.Router();
var mqtt2 =require('../../modules/mqtt/mqtt2.js')
var currentPacket = mqtt2.currentPacket

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.jsonp({message: "in root of mqtt module"})		
	});
	router.get('/pkt', function (req,res){
	  res.jsonp(currentPacket);
	});
	router.get('/time', function (req,res){
	});
	return router;
}