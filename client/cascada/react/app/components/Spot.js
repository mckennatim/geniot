var React = require('react');
var Butt = require('../components/Butt');
var RadioGroup = require('react-radio-group');


var Spot = new React.createClass({
	waitSlide: false,
	tval: -1,
	imfo: {
		but:{height:60, width:60}, 
		txt:{left:'34%', top:'28%', color: 'green', fontWeight: 'bold', fontSize: '1.2em', fontFamily: '"Comic Sans MS", cursive, sans-serif'}
	},
	getInitialState: function() {
		//return {value: 10, selectedValue: 'timed', img: 'img/loading60.gif', tval:6};
		return {value: 10};
	},
	componentDidMount: function() {
		//console.log(this.props.spot.tleft);
		return {value: this.props.spot.tleft};
	},
	handleRangeChange: function(event) {
		this.waitSlide = true;
		this.setState({value: event.target.value});
		this.tval= event.target.value;
	},
	handleRadio: function(value){
		//console.log(value)
		if (this.props.auth){
			if (value=='on'){
				this.props.onUserInput({spot: this.props.spot.spot, til: -1, state: 'on'});
				this.waitSlide=false;
			} else if(value=='off'){
				this.props.onUserInput({spot: this.props.spot.spot, til: -1, state: 'off'});	
				this.waitSlide=false;	
			} else {
				this.rbut='timed';
				this.waitSlide='true'
				console.log(this.props.spot.tleft)
				this.props.onUserInput({spot: this.props.spot.spot, til: 1, state: 'timer'});
				console.log('dealin  w timed')
				//this.ima = {img:'img/loadno60.gif', clickable:true};
				this.ima.img = 'img/loadno60.gif';
				this.ima.clickable = true;			
			}
			this.setState({
		      selectedValue: value//, img: ima
		    });			
		}
	},
	radioLand: function(){ //fires whenever state changes
		var state = this.props.spot.state;
		var til = this.props.spot.tleft;
		if (this.waitSlide){
		} else if (state=='on'){
			this.rbut='on'
			this.tval='';
			this.ima= {img:'img/on100.gif', clickable:false}
		} else if (state=='off'){
			this.rbut='off';
			this.tval='';
			this.ima= {img:'img/off100.gif', clickable:false}
		} else if (state=='timer'){
			this.rbut='timed';
			this.tval = til;
			this.ima= {img:'img/loading60.gif', clickable:true}
		} else if (state=='waiting'){
			//console.log('radioland is waiting')
			this.tval='';
			this.ima = {img:'img/waiting.gif', clickable:false};
		}
		this.waitSlde = false;
		return{
			ima: this.ima, rbut:this.rbut
		}
	},

	handleTimerButClick: function(){
		console.log('handle TimerBut clicked');
		this.waitSlide=false;
		var til = this.props.spot.tleft;
		if (this.radioLand().rbut=='timed'){
			console.log('image is dog timer'+ this.state.value+' tleft='+til)
			this.props.onUserInput({spot: this.props.spot.spot, til: Number(this.state.value), state: 'timer'});
		}		
	},
	render: function() {

		return (
			<div> 
				<h4 style={{color: "yellow"}}>{this.props.spot.spot}</h4>
				<div className="radio-group">
			        <RadioGroup
			        	ref="rg"
			          	name={this.props.spot.spot}
			          	selectedValue={this.radioLand().rbut}
			          	onChange={this.handleRadio}>
						{Radio => (
						<div>
						  <label><Radio value="on" />On</label>
						  <label><Radio value="timed" />Timed</label>
						  <label><Radio value="off" />Off</label>
						</div>
						)}
			        </RadioGroup>
		        </div>
		        <Butt imginfo={this.radioLand().ima} imfo={this.imfo} onButClick={this.handleTimerButClick}>{this.tval}</Butt>
				<br/>
				<div>
					<br/><br/><br/>
					<input  type="range" min="1" max="120" step="1" value={this.state.value} onChange={this.handleRangeChange}></input>
				</div>
				<br/>
			</div>
		);
	}
})

module.exports = Spot;