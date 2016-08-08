import React from 'react';
import Radium from 'radium';
import color from 'color';
import {connect} from 'react-redux';
const { pushPath } = require('redux-simple-router');
import {fetchUnverified, setUnverSel, fetchAddr} from '../actions' 
import {uvStyles} from '../styles'
const { Link } = require('react-router');

@Radium
class Verified extends React.Component{
	componentDidMount() {
		const {dispatch} = this.props
    dispatch(fetchVerified())		
	}
	onClickUnverSel (unver_sel) {
		const {onUnverSel, pushPath, dispatch} = this.props
		onUnverSel(unver_sel)
		dispatch(fetchAddr(unver_sel.raw))
		pushPath('/reg')

	}	
	render() {
		const {unverified, onGetUnver, pushPath} = this.props
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
  		dispatch(fetchVerified())
  	}, 
  	onUnverSel: (unver_sel) => {
  		dispatch(setUnverSel(unver_sel))
  	},
    pushPath: (path) => {
      dispatch(pushPath(path))
    },  	
  	dispatch
  };
};

//Verified = Radium(Verified);
Verified = connect(mapStateToProps,mapDispatchToProps)(Verified)
export {Verified};