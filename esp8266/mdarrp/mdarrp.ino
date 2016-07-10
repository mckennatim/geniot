#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include "STATE.h"

prgs_t prgs;
void initProgs(){
  prgs = {
  {0,0,3,{{0,0,0,84,64}}},
  {1,0,3,{{0,0,0,84,64}}},
  {2,0,1,{{0,0,0}}},
  {3,0,1,{{0,0,0}}},
  {4,0,1,{{0,0,0}}}};
}

char ipayload[250] = "{\"id\":0, \"pro\":[[0,0,0,84,64],[6,30,1,84,70]]}";



void copyProg(prg_t& t, JsonArray& ev){
  for(int h=0;h<ev.size();h++){
    JsonArray& aprg = ev[h];
    aprg.printTo(Serial);
    for(int j=0;j<t.numdata+2;j++){
      t.prg[h][j] = aprg[j];
      Serial.print(t.prg[h][j]);
    }
  }        
}



void deseriProg(prgs_t& prgs, char* kstr){
  StaticJsonBuffer<300> jsonBuffer;
  JsonObject& rot = jsonBuffer.parseObject(kstr);
  int id = rot["id"];
  JsonArray& events = rot["pro"];
  switch(id){
   case 0:
     copyProg(prgs.temp1, events);          
     break;
   case 1:
     copyProg(prgs.temp2, events);          
     break;
   default:
      Serial.println("in default");
  }
}

void setup(){
	Serial.begin(115200);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 blank");
  Serial.println("--------------------------");
  initProgs();
  Serial.println(ipayload);
  deseriProg(prgs,ipayload);
}

void loop(){

}