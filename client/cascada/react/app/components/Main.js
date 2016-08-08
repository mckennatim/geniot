var React = require('react');
import { RouteHandler, Link } from 'react-router';
var imgurl = 'img/bkg-water.png'
var mStyle = {
	li: {
		display: 'inline',
		padding: '10px'
	},
	ul: {
	},
  span:{
    color: 'yellow'
  },
  div: {
    height: '900',
    background: 'green',
    backgroundImage: 'url('+imgurl+')'
  }
};


var Main = React.createClass({
  render: function(){
    return (
      <div style={mStyle.div}>
        <ul>
        <li style={mStyle.li}><Link to="/yard"><span style={mStyle.span}> yard </span></Link></li>
        <li style={mStyle.li}><Link to="/login"><span style={mStyle.span}> login </span></Link></li>
        <li style={mStyle.li}><Link to="/signup"><span style={mStyle.span}> signup </span></Link></li>
        </ul>
        <div className="container">
          <RouteHandler />
        </div>
      </div>
    )
  }
});

module.exports = Main;