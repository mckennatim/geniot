//import React from 'react/addons';
import React from 'react';
import Auth from '../services/AuthService'
//import Router from 'react-router'

class Signup extends React.Component {

  constructor() {
    super()
    this.state = {
      user: '',
      email: '',
      auth: false,
      message: 'we will send you an apikey, then login with it'
    };
    this.handleChange = this.handleChange.bind(this)
    this.signup=this.signup.bind(this)
    this.componentDidMount=this.componentDidMount.bind(this)
  }

  componentDidMount() {
    Auth.esbuenToken(function(tf){
      console.log(tf)
      if (tf){
        this.setState({auth: tf, message:'you are all signed up...moving to app'})
        setTimeout(function(){ 
          this.context.router.transitionTo('yard') 
        }.bind(this), 2000);
      }
    }.bind(this))    
  }

  signup(e) {
    e.preventDefault();
    var udata = Auth.signup(this.state.user, this.state.email);
    console.log(udata)
    console.log(Auth.getData())
    this.context.router.transitionTo('login')
  }

  handleChange(e){
    e.preventDefault();
    var obj = {}
    obj[e.target.name] = e.target.value;
    console.log(obj)
    this.setState(obj);
  }  

  render() {
    return (
      <div className="login jumbotron center-block">
        <h2>Signup</h2>
        <h4>{this.state.message} </h4>
        <form role="form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" id="username" name="user" placeholder="Username" onBlur={this.handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" name="email" ref="email" placeholder="Email" onBlur={this.handleChange} />
        </div>
        <button type="submit" className="btn btn-default" onClick={this.signup.bind(this)}>Submit</button>
      </form>
    </div>
    );
  }
}


Signup.contextTypes = {
  router: React.PropTypes.func.isRequired
};

module.exports = Signup;