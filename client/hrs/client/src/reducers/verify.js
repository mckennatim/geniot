const dataState = {
  raw: '',
  isFetching: false,
  done: false,
  result: {},
  results: [
    {
      address_components: [{}, {},{},{},{},{},{},{long_name: "00000"}],
      formatted_address: "nowhere",
      geometry: {
        location: {
          lat: 0,
          lng: 0
        }
      }
    }
  ],
  selected: {
    address: '12 selected place',
    location: {
      lat: 12.44,
      lng: -7.11
    },
    isTheDev: false,
    isThePlace: false,
    devid: 'IFUC',
    idx:-44
  },
  unver_sel: {
    id:999999,  
    raw:'12 Parley',
    devid: 'CYURAP'
  },
  unverified: [
  ],
  verified: [{
    id:1,
    address: 'no address',
    devid: 'no devices fetched',
    lat: 42.3150166,
    lng: -71.1111484
  }]
}
//http://maps.googleapis.com/maps/api/geocode/json?address=12+parley+Vale,+Jamaica+Plain,+MA+02130&sensor=false

export const verify = (state = dataState, action) =>{
  switch (action.type) {
    case 'REQ_ADDR':
      return Object.assign({}, state, {
        isFetching: true
      })    
    case 'SET_DONE':
      return Object.assign({}, state, {
        done: action.done
      })    
    case 'REC_ADDR':
      return Object.assign({}, state, {
        isFetching: false,
        //raw: action.results[0].formatted_address,
        //result: action.results[0],
        results: action.results
      })
    case 'SEL_ADDR':
      return Object.assign({}, state, {
        selected: action.selected
      }) 
    case 'REC_UNVERIFIED':
      //console.log(action.unverified)
      return Object.assign({}, state, {
        unverified: action.unverified
      })
    case 'REC_VERIFIED':
      //console.log(action.verified)
      return Object.assign({}, state, {
        verified: action.verified
      })
    case 'SET_UNVER_SEL':
      //console.log(action.unver_sel)
      return Object.assign({}, state, {
        unver_sel: action.unver_sel
      }) 
    case 'SET_VER_SEL':
      return Object.assign({}, state, {
        ver_sel: state.verified[action.idx]
      }) 
    case 'POST_UNVER_COMPL':
      return Object.assign({},state, {
        isFetching: false,
        done: action.done
      }) 
    case 'POST_UNVER_REQ':
      return Object.assign({},state, {
        isFetching: false,
        done: action.done
      })            
    default:
      return state
  }
}

