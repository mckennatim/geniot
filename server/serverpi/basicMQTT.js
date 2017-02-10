var mosca = require('mosca')

var ascoltatore = {
  //using ascoltatore
  type: 'mongo',        
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 2002,
  backend: ascoltatore,
  persistence: {
    factory: mosca.persistence.Mongo,
    url: 'mongodb://localhost:27017/mqtt'
  },
  http: {
    port: 2003, 
    bundle: true,
    static: './'
  }   
};

var server = new mosca.Server(moscaSettings);
server.on('ready', setup);

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);  
   
});
setInterval(function () { 
  server.publish({topic: 'fromBroker', payload: 'one message from broker'}, function(){
    console.log('sent message')
  })
}, 4000); 

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('topic ', packet.topic.toString(),' payload ', packet.payload.toString());
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca on mqtt: ',moscaSettings.port, ' ws:', moscaSettings.http.port)
}