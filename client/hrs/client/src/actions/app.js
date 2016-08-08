const setDeviceType = (devInfo) => {
	console.log(devInfo)
	return {
		type: 'SET_DEVICE',
		devInfo
	}
}

export {setDeviceType};