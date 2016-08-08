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
flags_t f {0,0,5,28,0,0,31,0,0,0,{0,0,0,0,0}};
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
    int bit =pow(2,0);
    int mask = 31-bit;
    sr.temp1.temp=temp1;
    bool relaystate;
    adjHeat(sr.temp1, relaystate);
    if (relaystate != sr.temp1.state){
      sr.temp1.state = relaystate;
      int relayon = f.ISrELAYoN;
      if(sr.temp1.state){
        relayon = relayon | bit;
      }else{
        relayon = relayon & mask;
      }
      if(relayon!=f.ISrELAYoN){
        f.ISrELAYoN = relayon;
        req.pubTimr();
      }
      digitalWrite(po.temp1, relaystate);
    }
    f.HAYsTATEcNG=f.HAYsTATEcNG | bit;
  }
  if(temp2 != sr.temp2.temp && temp2 <120 && temp2>-20){
    int bit =pow(2,1);
    int mask = 31-bit;
    sr.temp2.temp=temp2;
    bool relaystate;
    adjHeat(sr.temp2, relaystate);
    if (relaystate != sr.temp2.state){
      sr.temp2.state = relaystate;
      int relayon = f.ISrELAYoN;
      if(sr.temp1.state){
        relayon = relayon | bit;
      }else{
        relayon = relayon & mask;
      }
      if(relayon!=f.ISrELAYoN){
        f.ISrELAYoN = relayon;
        req.pubTimr();      
      }
      digitalWrite(po.temp2, relaystate);
    }
    f.HAYsTATEcNG=f.HAYsTATEcNG | bit;
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
    req.pubTimr();
    f.CKaLARM=f.CKaLARM & 0; //11110 turnoff CKaLARM for 1
  }
  inow = millis();
  if(inow-schedcrement > f.cREMENT*1000){
    schedcrement = inow;
    if (f.IStIMERoN >0){
      sched.updTimers();
      req.pubTimr();
    }
    sched.ckRelays();
  }
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