'use strict';

var _blank = require('./blank.js');

var ydb = _interopRequireWildcard(_blank);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var express = require('express');


module.exports = function () {
	'use strict';

	var router = express.Router();
	router.get('/blank', function (req, res) {
		ydb.getv();
		ydb.fetv();
		ydb.aa.agetv();
		ydb.aa.afetv();
		var C = ydb.Aa;
		var c = new C();
		console.log(c.animals());
		res.send('in a blank module of the api');
	});
	return router;
}();