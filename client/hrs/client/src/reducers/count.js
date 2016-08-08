const initialState = {
  number: 1
}

export const count = (state = initialState, action) => {
  if(action.type === 'INCREASE') {
    return { 
    	...state,
    	number: state.number + action.amount 
    };
  }
  else if(action.type === 'DECREASE') {
    return { 
    	...state,
    	number: state.number - action.amount 
    };
  }
  return state;
}

