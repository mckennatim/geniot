import "babel-polyfill";
const React = require('react');
const { Link } = require('react-router');
const { connect } = require('react-redux');
const { pushPath } = require('react-router-redux');
import {setDeviceType} from '../actions'


function App({ pushPath, children, deviceTypeChanged, deviceTypes, deviceSizes}) {
  var rtime;
  var timeout = false;
  var delta = 200;
  const doneResizing = () => {
    let ws = window.innerWidth
    const devs = deviceTypes
    var wsizes = deviceSizes
    var thei
    var sum = wsizes.reduce((t, n, i)=>{ 
      if(t<ws&&ws<=n){
        thei = i
      }
        return n 
      }, 0);
    const brow ={browser: devs[thei], size:ws}
    console.log(brow) 
    deviceTypeChanged(brow)   
  }
  const resizeEnd = ()=>{
    if (new Date() - rtime < delta) {
        setTimeout(resizeEnd, delta);
    } else {
        timeout = false;
        doneResizing();
    }    
  }
  const handleResize = () =>{
    rtime = new Date();
    if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, delta);
    }  
  }

  window.addEventListener('resize', handleResize);

  return (
    <div>
      <header>
        Links:
        {' '}
        <Link to="/">Home</Link>
        {' '}
        <Link to="/ver">Verified</Link>
        {' '}
        <Link to="/reg">Register</Link>
        {' '}
        <Link to="/wea">Wea</Link>
        {' '}
        <Link to="/maps">Maps</Link>
        {' '}
        <Link to="/unver">Unverified</Link>
      </header>
      <div>
        <button onClick={() => pushPath('/ver')}>Go to /ver</button>
      </div>
      <div style={{marginTop: '1.5em'}}>{children}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    deviceTypes: state.device.types,
    deviceSizes: state.device.sizes
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deviceTypeChanged: (typeInfo) => {
      dispatch(setDeviceType(typeInfo))
    },
    pushPath: (path) => {
      dispatch(pushPath(path))
    }
  };
};

//App = connect(null, { pushPath })(App);
App = connect(mapStateToProps,mapDispatchToProps)(App);

export {App};
