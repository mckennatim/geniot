#cascada-webpack

Cascada-webpack is a React version of a front end for controlling a pond with a waterfall and watering stations in the garden. The back end is a raspberry Pi with a few relays, running python and flask to create a restful API. 

The project uses Server Sent Events (SSE) to allow any connected device to display the state of the system and its timers. The SSEs modify the state of the root component `Yard` which then get propogated down to any child component that needs to exhibit that change. Each watering station is represented by a `Spot` React component and there is a `Pond` component. Each runs on a separate thread in the pi and both use a custom generic button component `Butt` whose props modify its size, image, animation, content and look.

From a a tooling perspective this is a minimalist approach to a React application that uses ES6 via bablify and webpack.

## work in process
Adding token authentication via another server that provides token authentication for other apps I have developed.

### credits
"url": "https://github.com/tylermcginnis/github-notetaker-egghead"

"author": "Tyler McGinnis <tylermcginnis33@gmail.com> 

http://tylermcginnis.com