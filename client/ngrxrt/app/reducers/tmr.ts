export const tmr = (state={}, action) => {
	switch (action.type){
		case "UPDATE_TMR" :
			return Object.assign({}, action.payload)
    default:
      return state;		
	}
}