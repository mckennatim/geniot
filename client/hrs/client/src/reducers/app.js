const initialBrowser = () => {
  let ws = window.innerWidth
  let devInfo ={
    types: ['watch', 'phone', 'tablet', 'laptop'],
    sizes: [300, 638, 980, 1456],
    browser: '',
    size: ws
  }
  var thei
  devInfo.sizes.reduce((t, n, i)=>{ 
    if(t<ws&&ws<=n){thei = i}
    return n 
  },0);
  devInfo.browser = devInfo.types[thei]
  return devInfo
} 
const initialDeviceState = initialBrowser()
console.log(initialDeviceState)

export const device = (state = initialDeviceState, action) =>{
  switch (action.type) {
    case 'SET_DEVICE':
      return Object.assign({}, state, {
        browser: action.devInfo.browser,
        size: action.devInfo.size
      })
    default:
      return state;
  }
}