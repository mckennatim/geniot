
# geniot
A combination of cascada-mqtt and demiot. This one has the server. Its purpose is to create a general platform for iot on esp8266 over mqtt. It should be self sufficient using sbdev0's node_modules and everything should work. Currently 812K with no react code

[TOC]

## markdown reminders
[alt m] open in browser when you open the readme. Then, it should autoupdate on a save once you refresh the browser. This is because livereload is on in Windows with the C:/users/tim/appdata/local/temp/ directory added. There is also a Chrome livereload plugin installed. On sublime there is [markdown-preview](https://github.com/revolunet/sublimetext-markdown-preview) <s>and [markdownTOC](https://github.com/naokazuterada/MarkdownTOC) installed
[alt-c] tools/MarkdownTOC/update</s>
## tags
### 07-prgs-srstate-interaction
Changed the start up procedure to prevent aUTOMA, CKaLARM and HAYsTATEcNG from getting set until the device gets the current time from the server. (PUZZLE is why sched.desiriTime() cant call actTime(), both have to be called separately from req.processInc().) Sending `one prog` from client places the device in the correct program for the time and changes the state to reflect that.
### 06-static-const-char-scribedTo
Yes there is a way to have an initialized device customized mostly by changes to STATE.h even including arrays of strings that can be shared among classes and files.
in STATE.h

    struct labels_t {
      static const char* scribedTo[]; 
      static const int numcmds;
    };
in STATE.cpp

    const char* labels_t::scribedTo[] ={"devtime", "cmd", "prg", "req", "set", "progs"};
    const int labels_t::numcmds =6;//
in .ino declare as 

    labels_t la;
and then wherever you want access to `la.scribedTo[]` just 

    #include "STATE.h"
    extern labels_t la;



### 05-incrbuild
test.ino + config, MQclient and Reqs

#### callback limitations
  Serial.println(ipayload2);
if a external package has a callback signature builtin as a function, you cannot replace it with a class method. That is the case for `PubSubClient client(espClient);` and `Alarm.alarmOnce(hour(), minute()+1,9,bm2)`
### 04-ckAlarms-pubProg-in-test.ino
### 03-refactoring-continued
#### on the interaction between progs and srstate
example state:  

    {id:0,darr:[temp,state,hilimit,lolimit]}
    {id:2,darr:[state]}

example prg:

     {id:0, id:255, ev:2, numdata:2, prg:[[0,0,72,70],[6,39,92,64], [8,45,87,87]]}   
     {id:2, id:255, ev:2, numdata:1, prg:[[0,0,0],[6,39,1], [8,45,0]]} 
##### option-require prg:[0,0,def[0],def[1]]
Require client to provide current defaults in the form of

     {id:0, id:255, ev:3, numdata:2, prg:[[0,0,84,72], [6,39,92,64], [8,45,87,87]]}   
     {id:2, id:255, ev:3, numdata:1, prg:[[0,0,1], [6,39,1], [8,45,0]]} 
###### ckAlarms()(3)
    void sched::ckAlarms(prgs_t& prgs, flags_t& f, state_t& state)    {
      if((f.CKaLARM & 4) == 4){
        f.CKaLARM=f.CKaLARM & 27; //11011 turnoff CKaLARM for 4
        prg_t& p = progs.timr2;
        tmr_t& s = state.timr2;
        int id =2;
        int bit =4
        int cur, nxt;
        setCur(p.prg, cur, nxt);
        int tleft=0;
        //for timers
        s.state = p[cur][2];
        f.ISrELAYoN = f.ISrELAYoN | s.state;
        if (s.state){ //if relay is on
           setTleft(p, cur, nxt, tleft)
           f.IStIMERoN = f.IStIMERoN | bit;
        }
        f.tIMElEFT[id]=tleft;
        int asec = second()+1;        
        Alarm.alarmOnce(p[nxt][0],p[nxt][1], asec, bm8);        
      }
    }
####### calculating tleft
Is it from current time to next program if relay is on? If nxt=0 is it from current time til midnight? 

    void sched::setTleft(prg_t p, int cur, int nxt, int &tleft){
      int hr = hour();
      int min - minute();
      if(nxt==0){
        tleft = (23-hr)*60+(59-min) +1;
      }else{
        int nxthr = p.prg[nxt][0];
        int nxtmin = p.prg[nxt][1];
        if(nxtmin < min){//12:25 -> 14:05
          nxtmin=nxtmin+60
          nxthr--;
      }
      tleft= (nxthr-hr)*60 + (nxtmin - min)
    }
    void sched::setCur(prg_t& p, int &cur, int &nxt){
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
##### option-patch in for 00:00     

Should there be defaults or yesterdays? `{id:0,def:[hilimit, lolimit]}`,  `{id:2,[relay]}`? How would it work? Insert

[
[0,0,defhi,deflo],
[6,39,92,64], 
[8,45,87,87],
[23,59,defhi,deflo]] 

[functions used](#loop) are `ckAlarms(), pubFlags(), pubState(), updTimers(), desiriProg(), copyProg(), setCur(), pubPrg()`

###### ckAlarms()(2)
   

    void sched::ckAlarms(prgs_t& prgs, flags_t& f, state_t& state)    {
      if((f.ckalarms & 4) == 4){
        f.ckalarms=f.ckalarms & 27; //11011 turnoff ckalarms for 4
        prg_t p = progs.timr2&;
        tmr_t s = state.timr2&;
        int id =2;
        int bit =4
        int arr[p.ev+2][p.numdata+1];
        arr[0]=[0,0,s.def[0],s.def[1]];
        for (int i=0; i<p.ev;i++){
          arr[i+1]=p[i];
        }
        int cur, nxt;
        setCur(arr, cur, nxt);
        int tleft=0;
        //for timers
        s.state = p[cur][2];
        if (s.state){ //if relay is on
           setTleft(arr, cur, nxt, tleft)
           f.IStIMERoN = f.IStIMERoN | bit;
        }
        f.tIMElEFT[id]=tleft;
        int asec = second()+1;        
        Alarm.alarmOnce(p[nxt][0],p[nxt][1], asec, bm8);        
      }
    }


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

- flags: NEW_ALARM, and IS_ON (applies only to timers)
- methods: deseriProgs, actProgs2 ,bm callbacks, updateTmrs

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
      bool aUTOMA;
      bool fORCErESET;  
      int cREMENT;
      int HAStIMR; //11100(28) 4,8, and 16 have timers not temp
      int IStIMERoN;//11100 assume some time left, timers with tleft>0 
      int HAYpROG;// = senrels with events>1
      int HAYpROGcNG;// 11111(31 force report) some prog change int or ext
      int HAYsTATEcNG; 11111(31 force report) some state change int or ext
      int CKaLARM; 11111 assume alarm is set at start
      int ISrELAYoN;// = summary of relay states  
      int tIMElEFT[6];// =[0,0,56,0,0] timeleft in timrs
    };
    init {1,0,5,28,28,0,31,0,{0,0,0,0,0}}

##### loop

    time_t before = 0;
    time_t schedcrement = 0;
    time_t inow;
    if (f.CKaLARM>0){
      sched.ckAlarms(prgs,state,f); //whatever gets scheduled should publish its update
      pubFlags();
      pubPrg(f.CKaLARM);
      f.CKaLARM=f.CKaLARM & 0; //11110 turnoff CKaLARM for 1
    }
    inow = millis();
    if(inow-schedcrement > f.cREMENT*1000){
      schedcrement = inow;
      if(f.IStIMERoN > 0){
        sched.updTimers();
        pubFlags();
      }
    }
    if (f.HAYsTATEcNG>0){
      pubState(f.HAYsTATEcNG)
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

##### processIncoming prg   

        case 2://in prg
          Serial.println(ipayload);
          sched.deseriProg(prgs,ipayload);
          NEW_MAIL =0;
          break;

`case ` deseriProg might change prgs.timr2.prg to `{2,255,2,1,{{12,57,1}, 14,20,0}}` and then set `f.ckalarms=f.ckalarms | 4`

on next loop sched.checkAlarms() get run

##### sched::ckAlarms(prgs_t& prgs, flags_t& f)
    void sched::ckAlarms(prgs_t& prgs, flags_t& f)    {
      if((f.ckalarms & 4) == 4){
        f.ckalarms=f.ckalarms & 27; //11011 turnoff ckalarms for 4
        int cur, nxt;
        setCur(prgs.timr2, cur, nxt);
        if ((f.ISrELAYoN & 4) ==4){ //if relay is on
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
#### how to pass a JsonArray& to a function
##### ans
Don't forget to define the function as sched::the function() in the .cpp file
https://latedev.wordpress.com/2014/04/22/common-c-error-messages-2-unresolved-reference/

#### initial thoughts on design of deseriProg() and copyProg()

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

##### proof of concept step1

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
### 01-initial_commit


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