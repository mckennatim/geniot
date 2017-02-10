#ifndef config_h
#define config_h

	#include <ESP8266WiFi.h>
	#include <ESP8266WebServer.h>
	extern ESP8266WebServer server;
	extern char devid[9];
	extern char ip[16];
	extern char port[5];
	extern void eraseConfig();
	extern bool NEEDS_RESET;
	void getOnline();

#endif