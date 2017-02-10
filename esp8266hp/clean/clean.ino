#include <EEPROM.h>
#include <ESP8266WiFi.h>

void setup(){
	Serial.begin(115200);
	EEPROM.begin(512);
	Serial.println();
	Serial.println("--------------------------");
  Serial.println("ESP8266 clean");
  Serial.println("--------------------------");
	for (int i = 0; i < 300; ++i) { EEPROM.write(i, 0); }
	EEPROM.commit();

	WiFi.mode(WIFI_STA);
	WiFi.disconnect();
	delay(100); 
}

void loop(){

}