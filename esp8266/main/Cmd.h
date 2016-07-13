#ifndef Cmd_h
#define Cmd_h

#include "STATE.h"
#include "PORTS.h"
#include "TMR.h"

class Cmd{
public:
	bool deseriCmd(char* kstr, state_t& ste, PORTS& po, TMR& tmr, flags_t& f); 
	bool deseriReq(char* kstr, flags_t& f);	
private:
  bool heat;
  bool automa;
  int hilimit;
  int lolimit;
  bool empty;		
};

#endif