var moment = require('moment-timezone');
var express = require('express');
var router = express.Router();
var env = require('../../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var mysql = require('mysql');
var mconn = cfg.mysql;
var connection = mysql.createConnection(mconn);


console.log(moment().tz("America/Los_Angeles").format())

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.jsonp({message: "in root of datetime module"})		
	});
	router.get('/date', function (req,res){
	  res.send(Date());
	});
	router.get('/senrel/:temp0', function(req,res){
		res.jsonp([
			{temp0: [
			  	[6,12,68],
					[8,20,57],
					[22,0,68],
					[23,30,58]]
			},
				{temp1: [
			  	[6,0,67],
					[9,20,57],
					[18,0,68],
					[21,30,58]]
			}
		])	
	})

	router.get('/time/:devid', function (req,res){
		var devid = req.params.devid
		console.log(devid)
	  console.log(Date.now())
	  console.log(typeof(Date.now()))
	  var nynf = parseInt(moment().tz("America/New_York").format("X"))
	  var nyf = moment().tz("America/New_York").format('LLLL')
	  var nyz = parseInt(moment().tz("America/New_York").format('Z'))
	  res.jsonp({
	  	unix: nynf,
	  	LLLL: nyf,
	  	zone: nyz,
	   });
	});

	router.get('/prog/:devid', function (req,res){
		connection.query('SELECT * FROM `progs` WHERE progname="current"', function(err, rows, fields){
			console.log(rows);
			res.jsonp(rows);
		})
	});
	return router;
}

