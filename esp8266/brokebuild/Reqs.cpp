#include "Reqs.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "Sched.h"
#include <Arduino.h>
#include <TimeLib.h>

extern Sched sched;
extern char itopic[40];
extern char ipayload[250];
extern labels_t la;
extern flags_t f;
extern state_t sr;

Reqs::Reqs(char* devid, PubSubClient& client ){
  cdevid = devid;
  cclient = client;
}

void Reqs::stime(){
	char* dd = "the time is being requesrd";
	f.cREMENT++;
	Serial.println(dd);
	char time[20];
	strcpy(time,cdevid);
	strcat(time,"/time");
  if (cclient.connected()){
    cclient.publish(time, dd, true);
  }		
}

void Reqs::processInc(){
  for (int i=0;i<la.numcmds;i++){
    if(strcmp(la.scribedTo[i], itopic)==0){
    	switch (i){
        case 0:
          Serial.println("in devtime");
          sched.deseriTime();
          sched.actTime();
          break;
        case 2://in prg
          Serial.println(ipayload);
          sched.deseriProg(ipayload);
          break;          
        case 5:
          Serial.println("in progs(deprecated)");
          break;
        default: 
        	Serial.print(i);         
          Serial.println(": in processInc default");
          break;           
      }    		
  	}
  }
}

void Reqs::pubFlags(flags_t& f){
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

void Reqs::creaJson(prg_t& p, char* astr){
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

void Reqs::pubPrg(prgs_t& prgs, int ck){
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

void Reqs::clpub(char status[20], char astr[120]){
  if (cclient.connected()){
    cclient.publish(status, astr, true);
  }   
  Serial.print(status);
  Serial.println(astr);
}

void Reqs::pubState(int hc){
  // Serial.print("in publishState w: ");
  // Serial.println(hc);
  char srstate[20];
  strcpy(srstate,cdevid);
  strcat(srstate,"/srstate");  
  char astr[120];
  //sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 3, sr.timr2.state);
  if((hc & 1) == 1){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d, %d, %d, %d]}", 0, sr.temp1.temp, sr.temp1.state, sr.temp1.hilimit, sr.temp1.lolimit);
    clpub(srstate, astr);
  }
  if((hc & 2) == 2){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d, %d, %d, %d]}", 1, sr.temp2.temp, sr.temp2.state, sr.temp2.hilimit, sr.temp2.lolimit);
    clpub(srstate, astr);
  }
  if((hc & 4) == 4){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 2, sr.timr1.state);
    clpub(srstate, astr);
  }
  if((hc & 8) == 8){
    sprintf(astr, "{\"id\":%d, \"darr\":[%d]}", 3, sr.timr2.state);
    clpub(srstate, astr);
  }
  if((hc & 16) == 16){
    sprintf(astr,   "{\"id\":%d, \"darr\":[%d]}", 4, sr.timr3.state);
    clpub(srstate, astr);
  }
}

