#include "MQclient.h"
#include <Arduino.h>
#include <PubSubClient.h>

char itopic[40];
char ipayload[250];
bool NEW_MAIL=0;

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
    char ccmd[20];
    strcpy(ccmd, cdevid);
    strcat(ccmd,"/cmd");
    char devt[25];
    strcpy(devt, cdevid);
    strcat(devt,"/devtime");
    char progs[25];
    strcpy(progs, cdevid);
    strcat(progs,"/progs");
    char prog[25];
    strcpy(prog, cdevid);
    strcat(prog,"/prog");
    client.subscribe(ccmd);
    client.subscribe(devt);
    client.subscribe(progs);
    client.subscribe(prog);
    Serial.println(progs);
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