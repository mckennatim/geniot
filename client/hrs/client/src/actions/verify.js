import fetch from 'isomorphic-fetch'
import superagent from 'superagent'

const reqAddr = (raw) => {
	console.log(raw)
	return {
		type: 'REQ_ADDR',
		raw
	}
}

const recAddr = (json) => {
	return {
		type: 'REC_ADDR',
		results: json
	}
}

const selAddr = (selected) => {
	return {
		type: 'SEL_ADDR',
		selected
	}
}
const setDone = (done) => {
	return {
		type: 'SET_DONE',
		done
	}
}

const fetchAddr = (raw) => {
	return dispatch => {
		dispatch(reqAddr(raw))
	  const eraw = `?address=`+raw.split(' ').join('+')+`&sensor=false`
	  const url = `http://maps.googleapis.com/maps/api/geocode/json`
	  console.log(url+eraw)
	  return fetch(url+eraw)
	    .then(response => response.json()) //same as function(response){return response.json()}
	    .then((json)=>{
	    	let res =json.results
	    	console.log(res)
	    	console.log(typeof(res))
	      if(res.length==0){

	      	 res.push({formatted_address: 'none found - search again'})
	      }
	      dispatch(recAddr(res))
	    })		
	}
}

const setUnverSel =(unver_sel)=>{
	return {
		type: 'SET_UNVER_SEL',
		unver_sel
	}	
}
const setVerSel =(idx)=>{
	return {
		type: 'SET_VER_SEL',
		idx
	}	
}

const recUnverified = (unverified) => {
	//console.log(unverified)
	return {
		type: 'REC_UNVERIFIED',
		unverified
	}
}

const postUnverCompl =(done)=>{
	return {
		type: 'POST_UNVER_COMPL',
		done
	}
}
const postUnverReq =(done)=>{
	return {
		type: 'POST_UNVER_REQ',
		done
	}
}

const fetchUnverified = () => {
	return dispatch => {
	  const url = `http://10.0.1.102:3036/api/hrs/verify-addr`
	  //console.log(url)
	  return fetch(url)
	    .then(response => response.json()) //same as function(response){return response.json()}
	    .then((json)=>{
	    	let unverified = json.map((j)=>
	    		Object.assign({}, j)
	    	)
	    	//console.log(unverified)
	      dispatch(recUnverified(unverified))
	    })		
	}
}

const fetchVerified = () => {
	return dispatch => {
	  const url = `http://10.0.1.102:3036/api/hrs/verify-addr/ver`
	  //console.log(url)
	  return fetch(url)
	    .then(response => response.json()) //same as function(response){return response.json()}
	    .then((json)=>{
	    	const verified=[]
	    	json.forEach((j)=>{
	    		verified[j.id]=j	
	    	})
	      dispatch(recVerified(verified))
	    })		
	}
}

const recVerified = (verified) => {
	//console.log(verified)
	return {
		type: 'REC_VERIFIED',
		verified
	}
}

const postUnverified =(unver_sel)=>{
	return dispatch => { 
		var done = false
		dispatch(postUnverReq(done))
		const id = unver_sel.id
		const body = Object.assign({}, unver_sel)
		delete body.isTheDev
		delete body.isThePlace
		delete body.idx
		delete body.id
		body.veri =1
		console.log(id)
		console.log(body)
		const url = `http://10.0.1.102:3036/api/hrs/verify-addr/`+id
		return superagent
			.put(url)
			.send(body)
			.end(function(e,res){
				console.log(res.body)
				if(res.body&&res.body.affectedRows==1){
					done = true
					console.log(done)
				}
				dispatch(postUnverCompl(done))
			})
			// return {
			// 	type: 'POST_UNVERIFIED',
			// 	done: done
			// }
	}	
}

export {fetchAddr, selAddr, recAddr, fetchUnverified, setUnverSel, 
	postUnverCompl, postUnverified, postUnverReq, setDone,
	fetchVerified, setVerSel

};