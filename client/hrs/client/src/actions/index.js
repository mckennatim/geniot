import fetch from 'isomorphic-fetch'
import {increase, decrease} from './count'
import {fetchAddr, selAddr, fetchUnverified, setUnverSel, postUnverCompl, postUnverified, setDone, fetchVerified, recAddr, setVerSel} from './verify'
import {setDeviceType} from './app'



export {increase, decrease, fetchAddr, selAddr, recAddr,
	fetchUnverified, setDeviceType, setUnverSel, postUnverCompl,
	postUnverified, setDone, fetchVerified, setVerSel};