#ifndef Sched_h
#define Sched_h

#include <Arduino.h>
#include "STATE.h"
#include <ArduinoJson.h>

void bm1();
void bm2();
void bm4();
void bm8();
void bm16();

class Sched{
public:
	void updTimers();
	bool deseriTime(); 
	void deseriProg(char* kstr);
	void ckAlarms();
	void actTime();
private:
	void deductCrement(int id);
	void copyProg(prg_t& t, JsonArray& ev);
	void setCur(prg_t& p, int &cur, int &nxt);
	void setTleft(prg_t p, int cur, int nxt, int &tleft);	
  time_t unix;
  const char* LLLL;
  int zone;	
};

#endif