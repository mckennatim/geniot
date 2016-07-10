#include "Cmd.h" //private: heat, automa, hilimit, lolimit, empty
#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include "config.h"
#include "MQclient.h" //for extern NEW_MAIL
#include "STATE.h"
#include "TMR.h"

bool Cmd::deserialize2(char* kstr, state_t& ste, PORTS& po, TMR& tmr, flags_t& f){
  Serial.print("deseralize2 id: ");
  StaticJsonBuffer<300> jsonBuffer;
  JsonObject& rot = jsonBuffer.parseObject(kstr);
  int srid =99;
  //if(rot["srid"]){
    srid = rot["id"];
  //}
  Serial.println(srid);
  int dar[3];
  int daa;
  JsonArray& darr = rot["darr"];
  Serial.print("in if rot darr sz= ");
  Serial.println(darr.size());
  for(int h=0;h<darr.size();h++){
    dar[h] = darr[h];
    Serial.println(dar[h]);
  }
  daa = rot["data"];
  switch(srid){
  bool sta;
    case 0:
      sta = dar[0];
      if(sta != ste.temp1.state){
        ste.temp1.state = sta;
        digitalWrite(po.temp1, sta);
      }
      ste.temp1.hilimit = dar[1];
      ste.temp1.lolimit = dar[2];
      f.HAY_CNG = f.HAY_CNG | 1;
      break;
    case 1: 
      sta = dar[0];
      if(sta != ste.temp2.state){
        ste.temp2.state = sta;
        digitalWrite(po.temp2, sta);
      }
      ste.temp2.hilimit = dar[1];
      ste.temp2.lolimit = dar[2];
      f.HAY_CNG = f.HAY_CNG | 2;
      break;
    case 2: 
      sta = daa;
      if(sta==0){
        tmr.timr1 = 0;
      }
      if(sta != ste.timr1.state){
        ste.timr1.state = sta;
        digitalWrite(po.timr1, sta);
      f.HAY_CNG = f.HAY_CNG | 4;
      }
      break;
    case 3: 
      sta = daa;
      if(sta==0){
        tmr.timr2 = 0;
      }
      if(sta != ste.timr2.state){
        ste.timr2.state = sta;
        digitalWrite(po.timr2, sta);
      f.HAY_CNG = f.HAY_CNG | 8;
      }
      break;
    case 4: 
      Serial.println(srid);
      Serial.println(daa);
      Serial.println(ste.timr3.state);
      sta = daa;
      if(sta==0){
        tmr.timr3 = 0;
      }
      if(sta != ste.timr3.state){
        Serial.print("state has changed to: ");
        ste.timr3.state = sta;
        Serial.println(ste.timr3.state);
        digitalWrite(po.timr3, sta);
      f.HAY_CNG = f.HAY_CNG | 16;
      }
      break;  
    case 5: 
      if(ste.AUTOMA != daa){
        ste.AUTOMA = daa;
      f.HAY_CNG = f.HAY_CNG | 32;
      }
      break;  
    case 6:
      if (daa==1){
        eraseConfig();
        WiFi.mode(WIFI_STA);
        WiFi.disconnect();
        delay(100);  
        ste.NEEDS_RESET = daa;
      f.HAY_CNG = f.HAY_CNG | 64;
      } 
      break;  
    case 7: 
      if (daa==1){
        f.HAY_CNG = f.HAY_CNG | 128;  
        Serial.print("case 7, f.HAY_CNG = ");   
        Serial.println(f.HAY_CNG);
      } 
      break;
    default: 
      Serial.println("no data");
      break;  
  }
  NEW_MAIL=0;
  Serial.print("in deser2 HAY_CNG is: ");
  Serial.println(f.HAY_CNG) ;
}

// bool Cmd::deserialize2(char* kstr, state_t& ste, PORTS& po, TMR& tmr){
//   Serial.print("deseralize2 id: ");
//   StaticJsonBuffer<300> jsonBuffer;
//   JsonObject& rot = jsonBuffer.parseObject(kstr);
//   int srid =99;
//   //if(rot["srid"]){
//     srid = rot["id"];
//   //}
//   Serial.println(srid);
//   int dar[3];
//   int daa;
//   if(rot["darr"]){
//     JsonArray& darr = rot["darr"];
//     for(int h=0;h<darr.size();h++){
//       dar[h] = darr[h];
//     }
//   }
//   //if(rot["data"]){
//     daa = rot["data"];
//   //}
//   switch(srid){
//   bool sta;
//     case 0:
//       sta = dar[0];
//       if(sta != ste.temp1.state){
//         ste.temp1.state = sta;
//         digitalWrite(po.temp1, sta);
//       }
//       ste.temp1.hilimit = dar[1];
//       ste.temp1.lolimit = dar[2];
//       f.HAY_CNG = f.HAY_CNG | 1;
//       break;
//     case 1: 
//       sta = dar[0];
//       if(sta != ste.temp2.state){
//         ste.temp2.state = sta;
//         digitalWrite(po.temp2, sta);
//       }
//       ste.temp2.hilimit = dar[1];
//       ste.temp2.lolimit = dar[2];
//       f.HAY_CNG = f.HAY_CNG | 2;
//       break;
//     case 2: 
//       sta = daa;
//       if(sta==0){
//         tmr.timr1 = 0;
//       }
//       if(sta != ste.timr1.state){
//         ste.timr1.state = sta;
//         digitalWrite(po.timr1, sta);
//       f.HAY_CNG = f.HAY_CNG | 4;
//       }
//       break;
//     case 3: 
//       sta = daa;
//       if(sta==0){
//         tmr.timr2 = 0;
//       }
//       if(sta != ste.timr2.state){
//         ste.timr2.state = sta;
//         digitalWrite(po.timr2, sta);
//       f.HAY_CNG = f.HAY_CNG | 8;
//       }
//       break;
//     case 4: 
//       Serial.println(srid);
//       Serial.println(daa);
//       Serial.println(ste.timr3.state);
//       sta = daa;
//       if(sta==0){
//         tmr.timr3 = 0;
//       }
//       if(sta != ste.timr3.state){
//         Serial.print("state has changed to: ");
//         ste.timr3.state = sta;
//         Serial.println(ste.timr3.state);
//         digitalWrite(po.timr3, sta);
//       f.HAY_CNG = f.HAY_CNG | 16;
//       }
//       break;  
//     case 5: 
//       if(ste.AUTOMA != daa){
//         ste.AUTOMA = daa;
//       f.HAY_CNG = f.HAY_CNG | 32;
//       }
//       break;  
//     case 6:
//       if (daa==1){
//         eraseConfig();
//         WiFi.mode(WIFI_STA);
//         WiFi.disconnect();
//         delay(100);  
//         ste.NEEDS_RESET = daa;
//       f.HAY_CNG = f.HAY_CNG | 64;
//       } 
//       break;  
//     case 7: 
//       if (daa==1){
//       f.HAY_CNG = f.HAY_CNG | 128;
//       } 
//       break;
//     default: 
//       Serial.println("no data");
//       break;  
//   }
//   NEW_MAIL=0;  
// }




// void Cmd::act(STATE& st){
//   char cmdArr[][15] = {"heat", "automa", "hilimit", "lolimit", "empty"};
//   for(int i=0;i<5;i++){
//     if(heat != st.heat){
//       st.heat = heat;
//       digitalWrite(st.ALED, st.heat);
//       st.HAY_CNG=1;
//     }
//     if(automa != st.AUTOMA){
//       st.AUTOMA = automa;
//       st.HAY_CNG=1;
//     }
//     if(hilimit > 0 && hilimit != st.hilimit){
//       st.hilimit = hilimit;
//       st.HAY_CNG=1;
//     }
//     if(lolimit > 0 && lolimit != st.lolimit){
//       st.lolimit = lolimit;
//       st.HAY_CNG=1;
//     }
//     if (empty==1){
//       eraseConfig();
//       WiFi.mode(WIFI_STA);
//       WiFi.disconnect();
//       delay(100);  
//       st.NEEDS_RESET=1;    
//     }  
//     NEW_MAIL=0;    
//   }   
// }