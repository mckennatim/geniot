import React from 'react';
import {connect} from 'react-redux';
import {Gmaps, Marker} from 'react-gmaps';
const { pushPath } = require('redux-simple-router');
import {fetchVerified} from '../actions' 



class DeviceInfo extends React.Component{
	constructor(props) {
		super(props)
		const{verified}=this.props 
		this.dev_info =verified[this.props.params.id]	
	}
	render(){
		console.log(this.dev_info)
		if(!this.dev_info){
			return (
				<div>
					<h4>no data</h4>
					<h5> <a href="./#/ver"> fetch verified devices</a></h5>
					<h5><a href="./">home</a></h5>
				</div>
			)
		} else {
			return(
				<div>
					<h1>Device Info</h1>
					{this.dev_info.address}
					<h4>address:</h4>
					<h3>{this.dev_info.address}</h3><br/>
					<h4>id: {this.dev_info.id}</h4>
					<h4>id: {this.props.params.id},  devid: {this.dev_info.devid}</h4>
					<h4>lat: {this.dev_info.lat}, lng: {this.dev_info.lng}</h4>
	      <Gmaps
	        width={'300px'}
	        height={'400px'}
	        lat={this.dev_info.lat}
	        lng={this.dev_info.lng}
	        zoom={14}
	        loadingMessage={'Be happy'}
	        params={{v: '3.exp'}}
	        >
	      <Marker
	        lat={this.dev_info.lat}
	        lng={this.dev_info.lng}/>
	      </Gmaps>	
				</div>
			)			
		}
	}
}

const mapStateToProps = (state) => {
  return {
    verified: state.data.verify.verified
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    pushPath: (path) => {
      dispatch(pushPath(path))
    },   	
  	dispatch
  };
};

DeviceInfo = connect(mapStateToProps,mapDispatchToProps)(DeviceInfo)
export {DeviceInfo};
