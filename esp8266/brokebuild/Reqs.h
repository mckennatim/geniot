#ifndef Reqs_h
#define Reqs_h

#include <PubSubClient.h>
#include "STATE.h"

class Reqs{
public:
  Reqs(char* devid, PubSubClient& client);
  PubSubClient cclient;
  char* cdevid;
  void stime();
	void pubFlags(flags_t& f);
	void pubPrg(prgs_t& prgs, int ck);
	void pubState(int hc);
	void processInc();  
private:	
	bool dog;
	void creaJson(prg_t& p, char* astr);
	void clpub(char status[20], char astr[120]);
};

#endif