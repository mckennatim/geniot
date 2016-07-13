var mosca = require('mosca')
var env = require('../../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var currentPacket = {dog: "uli"};
var sched =require('../schedule/schedutil')

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',        
  url: 'mongodb://127.0.0.1:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: cfg.port.mqtt,           //mosca (mqtt) port
  backend: pubsubsettings,//pubsubsettings is the object we created above 
  http: {port: cfg.port.ws, bundle: true, static: './'}    
};

var moserver = new mosca.Server(moscaSettings);   //here we start mosca
moserver.on('ready', setup);  //on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running')
}
moserver.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }
  //if(client){console.log(client.id)};
  //console.log(packet.topic)
  mq.selectAction(packet.topic)
  mq.processIncoming(packet.payload)

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain || false,
    qos: packet.qos || 0
  };
  currentPacket= newPacket;
  console.log('Pkt',  packet.topic , newPacket.payload.toString());
  //console.log(currentPacket.payload.toString())
  exports.currentPacket
  moserver.publish(newPacket, cb);
}

var mq = {
  selectAction: function(topic){
    var sp = topic.split("/")
    this.devid = sp[0];
    this.job = sp[1];
    //console.log(this.devid, this.job)
    this[this.job]
  },
  processIncoming: function(payload){
    switch(this.job){
      case "dog":
        console.log("dog")
        break
      case "cmd":
        console.log("cmd")
        break
      case "time":
        console.log("time")
        sched.getTime(this.devid, moserver)
        break
      case "sched":
        console.log("sched")
        sched.sendSchedule(this.devid, moserver, payload)
        break
      case "srstate":
        console.log("srstate")
        break
    }
  },
  job: '',
  devid: ''
}