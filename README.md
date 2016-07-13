# geniot
A combination of cascada-mqtt and demiot. This one has the server. Its purpose is to create a general platform for iot on esp8266 over mqtt. It should be self sufficient using sbdev0's node_modules and everything should work. Currently 812K with no react code

<!-- MarkdownTOC -->

- [markdown reminders](#markdown-reminders)
- [tags](#tags)
  - [03-refactoring continued](#03-refactoring-continued)
  - [02-desiriProgs_copyProg](#02-desiriprogs_copyprog)
    - [current prog operation in general](#current-prog-operation-in-general)
    - [internals of actProgs2,resetAlarm](#internals-of-actprogs2resetalarm)
    - [new version](#new-version)
      - [flags](#flags)
      - [loop](#loop)
      - [init](#init)
      - [processIncoming prg](#processincoming-prg)
      - [sched.ckAlarms\(prgs_t& prgs, flags_t& f\)](#schedckalarmsprgs_t-prgs-flags_t-f)
  - [how to pass a JsonArray& to a function](#how-to-pass-a-jsonarray-to-a-function)
    - [ans](#ans)
- [01-initial_commit](#01-initial_commit)
    - [OK so what about overrides bud](#ok-so-what-about-overrides-bud)
      - [take 1: random thoughts](#take-1-random-thoughts)
- [Server](#server)

<!-- /MarkdownTOC -->

## markdown reminders
[alt m] open in browser when you open the readme. Then, it should autoupdate on a save once you refresh the browser. This is because livereload is on in Windows with the C:/users/tim/appdata/local/temp/ directory added. There is also a Chrome livereload plugin installed. On sublime there is markdown-preview and [markdownTOC](https://github.com/naokazuterada/MarkdownTOC) installed
[alt-c] tools/MarkdownTOC/update
## tags
### 03-refactoring continued
esp8266 should be listening for
* cmd that change the state
* prg that changes a program
* set that changes machine settings
* req for info on ovstate, srstates, progs 
* devtime to update time on device from server

subscriptions are set in MQclient.cpp

    ...
    char req[25];
    strcpy(req, cdevid);
    strcat(req,"/req");
    client.subscribe(cmd);
    client.subscribe(devtime);
    client.subscribe(progs);//deprecated
    client.subscribe(prg);
    client.subscribe(req);

req
`{\"id\":0, \"req\":"srstates"}`
`{\"id\":1, \"req\":"progs"}`
`{\"id\":2, \"req\":"flags"}`



esp8266 should be publishing
* srstates state of relays and sensors
* srtate state of one senrel
* progs all programs
* prog of one senrel
* ovstate general setting and state of flags

again, what is the interaction between cmd and prg?
[considering timer vs on/off for cascada][OK so what about overrides]

### 02-desiriProgs_copyProg
OK so after a prog is writtens to progs, then what? How does it work now.

#### current prog operation in general
players 
* flags: NEW_ALARM, and IS_ON (applies only to timers)
* methods: deseriProgs, actProgs2 ,bm callbacks, updateTmrs

Every time the programs are changed they are cleared with Alarm.clear().

So every time I change on senrels program, I have to clear the alarms and reset the progs of all the other senrels too.

NEW_ALARM = 31 tells asctProgs2 to intialize all 5 senrels. As each senrel is acted upon NEW_ALARM for that bit gets turned off. If an alarm has been set, its callback resets the NEW_ALARM (and IS_ON) bit so actProg2 can be called again. On every loop NEW_ALARM is checked.

Also on every 5 (tmr.crement) seconds in the loop IS_ON is checked to see if timers are running. If so then updateTmrs is run.

updateTimers is independent of actProgs2 and just takes 5 seconds off each running timr and sets a local var hi or low depending if timr still has time on it. If the relay is differrent from hl then it is switched.

after and anytime update timers is run then tmr is published
??? should IS_ON only be set for timrs or also for temp???
temp is more autonomous and passive. It adds nothing to report that 'yep 4 hrs to go til the tstat is set at 64' every 5 seconds. 

#### internals of actProgs2,resetAlarm

Again actProgs run if NEW_ALARM bit flag is set for it and it is turned off right away. Then actProgs2 
* checks the current time
* calls resetAlarm(int i, int &cur, int &nxt) with a weird address of int parameter. It sends back the index of which event is is cur in and which event is nxt(or nxt=0 if no more events).
* current settings are updated (things like himit, olimit, relay)
* alarm is set with next values for hr, min and settings

#### new version 
sd
##### flags

    struct flags_t{
      bool AUTOMA;
      bool NEEDS_RESET;  
      int crement;
      int hastimr; //11100(28) 4,8, and 16 have timers not temp
      int istimeron;//11100 assume some time left, timers with tleft>0 
      int hayprog;// = senrels with events>0
      int haystatecng; 11111(31 force report) some state change int or ext
      int ckalarm; 11111 assume alarm is set at start
      int isrelayon;// = summary of relay states  
      int tleft[6];// =[0,0,56,0,0] timeleft in timrs
    };
    init {1,0,5,28,28,0,31,0,{0,0,0,0,0}}

##### loop

    time_t before = 0;
    time_t schedcrement = 0;
    time_t inow;
    if (f.ckalarms>0){
      sched.ckAlarms(); //whatever gets scheduled should publish its update
      pubFlags();
    }
    inow = millis();
    if(inow-schedcrement > f.crement*1000){
      schedcrement = inow;
      if(f.istimeron > 0){
        sched.updTimers();
        pubFlags();
      }
    }
    if (f.haystatecng>0){
      pubState(f.haystatecng)
    }    

##### init

    struct prg_t{
      int id;
      AlarmId aid;
      int ev;
      int numdata;
      int prg[6][5];//max 6 events [hr,min,max 3 data]
    };   

    struct prgs_t{
      prg_t temp1;
      prg_t temp2;
      prg_t timr1;
      prg_t timr2;
      prg_t timr3;
    };

    prgs_t prgs;
    void initProgs(){
      prgs = {
      {1,255,0,3,{}},
      {2,255,0,1,{}},
      {3,255,0,1,{}},
      {4,255,0,1,{}}};
      {0,255,0,3,{}},
      f = {1,0,5,28,0,31,31,0,{0,0,0,0,0}}
    } 

##### processIncoming prg   

        case 2://in prg
          Serial.println(ipayload);
          sched.deseriProg(prgs,ipayload);
          NEW_MAIL =0;
          break;

`case ` deseriProg might change prgs.timr2.prg to `{2,255,2,1,{{12,57,1}, 14,20,0}}` and then set `f.ckalarms=f.ckalarms | 4`

on next loop sched.checkAlarms() get run

##### sched.ckAlarms(prgs_t& prgs, flags_t& f)
    {
      if((f.ckalarms & 4) == 4){
        f.ckalarms=f.ckalarms & 27; //11011 turnoff ckalarms for 4
        int cur, nxt;
        setCur(prgs.timr2, cur, nxt);
        if ((f.isrelayon & 4) ==4){ //if relay is on

        }
      }
    }


    prgs = {
      {0,255,0,3,{}},
      {1,255,0,3,{}},
      {2,255,2,1,{{12,57,1}, 14,20,0}},//2events turn on for some time then off
      {3,255,0,1,{}},
      {4,255,0,1,{}}};
    }
    

How do you clear just the alarm for the senrel you are (re)programming?
Include a AlarmId aid in prgs_t structure, store an AlarmId in progs.tmr1.aid,
then free(progs.tmr1.aid) and prgs.tmr1.aid = dtINVALID_ALARM_ID; whenever we set it.

How does it work? 

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
## [01-initial_commit](#01-initial_commit)


#### OK so what about overrides bud
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



##### take 1: random thoughts
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




## Server 
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