const React = require('react');
const { connect } = require('react-redux');
import { increase, decrease} from '../actions';
import { Maps } from './Maps'
import {Unverified} from './Unverified'


function Home({ number, increase, decrease, browser, deviceTypes }) {
  console.log(deviceTypes)
  console.log(browser)
  let devNum =deviceTypes.indexOf(browser)
  var more
  console.log(window.innerWidth)
  if (devNum==2) {
    console.log('bigger than 600')
    more = <div style={{flexGrow:1}}> <Unverified/> </div>
  }else{
    console.log('smaller than 600')
    more = <br/>
  }    
  return (
    <div style={{display:'flex', flexDirection:'row'}}>
      <div style={{flexGrow:1}}>
        <div style={styles.outer} >
          Some state change migh t occur widely:
          <div style={styles.inner}>
            <div>
            <p> {number} </p>
            <p> {window.innerWidth} </p>
            <p> {window.innerHeight} </p>
            </div>
            <div>
            <button onClick={() => increase(1)}>Increase</button> 
            <button onClick={() => decrease(1)}>Decrease</button>
            </div>
          </div>
        </div>
      </div>  
      {more}
    </div>
  );
};

const styles= {
  outer: {
    display: 'flex',
    flexDirection: 'column',
    background:'#C4A265',
    height: 600,
    textAlign: 'center'    
  },
  inner: {
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    background: '#FFF28E',
    height: 340,
    color: 'red',
    textAlign: 'center',
    fontSize: '300%'
  }
}

Home = connect(
  state => ({
    number: state.data.count.number, 
    browser: state.device.browser, 
    deviceTypes: state.device.types
  }),
  { increase, decrease }
)(Home);

export {Home};
