#ifndef Sched_h
#define Sched_h

#include <Arduino.h>
#include "STATE.h"
#include <ArduinoJson.h>

void bm4();

class Sched{
public:
	bool deseriTime(); 
	void actTime();
	void deseriProg(char* kstr);
	void ckAlarms();
private:
	void copyProg(prg_t& t, JsonArray& ev);
	void setCur(prg_t& p, int &cur, int &nxt);
	void setTleft(prg_t p, int cur, int nxt, int &tleft);	
  time_t unix;
  const char* LLLL;
  int zone;	
};

#endif