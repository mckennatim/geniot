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

prgs_t prgs {
    {0,255,1,2,{{0,0,82,81}}},
    {1,255,1,2,{{0,0,83,82}}},
    {2,255,1,1,{{0,0,0}}},
    {3,255,1,1,{{0,0,0}}},
    {4,255,1,1,{{0,0,0}}}
  };
flags_t f {0,0,5,28,28,0,31,0,0,0,{0,0,0,0,0}};
state_t sr {{44,0,80,50},{33,0,90,60},{0},{0},{0}};
ports_t po {5, 16, 15, 13, 12, 4, 14};
labels_t la; //subsribedTo[], numcmds

#define ONE_WIRE_BUS po.ds18b20 

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);
Console console(devid, client);
Reqs req(devid, client);
MQclient mq(devid);

void initShit(){
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

void adjHeat(temp_t& te, bool& rs){
  if (te.temp >= te.hilimit){
    rs=0;
  } else if (te.temp <= te.lolimit){
    rs=1;
  }  
}

void readTemps(){
  DS18B20.requestTemperatures(); 
  int temp1 = (int)DS18B20.getTempFByIndex(0);
  int temp2 = (int)DS18B20.getTempFByIndex(1);
  if(temp1 != sr.temp1.temp && temp1 <120 && temp1>-20){
    sr.temp1.temp=temp1;
    bool relaystate;
    adjHeat(sr.temp1, relaystate);
    if (relaystate != sr.temp1.state){
      sr.temp1.state = relaystate;
      digitalWrite(po.temp1, relaystate);
    }
    f.HAYsTATEcNG=f.HAYsTATEcNG | 1;
  }
  if(temp2 != sr.temp2.temp && temp2 <120 && temp2>-20){
    sr.temp2.temp=temp2;
    bool relaystate;
    adjHeat(sr.temp2, relaystate);
    if (relaystate != sr.temp2.state){
      sr.temp2.state = relaystate;
      digitalWrite(po.temp2, relaystate);
    }
    f.HAYsTATEcNG=f.HAYsTATEcNG | 2;
  }
}

void setup(){
	Serial.begin(115200);
  EEPROM.begin(512);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 incrbuild");
  Serial.println("--------------------------");
  initShit();
  getOnline();//config.cpp
  client.setServer(ip, 1883);
  client.setCallback(handleCallback); //in Req.cpp
  mq.reconn(client);   
  req.stime();
  //test payloads
  // char ipayload1[250] = "{\"id\":0,\"pro\":[[0,0,84,68],[6,30,84,70],[8,15,58,56],[4,15,68,66],[11,33,56,54]]}";
  // char ipayload2[250] = "{\"id\":1,\"pro\":[[0,0,64,58],[6,0,81,75]]}";
  // char ipayload3[250] = "{\"id\":2,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
  // char ipayload4[250] = "{\"id\":3,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
  // char ipayload5[250] = "{\"id\":4,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";  
  // sched.deseriProg(ipayload1);
  // sched.deseriProg(ipayload2);
  // sched.deseriProg(ipayload3);
  // sched.deseriProg(ipayload4);
  // sched.deseriProg(ipayload5);
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
  if(!client.connected() && !f.fORCErESET){
     mq.reconn(client);
  }else{
    client.loop();
  }  
  if (f.CKaLARM>0){
    sched.ckAlarms(); //whatever gets scheduled should publish its update
    req.pubPrg(f.CKaLARM);
    req.pubFlags();
    f.CKaLARM=f.CKaLARM & 0; //11110 turnoff CKaLARM for 1
  }
  if(inow-schedcrement > f.cREMENT*1000){
    schedcrement = inow;
    if (f.IStIMERoN >0){
      sched.updTimers();
    }
  }
  inow = millis();
  if (inow - before > 1000) {
    before = inow;
    if(f.aUTOMA){
      readTemps();
    }
    if(f.HAYsTATEcNG>0){
      // Serial.print("f.HAYsTATEcNG=");
      // Serial.println(f.HAYsTATEcNG);
      //console.log("example console.log entry");
      req.pubState(f.HAYsTATEcNG);
      f.HAYsTATEcNG=0;
    }
  } 
}