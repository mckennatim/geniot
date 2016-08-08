//const React = require('react');
import React, {PropTypes, Component} from 'react';
import Radium from '../styles/radium.min.js';
// import Radium from 'radium';
import {connect} from 'react-redux';
import {Gmaps, Marker} from 'react-gmaps';
import {uvStyles} from '../styles'
const { pushPath } = require('redux-simple-router');
import {setUnverSel} from '../actions' 



class Maps extends React.Component{
  constructor(props) {
    super(props)
  }
  approved (){
    const {unver_sel, pushPath, cngUnverSel} =this.props
    const newun = Object.assign({}, unver_sel,
      {isThePlace: true})
    cngUnverSel(newun)
    pushPath('/reg')
  }

  onDragEnd(e){
    console.log('onDragEnd', e.latLng.lat())
  }

  render() {
    const {unver_sel, pushPath} = this.props
    return (
      <div style={styles.outer}>
        <div style={styles.heading}>
          <h4>{unver_sel.address}</h4>
          <div>
            <button onClick={()=>pushPath('/reg')} >try another</button>
            <button onClick={()=>this.approved()}>that's the place</button>
          </div>           
        </div>
        <div style={styles.inner}>
         
          <Gmaps
            width={'300px'}
            height={'400px'}
            lat={unver_sel.lat}
            lng={unver_sel.lng}
            zoom={14}
            loadingMessage={'Be happy'}
            params={{v: '3.exp'}}
            >
          <Marker
            lat={unver_sel.lat}
            lng={unver_sel.lng}
            draggable={true}
            onDragEnd={this.onDragEnd} />            
          </Gmaps>
        </div>
      </div>
      );
  }
}

const styles = {
  outer: {
    display:'flex',
    flexDirection: 'column',
    background: '#E1E1E1',
    height: 600
  },
  heading:{
    margin: 'auto'
  },
  inner: {
    margin: 'auto'
  }
}

const mapStateToProps = (state) => {
  return {
    unver_sel: state.data.verify.unver_sel
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    pushPath: (path) => {
      dispatch(pushPath(path))
    },  
    cngUnverSel: (unver_sel) => {
      dispatch(setUnverSel(unver_sel))
    },        
    dispatch
  };
};


Maps = connect(mapStateToProps,mapDispatchToProps)(Maps)
export {Maps}
