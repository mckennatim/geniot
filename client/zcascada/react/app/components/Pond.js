var React = require('react');
var Butt = require('../components/Butt');

var Pond = new React.createClass({
	imfo: {
		but:{height:110, width:110, float:'left', marginLeft: 40, marginBottom: 20}, 
		txt:{left:'3%', top:'3%', color: 'white', fontSize: '1.2em', margin: 6, textShadow: '2px 2px blue'}
	},	
	turnwhat: function(){
		var auth = this.props.auth;
		var state = this.props.spot.state;
		//console.log('state is :'+state)
		if (state=='off'){
			if(auth){
				var message = 'turn ON for: '+ this.state.value + ' min';
				//return{message: message, img: "img/Waterfall_off.gif"}
				this.pime = {message: message, img: "img/waterfall_off.gif", imginfo: {img:'img/waterfall_off.gif', clickable:true}}
				return this.pime
			} else{
				var message = 'registed users can control water';
				//return{message: message, img: "img/Waterfall_off.gif"}
				this.pime = {message: message, img: "img/waterfall_off.gif", imginfo: {img:'img/waterfall_off.gif', clickable:false}}
				return this.pime				
			}
		} else if (state=='timer'|state=='on'){
			if(auth){
				var message = this.props.spot.tleft + ' to go click Off'
				//return{message: message, img: "img/Waterfall_on.gif"}
				this.pime = {message: message, img: "img/waterfall_on.gif",imginfo: {img:'img/waterfall_on.gif', clickable:true}}
				return this.pime;				
			} else{
				var message = this.props.spot.tleft + ' to go'
				//return{message: message, img: "img/Waterfall_on.gif"}
				this.pime = {message: message, img: "img/waterfall_on.gif",imginfo: {img:'img/waterfall_on.gif', clickable:false}}
				return this.pime;
			}

		} else if (state=='waiting'){
			this.pime = {message: 'waiting', img: "img/waiting.gif", imginfo: {img:'img/waiting.gif', clickable:false}}
			return this.pime;

		}

	},
	getInitialState: function() {
		return {value: 10, pime: {message: 'cat', img:"img/waiting.gif"}};
	},
	componentDidMount: function() {
		console.log(this.props.spot.spot)
		return {value: this.props.spot.tleft};
	},
	handleChange: function(event) {
		this.setState({value: event.target.value});
		//console.log(this.state.value)
	},
	handleClick: function(){
		var state = this.props.spot.state;
		if(state=='off'){
			//console.log('turning on');
			console.log(this.props.spot.spot)
			this.props.onUserInput({spot: 'pond', til: this.state.value, state: 'timer'});
		} else {
			//console.log('turning off');
			this.props.onUserInput({spot: 'pond', til: -1, state: 'off'});
		}
	},
	render: function() {

		return (
			<div> 
				<h4 style={{color: "yellow"}}>pond</h4>
				<Butt imginfo={this.turnwhat().imginfo} imfo={this.imfo} onButClick={this.handleClick} > {this.turnwhat().message} </Butt>
				<br/>
				<input  type="range" min="1" max="120" step="1" value={this.state.value} onChange={this.handleChange}></input><br/>
			</div>
		);
	}

});

module.exports = Pond;