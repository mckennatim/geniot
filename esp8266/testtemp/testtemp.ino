#include <EEPROM.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include "STATE.h"

prgs_t prgs {
    {0,255,1,2,{{0,0,94,64}}},
    {1,255,1,2,{{0,0,95,64}}},
    {2,255,1,1,{{0,0,0}}},
    {3,255,1,1,{{0,0,0}}},
    {4,255,1,1,{{0,0,0}}}
  };
flags_t f {1,0,5,28,28,0,31,31,31,0,{0,0,0,0,0}};
state_t sr {{44,0,80,50},{33,0,90,60},{0},{0},{0}};
ports_t po {5, 16, 15, 13, 12, 4, 14};
labels_t la; //subsribedTo[], numcmds

#define ONE_WIRE_BUS po.ds18b20
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

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


void readTemps(){
  DS18B20.requestTemperatures(); 
  int temp1 = (int)DS18B20.getTempFByIndex(0);
  int temp2 = (int)DS18B20.getTempFByIndex(1);
  if(temp1 != sr.temp1.temp){
    Serial.print("temp1 changed to ");
    Serial.println(temp1);
    sr.temp1.temp=temp1;
    f.HAYsTATEcNG=f.HAYsTATEcNG | 1;
  }
  if(temp2 != sr.temp2.temp){
    Serial.print("temp2 changed to ");
	  Serial.println(temp2);
    sr.temp2.temp=temp2;
    f.HAYsTATEcNG=f.HAYsTATEcNG | 2;
  }
}

void controlHeat(){
  bool heat;
  if (f.HAYsTATEcNG | 1){
    if (sr.temp1.temp >= sr.temp1.hilimit){
      heat=0;
    } 
    if (sr.temp1.temp <= sr.temp1.lolimit){
      heat=1;
    } 
    if (heat != sr.temp1.state){
      sr.temp1.state = heat;
      digitalWrite(po.temp1, heat);
    }
  } else if (f.HAYsTATEcNG | 2){
    if (sr.temp2.temp >= sr.temp2.hilimit){
      heat=0;
    } 
    if (sr.temp2.temp <= sr.temp2.lolimit){
      heat=1;
    } 
    if (heat != sr.temp2.state){
      sr.temp2.state = heat;
      digitalWrite(po.temp2, heat);
    }
  } 
}

void setup(){
	Serial.begin(115200);
  EEPROM.begin(512);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 testtemp");
  Serial.println("--------------------------");
  initShit();
}

time_t before = 0;
time_t schedcrement = 0;
time_t inow;

void loop(){
  inow = millis();
  if (inow - before > 1000) {
    before = inow;
    if(f.aUTOMA){
      readTemps();
      controlHeat();
    }
    if(f.HAYsTATEcNG>0){
      Serial.print("f.HAYsTATEcNG=");
      Serial.println(f.HAYsTATEcNG);
      //console.log("example console.log entry");
      //req.pubState(f.HAYsTATEcNG);
      f.HAYsTATEcNG=0;
    }
  } 
}