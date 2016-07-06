#ifndef Reqs_h
#define Reqs_h

#include <PubSubClient.h>

class Reqs{
public:
  Reqs(char* devid, PubSubClient& client);
  PubSubClient cclient;
  char* cdevid;
  void stime();
private:	
	bool dog;
};

#endif