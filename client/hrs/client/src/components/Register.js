import React from 'react';
import Radium from '../styles/radium.min.js';
import color from 'color';
var Keypress = require("react-keypress");
import {connect} from 'react-redux';
import {fetchUnverified, setUnverSel, fetchAddr, selAddr, recAddr, postUnverified, setDone} from '../actions' 
import {uvStyles} from '../styles'
const { pushPath } = require('redux-simple-router');

@Radium
class Register extends React.Component{
	constructor(props) {
		super(props)
		this.rawChanged = this.rawChanged.bind(this)
		this.unver = {}
		this.devchars =''
		this.isDev = false
	}
	componentDidMount() {
		const {unver_sel, setDone} = this.props
		setDone(false);
		this.devchars=unver_sel.devid
		this.ckDevid(this.devchars)
		this.unver = document.getElementById("unver")
		this.device = document.getElementById("device")
		var that = this
		this.unver.addEventListener("keydown", function(event){
			that.rawChanged(event)			
		})
		this.device.addEventListener("keydown", function(event){
			that.devChanged(event)			
		})
	}
	componentWillUnmount() {
		console.log(this.unver)
		this.unver.removeEventListener("keydown",function(){})
		this.device.removeEventListener("keydown",function(){})
	}	
	hideDroidKbd(element){
		element.setAttribute("readonly", "readonly")
		element.setAttribute("disabled", "true")
		setTimeout(function(){
			element.removeAttribute("readonly")
			element.removeAttribute("disabled")				
		},100)
	}

	rawChanged(event){
		const {unver_sel, onRawInput}=this.props
		if(event.keyCode==13){
			onRawInput(unver_sel.raw)
			this.hideDroidKbd(this.unver)
			console.log(unver_sel)
		}
	}
	ckDevid (devchars){
		const {unver_sel, cngUnverSel}=this.props
		//a fake check, really would check device database
		if (this.devchars && this.devchars.length>6){
			console.log('devchars is longer than 6')
			const newusel = Object.assign({}, unver_sel, {
				isTheDev : true,
				devid: this.devchars					
			})
			console.log(newusel)
			cngUnverSel(newusel)
		}else{	
			const newusel = Object.assign({}, unver_sel, {
				isTheDev : false,
				devid: this.devchars				
			})
			console.log(newusel)
			cngUnverSel(newusel)						
		}	
	}
	devChanged(event){
		const {unver_sel, cngUnverSel}=this.props
		console.log(this.devchars)
		if(event.keyCode==13){
			console.log('hit enter')
			console.log(this.devchars)
			this.ckDevid(this.devchars)
			this.hideDroidKbd(this.device)
		}
	}

	onDevChange(inp){
		this.devchars= inp
	}
	onRawChange(value){
		const {unver_sel, cngUnverSel}=this.props
		const newobj = {id:unver_sel.id, raw:value}
		cngUnverSel(newobj)		
	}
	makeNew() {
		const {cngUnverSel, clearCandidates}=this.props
		const newun = {
			id:999999,  
	    raw:'',
	    devid: 'CYURD'
		}
		console.log('in maken new')
		let cand = [];
		cand.push({formatted_address: 'possible locations will list here'})
		cngUnverSel(newun)	
		clearCandidates(cand)
	}
	selAddr(i) {
		const {candidates, cngUnverSel, pushPath, unver_sel} = this.props
		//console.log(candidates[i].formatted_address)
		let coords = candidates[i].geometry.location
		//console.log(coords)
		candidates[i].current = true
		let unveradd = {}
		unveradd.address=candidates[i].formatted_address
		unveradd.lat=coords.lat
		unveradd.lng=coords.lng
		unveradd.id = unver_sel.id
		unveradd.devid = unver_sel.devid
		unveradd.raw = unver_sel.raw
		unveradd.idx=i
		cngUnverSel(unveradd)
		pushPath('/maps')
	}
	showAddr (i){
		const {unver_sel} =this.props
		if(unver_sel.idx==i){
			return [
				{
	      	backgroundColor: 'aquamarine'	
      	},
      	uvStyles.li		
			]
		}else{
			return [
				uvStyles.li
			]
		}
	}	
	isBothDone(){
		const{unver_sel}=this.props
		if (unver_sel.isTheDev && unver_sel.isThePlace){
			return true
		}else{
			return false
		}
	}
	regState(){
		const {isFetching, done} = this.props
		if (isFetching){
			return (<span>X</span>)
		}else if(done){
			//setDone(false)
			//this.goSoonTo('./unver', 300)
			return (<span style={[uvStyles.ck]} >&#10004;</span>)
		}
		return
	}	

	goSoonTo(path, when){
		const{pushPath, setDone}=this.props
		setTimeout(function(){
			setDone(false)
			pushPath(path)
		},when)		
	}

	save(){
		const{unver_sel, save2db} = this.props
		save2db(unver_sel)
		this.goSoonTo('/unver', 700)
	}

	render(){
		const {unver_sel, candidates}=this.props
		let input, dev
		return(
			<div>
				<h3>Register 
					<button style={[uvStyles.ck]}
						onClick={()=>this.makeNew()}
						>new
					</button>
					<button style={[ 
							uvStyles.ck]}>del</button>
					<button style={[
							{display:this.isBothDone()?'inline':'none'}, 
							uvStyles.ck
						]}
						onClick={()=>this.save()}
						>save
					</button>
					<span>
					{this.regState()}</span>
				</h3>
				<h4>Device: {unver_sel.devid}
					<span style={[
							{display:unver_sel.isTheDev?'inline':'none'}, 
							uvStyles.ck
						]}>&#10004;</span> </h4>
				<input id="device" type="text" ref={node => {dev = node;}} 
					defaultValue={unver_sel.devid}
					onChange={()=>this.onDevChange(dev.value)}
					style={uvStyles.inp}/><br/>
				<h4>Location: 
					<span style={[
							{display:unver_sel.isThePlace?'inline':'none'}, 
							uvStyles.ck
						]}>&#10004;</span> 
				</h4>
				<h5>search</h5>	
					<input id="unver" type="text" ref={node => {input = node;}} 
					value={unver_sel.raw}
					placeholder="search for a place"
					onChange={()=>this.onRawChange(input.value)}
					style={uvStyles.inp}/><br/>
					<div>
						<h5>search results</h5>	
						<ul style={uvStyles.ul}>
						{candidates.map((c, i) => {
							return (
								<li  style={this.showAddr(i)}  key={i} onClick={()=> this.selAddr(i)}>
									<span> {c.formatted_address}<br/>
								 	</span> 
							 	</li>
							)
						})}
						</ul>			
					</div>					
			</div>
		)
	}
}

const mapStateToProps = (state) => {
  return {
  	isFetching: state.data.verify.isFetching,
  	done: state.data.verify.done,
    unver_sel: state.data.verify.unver_sel,
    selected: state.data.verify.selected,
    candidates: state.data.verify.results
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  	cngUnverSel: (unver_sel) => {
  		dispatch(setUnverSel(unver_sel))
  	},  
  	onRawInput: (raw) => {
  		dispatch(fetchAddr(raw))
  	},  		
  	updSelected: (selected) => {
  		dispatch(selAddr(selected))
  	}, 
  	clearCandidates: (blank) => {
  		dispatch(recAddr(blank))
  	}, 
    pushPath: (path) => {
      dispatch(pushPath(path))
    },  	  	 		
    save2db: (unver_sel) => {
      dispatch(postUnverified(unver_sel))
    },     
    setDone: (tf) => {
      dispatch(setDone(tf))
    },  	  	 		
  	dispatch
  };
};


Register = connect(mapStateToProps,mapDispatchToProps)(Register)
export {Register}