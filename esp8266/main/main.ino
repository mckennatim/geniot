
#include "config.h"
#include <EEPROM.h>
#include <PubSubClient.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <TimeLib.h>
#include <TimeAlarms.h>
#include "MQclient.h" //globals(extern) NEW_MAIL, itopic, ipayload
#include "STATE.h"
#include "PORTS.h"
#include "TMR.h"
#include "Cmd.h"
#include "Reqs.h"
#include "Sched.h"

PORTS po {5, 16, 15, 13, 12, 4, 14};
#define ONE_WIRE_BUS po.ds18b20 

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

WiFiClient espClient;
PubSubClient client(espClient);
Console console(devid, client);
Reqs req(devid, client);
MQclient mq(devid);

int NEW_ALARM = -1;
int IS_ON = 0;
//STATE st {2, 5, 42, 38, 0, 82, 73, 1, 1, 0};
//{IO2D4, ALED, temp1, temp2, heat, hilimit, lolimit, AUTOMA,  HAY_CNG, }
TMR tmr {0,0,0,3,5,0};
//timr1, timr2, timr3, numtmrs, crement, IS_ON
Sched sched;

state_t ste;
//ste = {{0,80,70},{0,90,80},{1},{1},{1},1,0,0,1,0};
flags_t f;

void initState(){
  //AUTOMA, NEEDS_RESET, sndSched, HAY_CNG
  ste = {{44,0,80,50},{33,0,90,60},{0},{0},{0},1,0,0};
  ste.temp1.hilimit=85;
  f.HAY_CNG=0;
  Serial.println(f.HAY_CNG);
  ste.temp1 = {1,94,77};
}

prgs_t prgs;
void initProgs(){
  prgs = {
  {0,0,3,{{0,0,0,84,64}}},
  {1,0,3,{{0,0,0,84,64}}},
  {2,0,1,{{0,0,0}}},
  {3,0,1,{{0,0,0}}},
  {4,0,1,{{0,0,0}}}};
}

const int numcmds = 4;
char incmd[][10]={"devtime", "progs", "cmd", "prog"};

void acb(){
  int i=0;
  switch(i){
    case 0:
      Serial.println("RING RING RING");
      Alarm.alarmOnce(hour(), minute()+1,0,acb);
  }
}

void processInc(){
  Serial.println(itopic);
  for (int i=0;i<numcmds;i++){
    if(strcmp(incmd[i], itopic)==0){
      switch (i){
        case 0:
          Serial.println("in devtime");
          sched.deserialize(ipayload);
          sched.actTime();
          break;            
        case 1:
          Serial.println("in sched");
          Serial.println(itopic);
          Serial.println(ipayload);
          sched.deseriProgs(ipayload);
          NEW_MAIL=0;
          NEW_ALARM=31;
          IS_ON=31;
          Alarm.clear();
          sched.actProgs2(tmr, ste, f);
          break;            
        case 2:
          Serial.println("in cmd");
          Cmd cmd;
          // cmd.deserialize(ipayload);
          // cmd.act(st);
          cmd.deserialize2(ipayload,ste, po, tmr, f);
          break; 
        case 3:
          Serial.println(ipayload);
          sched.deseriProg(prgs,ipayload);
          NEW_MAIL=0;
          break;
        default:           
          Serial.println("in default");
          break; 
      }
    }else{
      NEW_MAIL=0;
    }
  }
}


void clpub(char status[20], char astr[120]){
  if (client.connected()){
    client.publish(status, astr, true);
  }   
  Serial.print(status);
  Serial.println(astr);
}

void publishState(int hc){
  // Serial.print("in publishState w: ");
  // Serial.println(hc);
  char status[20];
  strcpy(status,devid);
  strcat(status,"/status");  
  char astr[120];
  //sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 3, ste.timr2.state);
  if((hc & 1) == 1){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d, %d, %d, %d]}", 0, ste.temp1.temp, ste.temp1.state, ste.temp1.hilimit, ste.temp1.lolimit);
    clpub(status, astr);
  }
  if((hc & 2) == 2){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d, %d, %d, %d]}", 1, ste.temp2.temp, ste.temp2.state, ste.temp2.hilimit, ste.temp2.lolimit);
    clpub(status, astr);
  }
  if((hc & 4) == 4){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 2, ste.timr1.state);
    clpub(status, astr);
  }
  if((hc & 8) == 8){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 3, ste.timr2.state);
    clpub(status, astr);
  }
  if((hc & 16) == 16){
    sprintf(astr,   "{\"id\":%d, \"darr\":[%d]}", 4, ste.timr3.state);
    clpub(status, astr);
  }
  if((hc & 32) == 32){
    sprintf(astr, "{\"id\":%d, \"data\":%d}", 5, ste.AUTOMA);
    clpub(status, astr);
  }
  if((hc & 64) == 64){
    sprintf(astr, "{\"id\":%d, \"data\":%d}", 6, ste.NEEDS_RESET);
    clpub(status, astr);
  }
  if((hc &128) == 128){
    sprintf(astr, "{\"id\":%d, \"data\":%d}", 7, ste.sndSched);
    publishState(127);//11111111
    clpub(status, astr);
  }
}



void publishTmr(){
  char astr[120];
  sprintf(astr, "{\"timr1\":%d, \"timr2\":%d, \"timr3\":%d, \"numtmrs\":%d, \"crement\":%d, \"IS_ON\":%d  }", tmr.timr1, tmr.timr2, tmr.timr3, tmr.numtmrs, tmr.crement, tmr.IS_ON);
  char status[20];
  strcpy(status,devid);
  strcat(status,"/tmr");
  if (client.connected()){
    client.publish(status, astr, true);
  } 
  // Serial.print(status);
  // Serial.println(astr);
}

void readTemps(){
  DS18B20.requestTemperatures(); 
  int temp1 = (int)DS18B20.getTempFByIndex(0);
  int temp2 = (int)DS18B20.getTempFByIndex(1);
  if(temp1 != ste.temp1.temp){
    ste.temp1.temp=temp1;
    f.HAY_CNG=f.HAY_CNG | 1;
  }
  if(temp2 != ste.temp2.temp){
    ste.temp2.temp=temp2;
    f.HAY_CNG=f.HAY_CNG | 2;
  }
}

void controlHeat(){
  bool heat;
  if (f.HAY_CNG | 1){
    if (ste.temp1.temp >= ste.temp1.hilimit){
      heat=0;
    } 
    if (ste.temp1.temp <= ste.temp1.lolimit){
      heat=1;
    } 
    if (heat != ste.temp1.state){
      ste.temp1.state = heat;
      digitalWrite(po.temp1, heat);
    }
  } else if (f.HAY_CNG | 2){
    if (ste.temp2.temp >= ste.temp2.hilimit){
      heat=0;
    } 
    if (ste.temp2.temp <= ste.temp2.lolimit){
      heat=1;
    } 
    if (heat != ste.temp2.state){
      ste.temp2.state = heat;
      digitalWrite(po.temp2, heat);
    }
  } 
}

void setup(){
  Serial.begin(115200);
  EEPROM.begin(512);
  Serial.println();
  Serial.println("--------------------------");
  Serial.println("ESP8266 mqttdemo");
  Serial.println("--------------------------");
  initState();
  initProgs();
  Serial.print(ste.temp1.state);
  Serial.print(ste.temp1.hilimit);
  Serial.print(ste.temp1.lolimit);
  Serial.println(ste.temp2.hilimit);
  getOnline();
  client.setServer(ip, 1883);
  client.setCallback(handleCallback); 
  mq.reconn(client); 
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
  req.stime();
}



time_t before = 0;
time_t schedcrement = 0;
time_t inow;

void loop(){
  if(NEW_ALARM>0){
    sched.actProgs2(tmr, ste, f);
  }
  Alarm.delay(100);
  server.handleClient();
  if(NEW_MAIL){
    processInc();
  }
  if(!client.connected() && !NEEDS_RESET){
     mq.reconn(client);
  }else{
    client.loop();
  }
  inow = millis();
  if(inow-schedcrement > tmr.crement*1000){
    schedcrement = inow;
    if(IS_ON > 3){
      sched.updateTmrs(tmr, client, po, ste, f);
      publishTmr();
    }
  }
  if (inow - before > 1000) {
    before = inow;
    if(ste.AUTOMA){
      readTemps();
      controlHeat();
    }
    if(f.HAY_CNG>0){
      //console.log("example console.log entry");
      publishState(f.HAY_CNG);
      f.HAY_CNG=0;
    }
  } 
}