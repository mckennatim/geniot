#ifndef Cmd_h
#define Cmd_h

#include "STATE.h"
#include "PORTS.h"
#include "TMR.h"

class Cmd{
public:
	bool deserialize(char* kstr); 
	bool deserialize2(char* kstr, state_t& ste, PORTS& po, TMR& tmr, flags_t& f); 
	void act(STATE& st);
private:
  bool heat;
  bool automa;
  int hilimit;
  int lolimit;
  bool empty;		
};

#endif