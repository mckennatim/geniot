'use strict';
var url, port, mysqlpwd;
if (process.env.NODE_ENV=='production'){
	var url = 'http://sitebuilt.net';
	var port = 3034;
	mysqlpwd='nji9ol';
} else if (process.env.NODE_ENV=='development'){
	var url = 'http://localhost/';
	var port = 3036;
	mysqlpwd='';
} else{
	var url = 'http://localhost/';
	var port = 3035;
	mysqlpwd='';	
}
var secret = 'some phrase to be used to encode token';
var db = 'hero';

exports.cfg = function () {
	return {
		secret: secret,
		url: url,
		port: port
	};
};

exports.gmail = function () {
	return {
		service: 'Gmail',
		auth: {
			user: "mckenna.tim@gmail.com",
			pass: "Gonji9ol"
		}
	};
};

exports.db = function () {
	return {
		mongo: {
			url: 'mongodb://localhost/' + db,
			db: db
		},
		mysql: {
			host: 'localhost',
			user: 'root',
			password: mysqlpwd,
			database: 'forecast'
		}
	};
};