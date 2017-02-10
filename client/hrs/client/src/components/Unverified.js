import React from 'react';
import Radium from '../styles/radium.min.js';

// import Radium from 'radium';
import color from 'color';
import {connect} from 'react-redux';
const { push } = require('redux-simple-router');
import {fetchUnverified, setUnverSel, fetchAddr} from '../actions' 
import {uvStyles} from '../styles'
const { Link } = require('react-router');

@Radium
class Unverified extends React.Component{
	componentDidMount() {
		const {dispatch} = this.props
    dispatch(fetchUnverified())		
	}
	onClickUnverSel (unver_sel) {
		const {onUnverSel, push, dispatch} = this.props
		onUnverSel(unver_sel)
		dispatch(fetchAddr(unver_sel.raw))
		push('/reg')

	}	
	render() {
		const {unverified, onGetUnver, push} = this.props
		return (
			<div style={uvStyles.di}>
				<div>
					<h3>Un-verified Addresses</h3>
			 		<button button onClick={() => onGetUnver()} >
			 			Refresh
			 		</button><br/>					
				</div>
				<div>
					<ul style={uvStyles.ul}>
						{unverified.map((un)=>(
						<li style={uvStyles.li} key={un.id}
						onClick={()=>this.onClickUnverSel(un)} >
								{un.raw}
						</li>
						))}
					</ul>			
				</div>
			</div>		
		)
	}
}
const mapStateToProps = (state) => {
  return {
    unverified: state.data.verify.unverified
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
  	onGetUnver: () => {
  		dispatch(fetchUnverified())
  	}, 
  	onUnverSel: (unver_sel) => {
  		dispatch(setUnverSel(unver_sel))
  	},
    push: (path) => {
      dispatch(push(path))
    },  	
  	dispatch
  };
};

//Unverified = Radium(Unverified);
Unverified = connect(mapStateToProps,mapDispatchToProps)(Unverified)
export {Unverified};