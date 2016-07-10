#include "Reqs.h"
#include <Arduino.h>
#include <TimeLib.h>
#include <PubSubClient.h>

Reqs::Reqs(char* devid, PubSubClient& client ){
  cdevid = devid;
  cclient = client;
}

void Reqs::stime(){
	char* dd = "the time is being requested";
	Serial.println(dd);
	char time[20];
	strcpy(time,cdevid);
	strcat(time,"/time");
  if (cclient.connected()){
    cclient.publish(time, dd, true);
  }		
}



