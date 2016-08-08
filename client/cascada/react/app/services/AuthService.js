var url ='http://sitebuilt.net:3002'

class AuthService {
  constructor(){
    this.getData()
    console.log(this.getData())
  }

  signup(username, email) {
    this.setUser(username)
  	$.ajax({
  		url: url+'/api/ismatch/?name='+username+'&email='+email,
  		success: function(data){
  			console.log(data)
  		}.bind(this)
  	})
    return {
      url: 'SIGNUP_URL',
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      udata: {
        username: username, 
        email: email
      }
    };
  }	

  fetchToken(user,apikey, callback){
    var appdata ={apikey: apikey}
    $.ajax({
      url: url+'/api/authenticate/'+user, 
      type: 'POST',
      data: appdata,
      success: function(data, status, response){
        callback(response, user);
      },
      error: function (response){
        callback(response, user);
      }
      .bind(this)
    })
  }


  getData(){
    if (localStorage.casc){
      var ls = JSON.parse(localStorage.casc)
      var token = ls.token||''   
      var user = ls.user||''
      return {user:user, token:token} 
    } else {
      return {user:'', token:''}
    }
  }

  setData(d){
    localStorage.setItem('casc', JSON.stringify(d))
  }

  setUser(uname){
    var d= this.getData()
    d.user = uname;
    this.setData(d);  
  }

  setToken(tok){
    var d= this.getData()
    d.token = tok;
    this.setData(d);  
  }

  getToken(){
    var d= this.getData()
    return d.token
  }

  getUser(){
    return this.getData().user
  }

  esbuenToken(ydcb){
    var tok =  this.getToken() 
    var user = this.getUser()
    var retval;  
    if(tok){
      $.ajax({
        url: url+'/api/account',
        headers: {"Authorization": "Bearer "+ tok},
        success: function(data, status, response){
          if (data.name ==user){
            ydcb(true);
          } 
        },
        error: function (response){
          ydcb(false);
        }
        .bind(this)
      })
    } else {
      ydcb(false)
    }
  }
}

function callback(f){
  console.log(f)
}

export default new AuthService()