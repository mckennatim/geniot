var moment = require('moment-timezone');

var cb=function(){
	console.log("in cb")
}

var flattenProgObj =function(progs){	
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
							za.hour=y
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

var parseProg =function(prog){
	console.log(prog)
}

var getTime = function(devid, mosca, cb){
	console.log("it's 4 oclock")
  console.log(Date.now())
  console.log(typeof(Date.now()))
  //var spot="America/Los_Angeles"
  var spot="America/New_York"
  var nynf = parseInt(moment().tz(spot).format("X"))
  var nyf = moment().tz(spot).format('LLLL')
  var nyz = parseInt(moment().tz(spot).format('Z'))  
  // var nynf = parseInt(moment().tz("America/New_York").format("X"))
  // var nyf = moment().tz("America/New_York").format('LLLL')
  // var nyz = parseInt(moment().tz("America/New_York").format('Z'))
  var pkt = {
  	unix: nynf,
  	LLLL: nyf,
  	zone: nyz,
  };	
	console.log(JSON.stringify(pkt))
	var topi = devid+'/devtime'
	var oPacket = {
		topic: topi,
		payload: JSON.stringify(pkt),
		retain: false,
		qos: 0
  };
  console.log(topi) 
  mosca.publish(oPacket, cb);
  var sched3 = "{\"crement\":5,\"serels\":[0,99,1,2],\"progs\":[[[0,0,80,77],[6,12,82,75],[8,20,85,75],[22,0,78,74],[23,30,85,75]],[[0,0,58],[18,0,68],[21,30,58]],[[0,0,0],[5,30,1],[6,10,0]]]}";
  setTimeout(function(){
  	sendSchedule(devid, mosca, sched3, cb)
  }, 1000)
}

var sendSchedule= function(devid, mosca, payload, cb){
	var topi = devid+'/progs'
	var oPacket = {
		topic: topi,
		payload: payload,
		retain: false,
		qos: 0
  };
  console.log(topi) 
  mosca.publish(oPacket, cb);		
}

module.exports ={
	flattenProgObj: flattenProgObj,
	parseProg: parseProg,
	getTime: getTime,
	sendSchedule: sendSchedule
}