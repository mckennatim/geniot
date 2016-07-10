#include "config.h"
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>


char *espssid = "espAPsb";
char ssid[40];
char pwd[24];
char devid[9];
char ip[16];
char port[5];
char ssids[500];
uint8_t idx[5];
bool NEEDS_RESET = 0;

ESP8266WebServer server(80);

uint8_t saveCfg(char cf[], uint8_t start)
{
  uint8_t fini = strlen(cf) + start;
  Serial.print("Wrote: ");
  Serial.print(fini);
  Serial.print(": ");
  for (int i = 0; i < strlen(cf); ++i){
    EEPROM.write(start+i, cf[i]);
    Serial.print(cf[i]); 
  } 
  Serial.println(); 
  return fini;
}

void showCfg()
{
  Serial.println("idx:[5]");
  Serial.print("ssid:[");
  Serial.print(idx[0]);
  Serial.print("] ");
  Serial.println(ssid);
  Serial.print("pwd:[");
  Serial.print(idx[1]);
  Serial.print("] ");
  Serial.println(pwd);
  Serial.print("devid:[");
  Serial.print(idx[2]);
  Serial.print("] ");
  Serial.println(devid);
  Serial.print("ip:[");
  Serial.print(idx[3]);
  Serial.print("] ");
  Serial.println(ip);
  Serial.print("port:[");
  Serial.print(idx[4]);
  Serial.print("] ");
  Serial.println(port);
}

void saveConfig(){
  for (int i = 0; i < 100; ++i) { EEPROM.write(i, 0); }
  idx[0]=saveCfg(ssid, 5);
  idx[1]=saveCfg(pwd, idx[0]);
  idx[2]=saveCfg(devid, idx[1]);
  idx[3]=saveCfg(ip, idx[2]);
  idx[4]=saveCfg(port, idx[3]);
  for (int i = 0; i < 5; ++i) { 
    EEPROM.write(i, idx[i]); 
  }
  EEPROM.commit();    
  showCfg(); 
  //getOnline(); 
}

void handleRoot(){
  server.send(200, "text/html", ssids);
}
//http://192.168.4.1/config?ssid=street_no_vale2&pwd=jjjjjjjj&devid=CYURD001&ip=10.0.1.104&port=3332
//http://192.168.4.1/config?ssid=Uli Fence&pwd=jjjjjjjj&devid=CYURD001&ip=10.0.1.100&port=3332
//http://192.168.4.1/config?ssid=Uli Fence&pwd=jjjjjjjj&devid=CYURD002&ip=162.217.250.109&port=3332
void handleConfig(){
  strcpy(ssid, server.arg("ssid").c_str());
  strcpy(pwd, server.arg("pwd").c_str());
  strcpy(devid, server.arg("devid").c_str());
  strcpy(ip, server.arg("ip").c_str());
  strcpy(port, server.arg("port").c_str());
  server.send(200, "application/json", "{\"Success\":\"saved to eeprom... reset to boot into new wifi\"}");
  saveConfig();
}

void eraseConfig(){
  for (int i = 0; i < 100; ++i) { EEPROM.write(i, 0); }
  EEPROM.commit();  
  ssid[0] = '\0';
  pwd[0] = '\0';
  devid[0] = '\0';
  ip[0] = '\0';
  port[0] = '\0'; 
  
  showCfg();
  Serial.println("all erased");
}

void handleErase(){
  if(server.arg("erase")=="true"){
    eraseConfig();
  }
}

void getCfg(char* s, uint8_t beg, uint8_t end){
  for (int i=0;i<end-beg;i++){
    s[i]=char(EEPROM.read(i+beg));
  }
  s[end-beg]='\0';
}

void readConfig(){
  for (int i=0; i<5;i++){idx[i]=EEPROM.read(i);}
  getCfg(ssid, 5, idx[0]);
  getCfg(pwd, idx[0], idx[1]);
  getCfg(devid, idx[1], idx[2]);
  getCfg(ip, idx[2], idx[3]);
  getCfg(port, idx[3], idx[4]);
  showCfg();
}

void getSSIDs()
{
  char str[50];
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(200);  
  int n = WiFi.scanNetworks();
  Serial.print(n);
  Serial.println(" networks found"); 
  strcpy(ssids,"{\"ssids\": [");
  char tr[n][25];
  int tr2[n][2];
  for (int i = 0; i < n; ++i){
    strcpy(tr[i],WiFi.SSID(i).c_str());
    tr2[i][0]=WiFi.RSSI(i);
    tr2[i][1]=WiFi.encryptionType(i);
  }
  for (int i = 0; i < n; ++i){
    sprintf(str,"{\"ssid\": \"%s\", \"rssi\": %d, \"enc\": %d }", tr[i], tr2[i][0], tr2[i][1]);
    //sprintf(str,"[\"ssid\": \"%s\"]",  tr[i]);
    strcat(ssids,str);
    if(i<n-1){strcat(ssids, ", ");}
  }
  strcat(ssids,"]}");
}

void setupAP(){
	WiFi.softAP(espssid);
  server.on("/", handleRoot);
  server.on("/config", handleConfig);
  server.on("/erase", handleErase);
	server.begin();
  Serial.println();
  Serial.print("connected as AP ");
  Serial.println(espssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.softAPIP()); 	
}

void getOnline(){
  readConfig();
  Serial.println(ssid);
	WiFi.begin(ssid, pwd);
  int tries =0;
  int success=1;
  while (WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");
    tries++;
    if (tries==15){
      success=0;
      Serial.println("WiFi not connected");
      getSSIDs();
      Serial.println(ssids);
      setupAP();
      NEEDS_RESET=1;
      break;
    }
  }
  if (success){
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP()); 
    Serial.println(ssid); 
    NEEDS_RESET=0;  
  } 
}