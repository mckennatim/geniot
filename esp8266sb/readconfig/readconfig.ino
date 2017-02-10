#include <EEPROM.h>
char newip[] ="192.168.0.26";
//char newip[] ="10.0.1.100";
//char newip[] ="162.217.250.109";
char newdevid[] = "CYURD001";
char newssid[] = "CenturyLink6185";
char newport[] = "8332";
char newpwd[] = "jamesett";

uint8_t idx[5];
char ssid[40];
char pwd[24];
char devid[9];
char ip[16];
char port[5];

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

void saveConfig(){
  for (int i = 0; i < 100; ++i) { EEPROM.write(i, 0); }
  idx[0]=saveCfg(newssid, 5);
  idx[1]=saveCfg(newpwd, idx[0]);
  idx[2]=saveCfg(newdevid, idx[1]);
  idx[3]=saveCfg(newip, idx[2]);
  idx[4]=saveCfg(newport, idx[3]);
  for (int i = 0; i < 5; ++i) { 
    EEPROM.write(i, idx[i]); 
  }
  EEPROM.commit();    
  showCfg(); 
  //getOnline(); 
}

void setup(){
	Serial.begin(115200);
	EEPROM.begin(512);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 readconfig");
  Serial.println("--------------------------");	
	readConfig();
	saveConfig();
	readConfig();
}

void loop(){

}
