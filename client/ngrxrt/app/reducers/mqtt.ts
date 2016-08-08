let initialState = {
	subsys: ["temp1", "temp2", "timr1", "timr2", "timr3"],
	temp1: { name: "temp1", val: 0 },
	temp2: { name: "temp2", val: 0 },
	timr1: { name: "timr1", val: 0 },
	timr2: { name: "timr2", val: 0 },
	timr3: { name: "timr3", val: 0 },
	general: {
		auto: 1, 
		crement: 5,
		numtmrs: 3, 
		devid: "",
		devzone: -4,
		IS_ON: 0, 
		incom: ["status", "tmr", "progs", "devtime"],
		outgo: ["presence", "sched", "cmd", "time" ]
	}
}



export const mqtt = (state = initialState, action) => {
	switch (action.type) {
		case "UPDATE_STATUS":
			let stst = Object.assign({},state)
			stst.temp1.val = action.payload.temp1
			stst.temp2.val = action.payload.temp2
			stst.temp1.state = action.payload.heat
			stst.temp1.hilimit = action.payload.hilimit
			stst.temp1.lolimit = action.payload.lolimit
			stst.general.auto = action.payload.auto
			return stst
		case "UPDATE_TMR":
			let tmst = Object.assign({}, state)
			tmst.timr1.val = action.payload.timr1
			tmst.timr2.val = action.payload.timr2
			tmst.timr3.val = action.payload.timr3
			tmst.general.numtmrs = action.payload.numtmrs
			tmst.general.crement = action.payload.crement
			tmst.general.IS_ON = action.payload.IS_ON
			return tmst
		case "UPDATE_PROGS":
			let prst = Object.assign({}, state)
			let progs = action.payload.progs
			let serels = action.payload.serels
			let x = serels.map((p,i)=>{
				if(p!=99){
					prst[prst.subsys[i]].prog = progs[p]
				}
			})
			prst.serels = action.payload.serels;
			prst.general.crement = action.payload.crement
			return prst
		default:
			return state	
	}
}

let statusF = { "temp1": 76, "temp2": 77, "heat": 0, "hilimit": 82, "lolimit": 73, "auto": 1 }
let tmrF = { "timr1": 115, "timr2": 0, "timr3": 55, "numtmrs": 3, "crement": 5, "IS_ON": 0 }
let progsF = {
	"crement": 5,
	"serels": [0, 99, 1, 2],
	"progs": [
		[[0, 0, 80, 77], [6, 12, 82, 75], [8, 20, 85, 78], [12, 49, 78, 74], [13, 4, 83, 79]],
		[[0, 0, 58], [18, 0, 68], [21, 30, 58]],
		[[0, 0, 0], [12, 49, 1], [13, 4, 0]]]
}
let devtimeF = {
	"unix": 1464368701,
	"LLLL": "Friday, May 27, 2016 1:05 PM",
	"zone": -4
}