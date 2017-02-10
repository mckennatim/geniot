import React from 'react';
import Auth from '../services/AuthService'


class Login extends React.Component {

  constructor() {
    super()
    this.state = {
      apikey: '',
      user: Auth.getUser(),
      auth: false,
      message: 'if you have signed up, your apikey will set up this device'
    };
    this.fetchToken=this.fetchToken.bind(this);
    this.fetchCallback =this.fetchCallback.bind(this);
    this.handleChange=this.handleChange.bind(this);
    this.componentDidMount=this.componentDidMount.bind(this)
  }

  componentDidMount() {
    Auth.esbuenToken(function(tf){
      console.log(tf)
      if (tf){
        this.setState({auth: tf, message:'you are all logged in...moving to app'})
        setTimeout(function(){ 
          this.context.router.transitionTo('yard') 
        }.bind(this), 2000);
      }
    }.bind(this))    
  }

  fetchToken(e) {
    e.preventDefault();
    console.log(this.state.apikey)
    Auth.fetchToken(this.state.user, this.state.apikey, this.fetchCallback)
  }

  fetchCallback(response, user){
    console.log(user)
    var msg;
    if (response.status==200){
      if (response.responseJSON.message=='token here'){
        console.log('now save that token and switch to Yard')
        Auth.setData({user:user, token: response.responseJSON.token})
        this.context.router.transitionTo('yard')
      } 
    }
    console.log(response)
  } 

  handleChange(e){
    e.preventDefault();
    var obj = {}
    obj[e.target.name] = e.target.value;
    console.log(obj)
    this.setState(obj);
  }

  doNothing(e){
    e.preventDefault();
    var obj = {}
    obj[e.target.name] = e.target.value;
    console.log(obj)
    this.setState(obj);
  }

  render() {
    return (
      <div className="login jumbotron center-block">
        <h2>Login</h2>
        <h4>{this.state.message} </h4>
        <form role="form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" value={this.state.user} id="username" name="user" placeholder="Username" onBlur={this.handleChange} onChange={this.doNothing}/>
        </div>
        <div className="form-group">
          <label htmlFor="apikey">Apikey</label>
          <input type="text" className="form-control" id="apikey" ref="apikey" name="apikey" placeholder="your apikey from email" onBlur={this.handleChange}/>
        </div>
        <button type="submit" className="btn btn-default" onClick={this.fetchToken.bind(this)}>Submit</button>
      </form>
    </div>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.func.isRequired
};

module.exports = Login;