var Radium = require('radium');
var React = require('react');

@Radium
class Butt extends React.Component{
	constructor(){
		super();
		this.state = {txt:{}, but:{color:'orange'}, abut:{color:'yellow'}, bs:{boxShadow:''}};
		this.handleTouchStartA = this.handleTouchStartA.bind(this);
		this.handleTouchEndA = this.handleTouchEndA.bind(this);
		this.handleTimerButClick = this.handleTimerButClick.bind(this);
		this.extendProps = this.extendProps.bind(this);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.animal = 'dog';
		this.pr = {but:{}};
	};
	componentDidMount() {
		this.extendProps();

	};
	handleTouchStartA() {
		this.setState({txt: {color:'red'}, abut: {position: 'relative', bottom: 6, left: '3%' }})

	};
	handleTouchEndA() {
		var oldcol= this.props.imfo.txt.color
		this.setState({txt: {color: oldcol}, abut: {position: 'relative', bottom: 0, left: '0%' }})

	};
	handleTimerButClick() {
		console.log('Radium handleButClicked and is '+this.props.imginfo.clickable )
		if (this.props.imginfo.clickable){
			console.log(this.props.children+':  '+this.props.imginfo.img);

			this.props.onButClick();
		}else {
		}		
	};
	extendProps(){
		var but = this.props.imfo.but;
		var height = but.height;
		var width = but.width;
		var backgroundSize = width+'px '+height+'px';
		but.backgroundSize= backgroundSize;
		this.setState({but:but})
	}
	sbBut() {
		//console.log(this.props.imginfo)
		var ima = this.props.imginfo;
		var bu = {bs: '', as:{}};
		if (ima.clickable){
			bu.bs='inset 0px 1px 0px #3e9cbf, 0px 5px 0px 0px #205c73, 0px 10px 5px #999';
			bu.as = {position: 'relative', top: -6, right: 6 };
		} else {
			bu.bs= 'inset 0px 0px 0px green, 0px 0px 0px 0px yellow, 0px 0px 0px blue';
			bu.as =  {position: 'relative', top: 0, right: '0%' };
		}
		return {
			def: {
				but: {
					cursor: 'pointer',
					float: 'right',
					borderRadius: '10',
					height: 60,
					width: 60,
					backgroundColor: 'white',
					backgroundImage: 'url('+ima.img+')',
					backgroundSize: '60px 60px', 
					backgroundRepeat: 'no-repeat',
					boxShadow: bu.bs,
					':active': bu.as
				},
			 	txt: {
			 	  color: 'black',
				  position: 'relative',
				  left: '38%',
				  top: '32%'
			 	}
			 }
		}

	};
	render() {
		return (

			<div>
			<a ontouchstart="" onClick={this.handleTimerButClick} onTouchStart={this.handleTouchStartA} onTouchEnd={this.handleTouchEndA}>
		      	<div key="but" style={[
		      		this.sbBut().def.but,
		      		this.state.abut,
		      		this.state.but
		      		]} >
		      		<div key="txt" style={[
		      			this.sbBut().def.txt,
		      			this.props.imfo.txt,
		      			this.state.txt
		      			]}>
		      			{this.props.children}</div> 
			    </div>
			</a>

			</div>
		);
	}
};


module.exports = Butt;