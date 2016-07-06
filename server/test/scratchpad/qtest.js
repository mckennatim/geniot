var prog = require('./prog2.json')
var env = require('../../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var mysql = require('mysql');
var mconn = cfg.mysql;
var connection = mysql.createConnection(mconn);


var lprogs = function(progs){
	a=[]
	progs.map(function(prog, idx){
		prog.wk.map(function(w,ix){
			w.map(function(x){
				za = {};
				za.senrel = prog.senrel
				za.day = ix
				x.map(function(y,i){
					switch(i){
						case 0:
							za.hr=y
							break;
						case 1:
							za.min=y
							break;
						case 2:
							za.val=y
							break;
					}
				})
				a.push(za)
			})
		})
	})
	return a
}

var b =lprogs(prog)
//console.log(b)

var saveRecs = function(){
	var b =lprogs(prog)
	console.log(b.length)
	for(var i=0; i<b.length;i++){
		//console.log(b[i])
		var c = b[i];
		c.devid="CYURD001"
		//c.progname ="cat2"
		connection.query('INSERT INTO `progs` SET ?', c, function(err, result) {
		  //console.log(result)
		  //console.log(err)
		});
	}
	console.log("cat is done")
	//connection.destroy()
}
//saveRecs()

var delProg=function(){
	connection.query('DELETE FROM `progs` WHERE progname ="cat2"', function(err, result){
		console.log('done')
	})
}

//delProg()

var selCurrent=function(){
	connection.query('SELECT * FROM `progs` WHERE progname="current"', function(err, rows, fields){
		console.log(rows)
	})
}

selCurrent()

