# geniot
A combination of cascada-mqtt and demiot. This one has the server. Its purpose is to create a general platform for iot on esp8266 over mqtt. It should be self sufficient using sbdev0's node_modules and everything should work. Currently 812K with no react code

##tags
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
      int[6] tleft =[0,0,56,0,0]     
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
ActOn fids out where in the daily schedule you are(either at the next scheduled time or just jumped in at startup or when a new program is entered), sets the relays and setpoints that would be on then, and sets an alarm that will go off at the next scheduled time

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