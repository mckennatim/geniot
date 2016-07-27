#include "Sched.h"
#include "STATE.h"
#include <Arduino.h>
#include <ArduinoJson.h>
#include <TimeLib.h>
#include <TimeAlarms.h>

extern flags_t f;


bool Sched::deseriTime(char* kstr){
  StaticJsonBuffer<200> jsonBuffer;
  JsonObject& root = jsonBuffer.parseObject(kstr);
  //root.prettyPrintTo(Serial);
  unix = root["unix"];
  LLLL = root["LLLL"];
  zone = root["zone"];
  return root.success();
}

void Sched::actTime(){
  //Serial.println(unix);
  Serial.println(LLLL);
  //Serial.println(zone);
  time_t datetime = unix + zone*60*60;
  //Serial.println(datetime); 
  setTime(datetime);
  setSyncInterval(4000000); 
  //Serial.println(hour());   
}

void Sched::copyProg(prg_t& t, JsonArray& ev){
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

void Sched::deseriProg(prgs_t& prgs, char* kstr){
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

void Sched::setCur(prg_t& p, int &cur, int &nxt){
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

void Sched::setTleft(prg_t p, int cur, int nxt, int &tleft){
  int hr = hour();
  int min = minute(); 
  if(nxt==0){
    tleft = (23-hr)*60+(59-min) +1;
  }else{
    int nxthr = p.prg[nxt][0];
    int nxtmin = p.prg[nxt][1];
    if(nxtmin < min){//12:25 -> 14:05
      nxtmin=nxtmin+60;
      nxthr--;
    }
    tleft= (nxthr-hr)*60 + (nxtmin - min);
  }
}

void Sched::ckAlarms(prgs_t& prgs, state_t& state, flags_t& f){
  if((f.CKaLARM & 1) == 1){
    prg_t p = prgs.temp1;
    temp_t s = state.temp1;
    int id =0;
    int bit =1;
    int cur, nxt;
    setCur(p, cur, nxt);
  }
  if((f.CKaLARM & 4) == 4){
    prg_t p = prgs.timr1;
    timr_t s = state.timr1;
    int id =2;
    int bit =4;
    int cur, nxt;
    setCur(p, cur, nxt);
    int tleft=0;
    //for timers
    s.state = p.prg[cur][2];
    f.ISrELAYoN = f.ISrELAYoN | s.state;
    if (s.state){ //if relay is on
       setTleft(p, cur, nxt, tleft);
       f.IStIMERoN = f.IStIMERoN | bit;
    }
    f.tIMElEFT[id]=tleft;
    int asec = second()+1;        
    //Alarm.alarmOnce(p.prg[nxt][0],p.prg[nxt][1], asec, bm4);
    int min1 = minute()+1; 
    Serial.print(hour());
    Serial.print(":");
    Serial.print(min1);
    Serial.print(":");
    Serial.print(asec);
    Serial.println(" setting alarm for a minute from now");  
    Alarm.alarmOnce(hour(),min1, asec, bm4);     
  }
}

void bm4(){
  Serial.print("timr1 8 begets: ");
  f.CKaLARM=f.CKaLARM | 4;
}
