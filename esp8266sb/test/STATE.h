#ifndef STATE_h
#define STATE_h
#include <TimeLib.h>
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
};

struct flags_t{
  bool aUTOMA;
  bool fORCErESET;  
  int cREMENT;
  int HAStIMR; //11100(28) 4,8, and 16 have timers not temp
  int IStIMERoN;//11100 assume some time left, timers with tleft>0 
  int HAYpROG;// = senrels with events>1
  int HAYpROGcNG;// 11111(31 force report) some prog change int or ext
  int HAYsTATEcNG; //11111(31 force report) some state change int or ext
  int CKaLARM; //11111 assume alarm is set at start
  int ISrELAYoN;// = summary of relay states  
  int tIMElEFT[6];// =[0,0,56,0,0] timeleft in timrs
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