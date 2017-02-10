# sbdev0/geniot/client/hrs/client
## notes
- gmaps needs height and width
- react component tag names must be capitalized

## tag: 02-added-testing
and fake data `test/mockData.js` and get setup for testing

    npm install --save-dev mocha chai
    npm install --save immutable
    npm install --save-dev chai-immutable
We need to let plug in chai-immutable before any tests are run. That we can do in a little test helper file, which should create next:

test/test_helper.js

    import chai from 'chai';
    import chaiImmutable from 'chai-immutable';
    chai.use(chaiImmutable);

to package.json add a couple of scripts

    "babel": {
      "presets": [
        "es2015",
        "react"
      ]
    },
    scripts: {
      "test": "mocha --compilers js:babel-core/register --require ./test/test_helper.js  --recursive --slow 4",
      "test:watch": "npm run test -- --watch" ...

add a first test `test1.spec.js`

    import {expect} from 'chai';
    import {List, Map, fromJS} from 'immutable';
    describe("an immutable map",()=>{
      describe("a map",()=>{
        it("modifies a map", ()=>{
          let state = new Map({panel: "auto", relay: "on", by: 'forecast'})
          let nextState = state.update("by", b=>'user')
          expect(state.get('by')).to.equal("forecast")
          expect(nextState.get('by')).to.equal("user")
          //console.log(nextState)
        });
        it("modifies a bigger map", ()=>{
          let state = fromJS({ctrl: {panel: "auto", relay: "on", by: 'forecast'},
            cond: {temp: 67, sky: "cloudy"},
            forecast: {isSnow: true, when: "now", accum: 10}});
          let nextState = state.setIn(['ctrl', 'by'], 'user')
          //console.log(state)
          expect(state.getIn(['ctrl', 'by'])).to.equal("forecast")
          expect(nextState.getIn(['ctrl', 'by'])).to.equal("user")
          //console.log(nextState)
        })
      })
    })

btw: `webpack.config.js` should now look like...

    const path = require('path');

    module.exports = {
      entry: './app.js',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          loaders: ['babel?presets[]=react,presets[]=es2015'],
          exclude: /node_modules/,
          include: __dirname
        }]
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },  
    }

## tag: 01-changed-component-names
Using tagging to checkout prior stuff. After each commit

    git tag 01-changed-component-names
    git push --tags
to list tags

    git tag
to go back to tagged code... If you are in the midst of changes you haven't committed then `git stash` them before you ...

    git stash
    git checkout tagname
then to get back to where you were

    git checkout master
    git stash apply

## tag: 0-basicredroute
 Based upon stripped down example of `react`, `redux`, `react-router` and `redux-simple router` drawn from the `basicredroute` of <a href="https://github.com/rackt/redux-simple-router">basicredroute</a>

<blockquote>
This is a basic example that demonstrates rendering components based
on URLs with react-router as well as connecting them to Redux state.
It uses both <Link> elements and the `updatePath` action creator to
update the paths.    
</blockquote>

To run, follow these steps:

1. Install dependencies with `npm install` 
2. Build with `webpack --watch`
3. Open `index.html`

versions in working example

        ├─┬ history@1.17.0
        │ ├── deep-equal@1.0.1
        │ ├─┬ invariant@2.2.0
        │ │ └─┬ loose-envify@1.1.0
        │ │   └── js-tokens@1.0.2
        │ ├─┬ query-string@3.0.0
        │ │ └── strict-uri-encode@1.1.0
        │ └─┬ warning@2.1.0
        │   └─┬ loose-envify@1.1.0
        │     └── js-tokens@1.0.2
        ├─┬ react@0.14.6
        │ ├─┬ envify@3.4.0
        │ │ ├─┬ jstransform@10.1.0
        │ │ │ ├── base62@0.1.1
        │ │ │ ├── esprima-fb@13001.1001.0-dev-harmony-fb
        │ │ │ └─┬ source-map@0.1.31
        │ │ │   └── amdefine@1.0.0
        │ │ └── through@2.3.8
        │ └─┬ fbjs@0.6.1
        │   ├── core-js@1.2.6
        │   ├─┬ loose-envify@1.1.0
        │   │ └── js-tokens@1.0.2
        │   ├─┬ promise@7.1.1
        │   │ └── asap@2.0.3
        │   ├── ua-parser-js@0.7.10
        │   └── whatwg-fetch@0.9.0
        ├── react-dom@0.14.6
        ├─┬ react-redux@4.0.6
        │ ├── hoist-non-react-statics@1.0.3
        │ └─┬ invariant@2.2.0
        │   └─┬ loose-envify@1.1.0
        │     └── js-tokens@1.0.2
        ├─┬ react-router@1.0.3
        │ ├─┬ invariant@2.2.0
        │ │ └─┬ loose-envify@1.1.0
        │ │   └── js-tokens@1.0.2
        │ └─┬ warning@2.1.0
        │   └─┬ loose-envify@1.1.0
        │     └── js-tokens@1.0.2
        ├── redux@3.0.5
        ├─┬ redux-simple-router@1.0.2
        │ ├── deep-equal@1.0.1
        │ └── history@1.13.1 extraneous