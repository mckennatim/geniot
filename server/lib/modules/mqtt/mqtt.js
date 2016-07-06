var mosca = require('mosca')
var env = require('../../../env.json')
var cfg= env[process.env.NODE_ENV||'development']
var currentPacket;

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',        
  url: 'mongodb://localhost:27017/mqtt',
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
  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain || false,
    qos: packet.qos || 0
  };
  currentPacket= newPacket.payload.toString();
  console.log('newPacket payload', packet.topic , newPacket.payload.toString());
  moserver.publish(newPacket, cb);
}

export {currentPacket}