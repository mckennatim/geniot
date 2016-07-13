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
    char cmd[20];
    strcpy(cmd, cdevid);
    strcat(cmd,"/cmd");
    char devtime[25];
    strcpy(devtime, cdevid);
    strcat(devtime,"/devtime");
    char progs[25];//deprecated
    strcpy(progs, cdevid);
    strcat(progs,"/progs");
    char prg[25];
    strcpy(prg, cdevid);
    strcat(prg,"/prg");
    char req[25];
    strcpy(req, cdevid);
    strcat(req,"/req");
    char set[25];
    strcpy(set, cdevid);
    strcat(set,"/set");
    client.subscribe(set);
    client.subscribe(cmd);
    client.subscribe(devtime);
    client.subscribe(progs);//deprecated
    client.subscribe(prg);
    client.subscribe(req);
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