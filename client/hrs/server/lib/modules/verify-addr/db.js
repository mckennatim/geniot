var mysql = require('mysql');
var mconn = require('../../../../hrs-cfg').db().mysql;
var connection = mysql.createConnection(mconn);

connection.connect();

export var getv =(cb)=>{
	connection.query('SELECT * FROM locations WHERE veri=0', function(err, rows, fields) {
	  if (err) throw err;
	  var sloc = JSON.stringify(rows);
	  var locs = JSON.parse(sloc);
	  console.log(locs.length);
	  cb(locs);
	});	
}

export var put = (id, upvals, cb)=>{

}

