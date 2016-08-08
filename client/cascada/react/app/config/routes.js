var React = require('react');
var Main = require('../components/Main');
var Yard = require('../components/Yard');
var Reg = require('../components/Reg');
var Login = require('../components/Login');
var Signup = require('../components/Signup');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;

module.exports = (
  <Route name="app" path="/" handler={Main}>
  	<Route name="yard" path="/yard" handler={Yard}></Route>
  	<Route name="reg" path="/reg" handler={Reg}></Route>
  	<Route name="login" path="/login" handler={Login}></Route>
  	<Route name="signup" path="/signup" handler={Signup}></Route>
  	<DefaultRoute handler={Yard} />
  </Route>
);