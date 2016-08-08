var React = require('react');
var Butt = require('../components/Butt');

var Reg = React.createClass({
	componentDidMount: function() {	
	},
	//imginfo: {img:'img/Waterfall_on.gif', clickable:t   rue},
	imginfo: {img:'img/waterfall_on.gif', clickable:true},
	imgemail: {img:'img/Email.gif', clickable:true},
	message: {con:'get token', discon: 'delete token', email: 'send me a request'},
	imfo: {
		but:{height:100, width:100, float:'right'}, 
		txt:{left:'3%', top:'3%', color: 'white', fontSize: '1.34em', margin: 6}
	},
	imfe: {
		but:{height:50, width:50, float:'left'}, 
		txt:{left:'3%', top:'3%', color: 'white', fontSize: '1.34em', margin: 6}
	},
	handleTimerButClick: function(){
		var appdata ={apikey: 'Ricuhiqozarulerofekuqepa'}
		var user = 'tim'
		console.log('handled in reg')
		$.post('http://sitebuilt.net:3002/api/authenticate/'+user, appdata, function(data){
			console.log(data);
			if(data.message=='token here'){
				console.log(data.message)
				localStorage.setItem('casc', JSON.stringify({user: user, token: data.token}))
				var ls = JSON.parse(localStorage.casc)
				console.log(ls.user)
			}
		}.bind(this));
	},
	deleteLS: function(){
		console.log('deleting token')
		localStorage.removeItem('casc')
	},
	emailMe: function(){

		console.log('emailing me')
		window.open('mailto:mckenna.tim@gmail.com?subject=tryit&body=hey');
	},
	render: function(){
		return (
			<div>
			<Butt imginfo={this.imginfo} imfo={this.imfo} onButClick={this.handleTimerButClick}>{this.message.con} </Butt>
			<Butt imginfo={this.imginfo} imfo={this.imfo} onButClick={this.deleteLS}>{this.message.discon} </Butt>
			<Butt imginfo={this.imgemail} imfo={this.imfe} onButClick={this.emailMe}>{this.message.email} </Butt>
			<a href="mailto:mckenna.tim@gmail.com?subject=tryit&body=hey" >mail me something</a>
			</div>
			)
	}
});

module.exports = Reg;