var React = require('react');
var Navigation = require('react-router').Navigation;
var Spots = require('../components/Spots');
var mqtt = require('mqtt')
import Auth from '../services/AuthService';

var url = '73.249.62.27';
//var url = '10.0.1.155';
var port = '8088'

var socket, sse;
const deviceId ='CYURD002'
const statu = deviceId+'/status'
const tmr = deviceId+'/tmr'
const progs = deviceId+'/progs'
const cmd = deviceId +'/cmd'
const devt = deviceId +'/time'
const devtim = deviceId +'/devtime'
const sched = deviceId +'/sched'

var Yard = React.createClass({
	mixins: [Navigation],
	getInitialState: function() {
		return {spots: {"pond": {"spot": "pond", "tleft": -99, "state": "off"}, "center": {"spot": "center", "tleft": -99, "state": "off"}, "bridge": {"spot": "bridge", "tleft": -99, "state": "off"}}, authorized:false};

	},
	handleUserInput: function(timerSet){
		console.log('handling user input ' )
		if (this.state.authorized){
			console.log(timerSet)
			this.turnonoff(timerSet.til);
			//if timerSet.
			// var geturl = 'http://'+url+':'+port+'/ctrlWater/'
			// $.get( geturl, timerSet, function(data){
			// 	console.log(data.status)
			// 	this.setState({spots: data.status})
			// }.bind(this));			
		} else {
			console.log('yo not authorized')
		}
	},	

	turnonoff: function(til){
		console.log(til)
		var oo;
		var progs = new Array();
		progs[0] = new Array()
		if (til==-1){
			oo=0;
			progs[0][0] = [0,0, oo]
			progs[0][1] = [23,59, oo]
		}else{
			var da = new Date()
			console.log(da)
			var sh =da.getHours()
			var sm =da.getMinutes()
			oo=1
			var m0 = til*1+sm*1
			console.log(m0)
			var m = m0%60;
			console.log(m);
			var mm = (90+16)%60;
			console.log(mm)
			console.log('(til%s + sm%s -m%s)/60 = %s', til,sm,m,(til+sm-m)/60)
			var h = (m0 -m)/60+sh
			console.log('%s:%s', sh,sm)
			console.log('%s:%s', h,m)
			progs[0][0] = [sh, sm, oo]
			progs[0][1] = [h, m, oo]
		}
		var wht = 4;
		var crement = 5;
		var serels = [99,99,99,99,99];
		serels[wht]=0
		var sserels = JSON.stringify(serels) 
		
		var sprogs =JSON.stringify(progs)
		var thecmd =  "{\"crement\":"+crement+",\"serels\":"+sserels+",\"progs\":"+sprogs+"}";
		console.log(thecmd)
		this.client.publish(sched, thecmd)
	},	

	componentDidMount: function() {
		console.log('yard mounted')
		Auth.esbuenToken(this.tokenCallback);
		var that = this;
		this.client = mqtt.connect('ws://162.217.250.109:3333');
		
		this.client.on('connect', function(){
			console.log('maybe connected')
			this.client.subscribe(devtim)
			this.client.subscribe(statu) 
			this.client.subscribe(tmr) 
			this.client.subscribe(progs)
			this.client.on('message', function(topic, payload) {
				var pls = payload.toString()
				var plo = JSON.parse(pls)
				//console.log(plo)
				//console.log('['+topic+'] '+payload.toString())
		    var sp = topic.split("/")
		    var job = sp[1];	
		    var newstate = Object.assign({}, this.state)
		    switch(job){
		    	case "status":
						switch(plo.id){
							case 2:
								console.log('state of relay3: ' + plo.darr[0]);
								if(plo.darr[0]==1){
									if (newstate.spots.center.tleft >0){
										newstate.spots.center.state = "timer";
									}else{
										newstate.spots.center.state = "on";
									}
								}else{
									newstate.spots.center.state = "off";
								}
								break;
							case 3:
								if(plo.darr[0]==1){
									if (newstate.spots.bridge.tleft >0){
										newstate.spots.bridge.state = "timer";
									}else{
										newstate.spots.bridge.state = "on";
									}
								}else{
									newstate.spots.bridge.state = "off";
								}
								console.log('state of relay4: ' + plo.darr[0]);
								break;
						}						
						break;
					case "tmr":
						// console.log(plo)
						//var newstate = Object.assign({}, {"spots": {"pond": {"spot": "pond", "tleft": -99, "state": "on"}, "center": {"spot": "center", "tleft": -99, "state": "waiting"}, "bridge": {"spot": "bridge", "tleft": -99, "state": "waiting"}}, "authorized":true} )
						
						var tleft3 = plo.timr3
						if(tleft3>0){
							newstate.spots.pond.tleft = tleft3/60;
							newstate.spots.pond.state = "timer"
						}else{
							newstate.spots.pond.tleft = -1;
							newstate.spots.pond.state = "off"
						}
						var tleft2 = plo.timr2
						if(tleft2>0){
							newstate.spots.bridge.tleft = tleft2/60;
							newstate.spots.bridge.state = "timer"
						}else{
							newstate.spots.bridge.tleft = -1;
							newstate.spots.bridge.state = "off"
						}
						var tleft1 = plo.timr1
						if(tleft1>0){
							newstate.spots.center.tleft = tleft1/60;
							newstate.spots.center.state = "timer"
						}else{
							newstate.spots.center.tleft = -1;
							newstate.spots.center.state = "off"
						}
						//console.log(newstate)
						break;
		    };			
				this.setState({spots: newstate.spots})
				//console.log(this.state)
			}.bind(this));	
			this.client.publish('presence', 'Web Client is alive.. Test Ping! ');
			this.client.publish(cmd, `{\"id\":7,\"data\":1}`)
		}.bind(this));		
	},

	tokenCallback: function(tf){
		this.setState({authorized: tf})
		console.log(tf)
	},

	componentWillUnmount: function(){
		console.log('yard unmountd')
		this.client.publish('presence', 'Help, wants to close! ');
		this.client.end();
	},
	
	render: function(){
		return (
			<div> 
				<Spots spots={this.state.spots} relayUserInput={this.handleUserInput} auth={this.state.authorized}/>
			</div>
			)
	}
})

module.exports = Yard;