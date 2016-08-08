import React from 'react';
import {connect} from 'react-redux';
import {ckAddr} from '../actions'
//import {fetchWeather} from '../actions';

let Wea = ({dispatch}) => {
	let input;
	return (
		<div style={{display: 'flex'}}>
	 		<h4>Weather an address</h4>
	 		<input type="text" size="60" ref={node => {input = node;}}/><br/>
	 		<button onClick={() => {
        dispatch(ckAddr(input.value));
        input.value = '';}}>
        Find in weather
      </button>
   	</div>
	);
}



Wea = connect()(Wea)
export {Wea};

// export default function Wea() {
//   return <div>
// 		<h4>Weatherify an address</h4>
// 		<input type="text" size="60" /><br/>
// 		<button >Find in weather</button>
//   </div>;
// }
// is same as

// module.exports = function Wea() {
//   return <div>
// 		<h4>Weaify an address</h4>
// 		<input type="text" size="60"/><br/>
// 		<button >Find in weather</button>
//   </div>;
// }
