#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include "STATE.h"

prgs_t prgs;
flags_t f;
state_t state;
void initShit(){
  prgs = {
    {0,255,1,2,{{0,0,74,64}}},
    {1,255,1,2,{{0,0,84,64}}},
    {2,255,1,1,{{0,0,0}}},
    {3,255,1,1,{{0,0,0}}},
    {4,255,1,1,{{0,0,0}}}
  };
  f={1,0,5,28,28,0,31,31,31,0,{0,0,0,0,0}};
  state = {{44,0,80,50},{33,0,90,60},{0},{0},{0}};
}

char ipayload[250] = "{\"id\":0,\"pro\":[[0,0,84,68],[6,30,84,70],[8,15,58,56],[4,15,68,66],[11,33,56,54]]}";
char ipayload2[250] = "{\"id\":1,\"pro\":[[0,0,64,58],[6,0,81,75]]}";
char ipayload3[250] = "{\"id\":2,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
char ipayload4[250] = "{\"id\":3,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";
char ipayload5[250] = "{\"id\":4,\"pro\":[[0,0,0],[6,30,1],[8,15,0],[14,20,1],[16,45,0]]}";


void copyProg(prg_t& t, JsonArray& ev){
  t.ev=ev.size();
  for(int h=0;h<ev.size();h++){
    JsonArray& aprg = ev[h];
    aprg.printTo(Serial);
    for(int j=0;j<t.numdata+2;j++){
      t.prg[h][j] = aprg[j];
      Serial.print(t.prg[h][j]);
    }
    Serial.println("");
  }        
}

void deseriProg(prgs_t& prgs, char* kstr){
  Serial.println(kstr);
  StaticJsonBuffer<1000> jsonBuffer;
  JsonObject& rot = jsonBuffer.parseObject(kstr);
  int id = rot["id"];
  Serial.print("id = ");
  Serial.println(id);
  JsonArray& events = rot["pro"];
  switch(id){
   case 0:
      Serial.println("in case=0");
     copyProg(prgs.temp1, events);          
     break;
   case 1:
     copyProg(prgs.temp2, events);          
     break;
   case 2:
     copyProg(prgs.timr1, events);          
     break;
   case 3:
     copyProg(prgs.timr2, events);          
     break;
   case 4:
     copyProg(prgs.timr3, events);          
     break;
   default:
      Serial.println("in default");
  }
}

void setCur(prg_t& p, int &cur, int &nxt){
  for(int j=0; j<p.ev;j++){
    if (hour() == p.prg[j][0]){
      if (minute() < p.prg[j][1]){
        cur = j-1;
        break;
      }
    }
    if (hour() < p.prg[j][0]){
      cur= j-1;
      break;
    }
    cur =j;
  }
  nxt = cur+1;
  if (nxt>=p.ev){
    nxt=0;
  }        
}

void ckAlarms(prgs_t& prgs, state_t& state, flags_t& f){
  if((f.CKaLARM & 1) == 1){
    prg_t p = prgs.temp1;
    temp_t s = state.temp1;
    int id =0;
    int bit =1;
    int cur, nxt;
    setCur(p, cur, nxt);

  }
}
void pubFlags(flags_t& f){
  StaticJsonBuffer<500> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["aUTOMA"]=f.aUTOMA;
  root["fORCErESET"]=f.fORCErESET;  
  root["cREMENT"]=f.cREMENT;
  root["HAStIMR"]=f.HAStIMR; //11100(28) 4,8, and 16 have timers not temp
  root["IStIMERoN"]=f.IStIMERoN;//11100 assume some time left, timers with tleft>0 
  root["HAYpROG"]=f.HAYpROG;// = senrels with events>1
  root["HAYpROGcNG"]=f.HAYpROGcNG;// 11111(31 force report) g change root["or ext
  root["HAYsTATEcNG"]=f.HAYsTATEcNG; //11111(31 force report)state ch root["or ext
  root["CKaLARM"]=f.CKaLARM; //11111 assume alarm is set at start
  root["ISrELAYoN"]=f.ISrELAYoN;// = summary of relay states  
  JsonArray& tleft = root.createNestedArray("tIMElEFT");
  for(int i=0;i<6;i++){
    tleft.add(f.tIMElEFT[i]);
  }
  char ast[180];
  root.printTo(ast, sizeof(ast));  
  Serial.println(ast);
}

void creaJson(prg_t& p, char* astr){
  StaticJsonBuffer<1000> jsonBuffer;
  JsonObject& root = jsonBuffer.createObject();
  root["id"]= p.id;
  JsonArray& pro = root.createNestedArray("pro");
  for(int i=0;i<p.ev;i++){
    JsonArray& data = pro.createNestedArray();
    for (int j=0;j<p.numdata + 2;j++){
      data.add(p.prg[i][j]);
    }
  }
  char ast[120];
  root.printTo(ast, sizeof(ast));
  strcpy(astr,ast);
}

void pubPrg(prgs_t& prgs, int ck){
  if((ck & 1) == 1){
    prg_t p = prgs.temp1;
    char astr[120];
    creaJson(p, astr);
    Serial.println(astr);
  }
  if((ck & 2) == 2){
    prg_t p = prgs.temp2;
    char astr[120];
    creaJson(p, astr);
    Serial.println(astr);
  }
  if((ck & 4) == 4){
    prg_t p = prgs.timr1;
    char astr[120];
    creaJson(p, astr);
    Serial.println(astr);
  }
  if((ck & 8) == 8){
    prg_t p = prgs.timr2;
    char astr[120];
    creaJson(p, astr);
    Serial.println(astr);
  }
  if((ck & 16) == 16){
    prg_t p = prgs.timr3;
    char astr[120];
    creaJson(p, astr);
    Serial.println(astr);
  }
}

void setup(){
	Serial.begin(115200);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 blank");
  Serial.println("--------------------------");
  initShit();
  f.CKaLARM=31;
  Serial.println(ipayload);
  Serial.println(ipayload2);
  deseriProg(prgs,ipayload);
  deseriProg(prgs,ipayload2);
  deseriProg(prgs,ipayload3);
  deseriProg(prgs,ipayload4);
  deseriProg(prgs,ipayload5);
}

time_t before = 0;
time_t schedcrement = 0;
time_t inow;

void loop(){
  if (f.CKaLARM>0){
    ckAlarms(prgs,state,f); //whatever gets scheduled should publish its update
    pubPrg(prgs, f.CKaLARM);
    pubFlags(f);
    f.CKaLARM=f.CKaLARM & 0; //11110 turnoff CKaLARM for 1
  }
}