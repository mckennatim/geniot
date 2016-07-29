#include "MQclient.h"
#include <Arduino.h>
#include <PubSubClient.h>
#include "STATE.h"


char itopic[40];
char ipayload[250];
bool NEW_MAIL=0;
extern labels_t la;

Console::Console(char* devid, PubSubClient& client ){
  cdevid = devid;
  cclient = client;
}

void Console::log(char* dd){
	char log[20];
	strcpy(log,cdevid);
	strcat(log,"/log");
  if (cclient.connected()){
    cclient.publish(log, dd, true);
  }		
}

MQclient::MQclient(char* devid){
	cdevid = devid;
}

void MQclient::reconn(PubSubClient& client) {
  Serial.print("Attempting remo MQTT connection...");
  if (client.connect(cdevid)) {
    Serial.println("connected");
    for (int i=0;i<la.numcmds;i++){
      char topic[25];
      strcpy(topic, cdevid);
      strcat(topic,"/"); 
      strcat(topic,la.scribedTo[i]);
      client.subscribe(topic);
      Serial.println(topic);     
    }  
    return;
  } else {
    Serial.print("failed, rc=");
    Serial.print(client.state());
    delay(5000);
    Serial.println(" try again in 5 seconds");
  }
}

void handleCallback(char* topic, byte* payload, unsigned int length){
  int b = 15;
  for (int i=0;i<strlen(topic);i++) {
    itopic[i] = topic[i];
    if (topic[i] == '/'){b = i;}
    if(i>b){
      itopic[i-b-1] = topic[i];
    }
  }
  itopic[strlen(topic)-b-1] = '\0';
  for (int i=0;i<length;i++) {
    ipayload[i] = (char)payload[i];
  }
  ipayload[length] = '\0';
  NEW_MAIL = 1;
}