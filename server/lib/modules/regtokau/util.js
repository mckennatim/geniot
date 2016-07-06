var env = require('../../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var fs = require('fs');
var cons = require('tracer').console();


/*-----------------------------setup mailer-----------------------------------*/
var nodemailer = require('nodemailer')
var gmailCred =cfg.gmail;
var smtpTransport = nodemailer.createTransport("SMTP",gmailCred);  
//console.log(smtpTransport.options.service)

var blankUser= {name: '', email: '', lists:[], role:'', timestamp: 1, apikey: ''};

var emailKey =function(items, callback){
	fs.writeFile("./test/key", items.apikey, function(err){
	    if(err) {
	        cons.log(err);
	    } else {
	        cons.log("The file was saved!");
	    }		
	})
    console.log('in emailKey')
    //console.log(smtpTransport.options.service)
    var mailOptions = {
        from: "Stuff2Get <mckenna.tim@gmail.com>", // sender address
        to: items.email, // list of receivers
        subject: "apikey", // Subject line
        text: "Your apikey for stuff2get is: " +items.apikey + "Return to the web page and enter your apikey to complete registration for your device", // plaintext body
        html: "<b>Your apikey for stuff2get is: " +items.apikey + "</b><p>Return to the web page and enter your apikey to complete registration for your device </b></p>" // html body
    }
    var ret=""
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
                console.log(error);
                ret = error;
        }else{
                console.log("Message sent: " + response.message);
                ret = {message: 'check your email and come back'} 
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
        console.log(ret)
        callback(ret);
    });
}

var createRandomWord = function(length) {
	var consonants = 'bcdfghjklmnpqrstvwxyz',
		vowels = 'aeiou',
		rand = function(limit) {
			return Math.floor(Math.random() * limit);
		},
		i, word = '',
		length = parseInt(length, 10),
		consonants = consonants.split(''),
		vowels = vowels.split('');
	for (i = 0; i < length / 2; i++) {
		var randConsonant = consonants[rand(consonants.length)],
			randVowel = vowels[rand(vowels.length)];
		word += (i === 0) ? randConsonant.toUpperCase() : randConsonant;
		word += i * 2 < length - 1 ? randVowel : '';
	}
	return word;
}

module.exports ={emailKey, createRandomWord}