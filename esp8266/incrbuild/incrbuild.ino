#include <EEPROM.h>
#include <ESP8266WiFi.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "config.h" //getOnline() devid
#include "STATE.h"
#include "MQclient.h" //globals(extern) NEW_MAIL, itopic, ipayload + Console + handleCallback()
#include "Reqs.h"
#include "Sched.h"

Sched sched;

prgs_t prgs;
flags_t f;
state_t state;
ports_t po;
labels_t la; //subsribedTo[], numcmds

void initShit(){
  po = {5, 16, 15, 13, 12, 4, 14};
  prgs = {
    {0,255,1,2,{{0,0,74,64}}},
    {1,255,1,2,{{0,0,84,64}}},
    {2,255,1,1,{{0,0,0}}},
    {3,255,1,1,{{0,0,0}}},
    {4,255,1,1,{{0,0,0}}}
  };
  f={1,0,5,28,28,0,31,31,31,0,{0,0,0,0,0}};
  state = {{44,0,80,50},{33,0,90,60},{0},{0},{0}};
  pinMode(po.temp1, OUTPUT);
  pinMode(po.temp2, OUTPUT);
  pinMode(po.timr1, OUTPUT);
  pinMode(po.timr2, OUTPUT);
  pinMode(po.timr3, OUTPUT);
  digitalWrite(po.temp1, LOW);
  digitalWrite(po.temp2, LOW);
  digitalWrite(po.timr1, LOW);
  digitalWrite(po.timr2, LOW);
  digitalWrite(po.timr3, LOW);
}

#define ONE_WIRE_BUS po.ds18b20 

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);
Console console(devid, client);
Reqs req(devid, client);
MQclient mq(devid);



void setup(){
	Serial.begin(115200);
  EEPROM.begin(512);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 incrbuild");
  Serial.println("--------------------------");
  getOnline();//config.cpp
  client.setServer(ip, 1883);
  client.setCallback(handleCallback); //in Req.cpp
  mq.reconn(client);   
  initShit();
  f.CKaLARM=31;
  req.stime();

  //test payloads
  char ipayload1[250] = "{\"id\":0,\"pro\":[[0,0,84,68],[6,30,84,70],[8,15,58,56],[4,15,68,66],[11,33,56,54]]}";
  char ipayload2[250] = "{\"id\":1,\"pro\":[[0,0,64,58],[6,0,81,75]]}";
  char ipayload3[250] = "{\"id\":2,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
  char ipayload4[250] = "{\"id\":3,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
  char ipayload5[250] = "{\"id\":4,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";  
  sched.deseriProg(prgs,ipayload1);
  sched.deseriProg(prgs,ipayload2);
  sched.deseriProg(prgs,ipayload3);
  sched.deseriProg(prgs,ipayload4);
  sched.deseriProg(prgs,ipayload5);
}

time_t before = 0;
time_t schedcrement = 0;
time_t inow;

void loop(){
  Alarm.delay(100);
  server.handleClient();
  if(NEW_MAIL){
    req.processInc();
    NEW_MAIL=0;
  }  
  if(!client.connected() && !NEEDS_RESET){
     mq.reconn(client);
  }else{
    client.loop();
  }  
  if (f.CKaLARM>0){
    sched.ckAlarms(prgs,state,f); //whatever gets scheduled should publish its update
    req.pubPrg(prgs, f.CKaLARM);
    req.pubFlags(f);
    f.CKaLARM=f.CKaLARM & 0; //11110 turnoff CKaLARM for 1
  }
}