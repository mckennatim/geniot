# geniot
A combination of cascada-mqtt and demiot. This one has the server. Its purpose is to create a general platform for iot on esp8266 over mqtt. It should be self sufficient using sbdev0's node_modules and everything should work. Currently 812K with no react code

##tags
### 02-desiriProgs_copyProg
todo: add cmd to report out prog values

had some linking troubles that were actually about neglecting to put `Sched::` in front of `copyProg()`

    void Sched::copyProg(prg_t& t, JsonArray& ev){
      for(int h=0;h<ev.size();h++){
        JsonArray& aprg = ev[h];
        aprg.printTo(Serial);
        for(int j=0;j<t.numdata+2;j++){
          t.prg[h][j] = aprg[j];
          Serial.print(t.prg[h][j]);
        }
      }        
    }

    void Sched::deseriProg(prgs_t& prgs, char* kstr){
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
### how to pass a JsonArray& to a function
give an input`{"id": 0, "pro":[[0,0,0,84,64],[6,30,1,84,70]]}`

I would like to have my function that decodes the input to be able to call a function with a signature something like this 
`void copyProg(prg_t& t, JsonArray& ev)`

I can hardcode it without a function call and it works fine. Once I have `id` I'd like to copy the `pro` array into id=0's data structure. 

    void Sched::deseriProg(prgs_t& prgs, char* kstr){
      StaticJsonBuffer<300> jsonBuffer;
      JsonObject& rot = jsonBuffer.parseObject(kstr);
      int id = rot["id"];
      JsonArray& events = rot["pro"];
      for(int h=0;h<events.size();h++){
        JsonArray& aprg = events[h];
        aprg.printTo(Serial);
        for(int j=0;j<prgs.temp1.numdata+2;j++){
          prgs.temp1.prg[h][j] = aprg[j];
          Serial.print(prgs.temp1.prg[h][j]);
        }
      }

But when I try to pull the loop into a function

    void copyProg(prg_t& t, JsonArray& ev){
      for(int h=0;h<ev.size();h++){
        JsonArray& aprg = ev[h];
        for(int j=0;j<t.numdata+2;j++){
          t.prg[h][j] = aprg[j];
        }
      }        
    }

and call it from here

    void Sched::deseriProg(prgs_t& prgs, char* kstr){
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
       ...
       default:
          Serial.println("in default");
      }     

I get errors compiling with 1.67 on esp8266 Wemos D1 mini

    sketch\Sched.cpp.o: In function `Sched::printSched(int)':
    sketch/Sched.cpp:502: undefined reference to `Sched::copyProg(prg_t&, ArduinoJson::JsonArray&)'

    sketch\Sched.cpp.o: In function `get<int>':

    sketch/Sched.cpp:502: undefined reference to `Sched::copyProg(prg_t&, ArduinoJson::JsonArray&)'

    collect2.exe: error: ld returned 1 exit status

I am sure this is my issue in not understanding `JsonArray&` but still I'd love some help.    
#### ans
It looks like you are having a linking error which is probably unrelated to JsonArray itself. The line:

sketch/Sched.cpp:502: undefined reference to `Sched::copyProg(prg_t&, ArduinoJson::JsonArray&)'
indicates that the Arduino compiler thinks that you should have declared a function with the signature
Sched::copyProg(prg_t&, ArduinoJson::JsonArray&) but it was unable to find it in your code. There could be many reasons for this.

For example:
1) Your copyProg function was included in the class Sched declaration, but was defined as a standalone function (the compiler wants to use Sched::copyProg(), but you defined copyProg()).
2) Your copyProg function has a slightly different signature than the one that you called (perhaps one of the types was slightly mismatched).

Here is some more information on undefined reference errors:
https://latedev.wordpress.com/2014/04/22/common-c-error-messages-2-unresolved-reference/
So there is a data structure for a prog getting sent into the device

    {"id": 0, "pro":[[0,0,0,84,64],[6,30,1,84,70]]}

and there is a data structure of all the progs currently in the device

each day there is are new progs sent in

a flag is set if a senrel has a prog

progs comming in are deseralized and sent to the proper struct (cmd and status are doing this like so)
Pkt CYURD002/status {"id":0, "darr":[-196, 1, 1073681984, 1075879113]}
Pkt CYURD002/status {"id":1, "darr":[-196, 0, 90, 60]}
Pkt CYURD002/status {"id":2, "darr":[0]}
Pkt CYURD002/status {"id":3, "darr":[0]}
Pkt CYURD002/status {"id":4, "darr":[1]}
Pkt CYURD002/status {"id":5, "data":1}
Pkt CYURD002/status {"id":6, "data":0}
Pkt CYURD002/status {"id":7, "data":0}

so a prog looks like this 

    prgs_t prgs;
    void initProgs(){
      prgs = {
      {0,0,3,{{0,0,0,84,64}}},
      {0,0,3,{{0,0,0,84,64}}},
      {2,0,1,{{0,0,0}}},
      {3,0,1,{{0,0,0}}},
      {4,0,1,{{0,0,0}}}};
    }

    struct prg_t{
      int id;
      int ev;
      int numdat;
      int[6][5] prg;//max 6 events [hr,min,max 3 data]
    };
    struct prgs_t{
      prg_t temp1;
      prg_t temp2;
      prg_t timr1;
      prg_t timr2;
      prg_t timr3;
    };

    {"id": 0, "pro":[[0,0,0,84,64],[6,30,1,84,70]]}
    {"id": 2, "pro":[[0,0,0],[6,30,1]]}

proof of concept step1

    void Sched::deseriProg(prgs_t& prgs, char* kstr){
      StaticJsonBuffer<300> jsonBuffer;
      JsonObject& rot = jsonBuffer.parseObject(kstr);
      int id =99;
      id = rot["id"];
      JsonArray& events = rot["pro"];
      for(int h=0;h<events.size();h++){
        JsonArray& aprg = events[h];
        aprg.prettyPrintTo(Serial);
        for(int j=0;j<prgs.temp1.numdata+2;j++){
        }
      }


    void copyProg(prg_t& t, JsonArray& ev){
      for(int h=0;h<ev.size();h++){
        for(int j=0;j<t.numdata+2;j++){
          JsonArray& aprg = ev[h];
          t.prg[h,j] = aprg[j];
        }
      }        
    }
    bool Sched::deseriProg(prgs_t& prgs, char* kstr){
      StaticJsonBuffer<300> jsonBuffer;
      JsonObject& rot = jsonBuffer.parseObject(kstr);
      int id =99;
      id = rot["id"];
      JsonArray& events = rot["pro"];
      switch(id){
        case 0:
          copyProgs(prgs.temp1, events);          
          break;
        case 1:
          copyProgs(prgs.temp2, events);          
          break;
        case 2:
          copyProgs(prgs.timr1, events);          
          break;
        case 3:
          copyProgs(prgs.timr2, events);          
          break;
        case 4:
          copyProgs(prgs.timr3, events);          
          break;
      }      
    }
progs affect state and so do cmds
parsing that would 
* set f.isprog = f.isprog | 8
* 

fix one command
## 01-initial_commit


OK so what about overrides
* a boost is OK, it just fits into the daily program
* a hold sets a value and wipes out (1 or more) days program
* bridge on wipes out the program and sets the relay on
* bridge timer on inserts itself into whatever program is running
* bridge off wipes out he program and sets the relay off forever? for one day? OK so you set a watering schedule and turn on the taps. It runs every day taps on or taps off. But then you turn the taps off and want to just leave the relays on. Any time you go to use the water it goes on. Maybe it should never be off, only timed or on? Off just sets to off till the next program cycle, Off is a kind of unboost til next. If there is no progam, day to day it should remember the last state. So maybe a flag and a memory

    {name: 'temp1', id:0, hayprog: 1, yesterday: [84,62]}
    {id:1, hayprog: 0, yesterday: [0]}
    {id:2, hayprog: 0, yesterday: [1]}
    {id:3, hayprog: 1, yesterday: [84,62]}
    {id:4, hayprog: 1, yesterday: [84,62]}
or

    [
    [1,[84,62]],
    [0,62,32]
    [1, [1]]    
or

    struct overall_t{
      bool AUTOMA;
      bool NEEDS_RESET;  
      int crement;
      int isprog = 10110
      int isrunning = 00100
      int relayis = 00011  
      int[5] tleft =[0,0,56,0,0]     
      int[5] pdata =[3,3,1,1,1]     
    }

    struct state_t{
      temp_t temp1;
      temp_t temp2;
      timr_t timr1;
      timr_t timr2;
      timr_t timr3;
  
    };    
    struct temp_t {
      int temp;
      bool state;
      int hilimit;
      int lolimit;
      int[2]: yesterday 
    };    

    struct timr_t{
      bool state;
      int[1]: yesterday;
    };



#####take 1: random thoughts
If there are no programs it should run and be OK.
If there are it should deal. any time a program comes in it should be stored, published and actedON.

ActingOn a program sets a timer if need be????
* there is always a 0:0, or is there. How should you know? If there is an array it could have zeros or could be full of crap. perhaps a flag should be set whenever there is a program {1,0,1,1,0} 
* you can replace a program or delete it or create one
* it could be a simple timer or a 6 part schedule
* there may not be a next. If there is no next don't do anything
* 
ActOn finds out where in the daily schedule you are(either at the next scheduled time or just jumped in at startup or when a new program is entered), sets the relays and setpoints that would be on then, and sets an alarm that will go off at the next scheduled time

Every time an alarm finishes there is a callback.

Setting a flag that get checked every second causes 
if progs[8][4][6]
what does it do? I don't know
what should it do?
* intialize a prog array to zero on startup
* 
sending partial progs doesn't work. Intializing the sched::progs array helped but the prog not sent still has garbaage in minutes and value

    12:59
    countdown tmr3 is OFF
    next countdown timr3 is set for: 0:1074796819->8704

updateTimers changes IS_ON

        switch(job){
          var newstate = Object.assign({}, this.state)
          case "status":
            switch(plo.id){
              case 3:
                console.log('state of relay3: ' + plo.darr[0]);
                could be on, off or timed(on)
                if on 
                  if timr>0 then timer 
                  else on
                else off  




###Server 
* is mirrored on sitebuilt.net /var/www/geniot/server/lib 

`forever start ./appsServers2start.json`

    {
        //geniot exp:3332, ws:3333, mqtt:1883
        "uid": "geniot",
        "append": true,
        "watch": true,
        "script": "index.js",
        "sourceDir": "/var/www/geniot/server/lib"
    }

logs at  `tail -f /root/.forever/geniot.log`   Just copy lib directory to update