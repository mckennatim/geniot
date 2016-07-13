#ifndef STATE_h
#define STATE_h

#include <TimeAlarms.h>

struct temp_t {
	int temp;
	bool state;
	int hilimit;
	int lolimit;
};

struct timr_t{
	bool state;
};

struct state_t{
	temp_t temp1;
	temp_t temp2;
	timr_t timr1;
	timr_t timr2;
	timr_t timr3;
	bool AUTOMA;
  bool NEEDS_RESET;  
	bool sndSched;
};

struct flags_t{
	int HAY_CNG;
  bool AUTOMA;
  bool NEEDS_RESET;  
  int crement;
  int isprog;// = 10110
  int istimron;// = 00100
  int isrelayon;// = 00011  
  int tleft[6];// =[0,0,56,0,0] 	
};

struct overall_t{
  bool AUTOMA;
  bool NEEDS_RESET;  
  int crement;
  int isprog;// = 10110
  int isrunning;// = 00100
  int isrelayon;// = 00011  
  int tleft[6];// =[0,0,56,0,0]     
};

struct prg_t{
  int id;
  AlarmId aid;
  int ev;
  int numdata;
  int prg[6][5];//max 6 events [hr,min,max 3 data]
};
struct prgs_t{
  prg_t temp1;
  prg_t temp2;
  prg_t timr1;
  prg_t timr2;
  prg_t timr3;
};

#endif