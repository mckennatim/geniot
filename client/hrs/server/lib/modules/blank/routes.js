var express = require('express');
import * as ydb from './blank.js'


module.exports = (function() {
	'use strict';
	var router = express.Router();
	router.get('/blank', function(req, res) {
		ydb.getv();
		ydb.fetv();
		ydb.aa.agetv();
		ydb.aa.afetv();
		var C = ydb.Aa;
		var c = new C;
		console.log(c.animals())
		res.send('in a blank module of the api');
	});
	return router;
})();