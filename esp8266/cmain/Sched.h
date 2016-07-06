#ifndef Sched_h
#define Sched_h

#include "STATE.h"
#include "PORTS.h"
#include "TMR.h"
#include <Arduino.h>
#include <PubSubClient.h>

void cbtmr1();
void cbtmr2();
void cbtemp1();
void abdd();
void bm32();
void bm16();
void bm8();
void bm4();
void bm2();
void bm1();
extern int NEW_ALARM;
extern int IS_ON;

class Sched{
public:
	bool deserialize(char* kstr); 
	void actTime(STATE& st);
	void printSched(int i);
	bool deseriProgs(char* kstr); 
	void bootstrapSched();
	void resetAlarm(int i, int &cur, int &nxt);
	void actProgs2(TMR& tmr, state_t& ste, flags_t& f);
	int idxOsenrels(int j);
	void updateTmrs(TMR& tmr, PubSubClient& client, PORTS& po, state_t& ste, flags_t& f);
	//allocate  for 8 sensor/relays with 6 scheduled events/day and 
	// hr, min + 2 settings they can affect
	int nsr; //number of programs
	int seresz; //sizeof senrels
	int progs[8][8][6]; //max 8 programs, w 6 events and 4 things set
	int senrels[8];//[0,99,1]
	int events[6];
	int haynRset[8];
	int crement;
private:
  time_t unix;
  const char* LLLL;
  int zone;
};

#endif