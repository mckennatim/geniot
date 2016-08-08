export const status = (state = {}, action) => {
	switch (action.type) {
		case "UPDATE_STATUS":
			return Object.assign({}, action.payload)
		default:
			return state;
	}
}