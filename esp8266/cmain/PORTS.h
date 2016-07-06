#ifndef PORTS_h
#define PORTS_h

struct PORTS {
	int temp1; //io5d1; //ALED temp1 relay for heat on/off
	int temp2; //io16d0; 
	int timr1; //io15d8; 
	int timr2; //io13d7;
	int timr3; //io12d6;
	int ds18b20; //io4d2; //ONE_WIRE_BUS temp sensor input
	int io14d5; //spare port
};

#endif