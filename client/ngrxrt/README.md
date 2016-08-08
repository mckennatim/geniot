now part of demiot

## Angular2 gradual toolup as needed (webpack) ##

based on (http://www.schempy.com/2016/01/19/angular2_webpack_typescript/) 
@angular.RC-01

==tags==
===03====
cant find Object.assign => maybe in vendor.ts polyfills

===02-store-reducer-counter===

===01-ngrx-hrt-webp===
HTML 5 routing doesn't let me enter path in url bar so this uses hashtag 

===00-minimal-tooling===
* weback works
* npm start works (webpack-dev-server --host 0.0.0.0 --port 6100)
The tricky thing here is that I don't want to `npm install` every time I want to play around so there is just one set of node_modules in c:///wamp/www/ng2. Not generally a problem except in webpack.config.js. This works...

      module: {
        loaders: [
          {
            test: /\.ts/,
            loaders: ['ts-loader'],
            exclude: /node_modules/
          }
        ]
      },


but `exclude ['node_modules']` does not
todo - production build, routes, test, store

==stackoverflow==
===getting mqtt to work in angular2===
Mqtt is a barebones messaging protocol that's starting to get used a lot in IOT. On the leg from the server to the browser it rides on top of Websockets. In a plain javascript app this code works fine

    import * as mqtt from 'mqtt';   
    var client = mqtt.connect('ws://10.0.1.100:3333')
    client.on('connect', function() {
      console.log('maybe connected up here')
      client.subscribe(statu)      
      client.publish('presence', 'Web Client is alive.. Test Ping! ');
    })

on the server showing:

    Pkt $SYS/ryFCT62G/new/clients mqttjs_d3e6bb51
    Pkt presence Web Client is alive.. Test Ping!    

When I try to use this in an angular2 app with some variation of the following...

    export class MqttComponent {
      public client: any; 
      public deviceId = 'CYURD001';
      public statu = this.deviceId + '/status';
      constructor(){
        console.log(this.client)
        var self = this;
        this.client = mqtt.connect('ws://10.0.1.100:3333')
        this.client.on('connect', function(){
          console.log('maybe connected');
          self.client.subscribe(this.statu)
          self.client.publish('presence', 'Web Client is alive.. Test Ping! ');
        });
      }

It connect but after about 5 seconds it disconnects. This code gives me browser_adapter errors `Cannot convert undefined or null to object`. Moving `mqtt.connect` outside the class causes the same error from `zone.js:260`. Both seem to come from ZoneTask.invoke.

How can I use an outside library with an async protocol in angular2?

====answer====
I'm takin the dog dumbass. `self.client.subscribe(this.statu)` should be `self.client.subscribe(self.statu)`

===getting a super simple webpack ng2 starter to work===

I appreciate all the work that has gone into webpack-starter but my mind needs something simpler. This was how I got started with webpack using react and redux. I want to build slowly from the basics.

    -simple
        -dist
            index.html
        -src
            app.component.ts
            main.ts
        package.json
        webpack.config.js

where `webpack.config.js` is

    const path = require('path');
    module.exports = {
      entry: './src/main.ts',
      output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
      },
      resolve: {
        extensions: ['', '.ts', '.js']
      },
      module: {
        loaders: [
          {
            test: /.*ts$/,
            loader: 'ts-loader',
            exclude: [
              'node_modules'
            ]
          }
        ]
      }  
    }

main.ts

    import { bootstrap }    from '@angular/platform-browser-dynamic';
    import { AppComponent } from './app.component';
    bootstrap(AppComponent);

app.component.ts 

    import { Component } from '@angular/core';
    @Component({
        selector: 'my-app',
        template: '<h1>My First Angular 2 App</h1>'
    })
    export class AppComponent { }

index.html

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>sto</title>
        <link rel="stylesheet" href="">
    </head>
    <body>
        <my-app>Loading...</my-app>
        <script src="./bundle.js"></script> 
    </body>
    </html>

package.json

    {
      "name": "sto",
      "version": "1.0.0",
      "description": "",
      "main": "main.ts",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "Timothy S. McKenna <mckenna.tim@gmail.com> (http://mckennatim.github.io/mckennatim/)",
      "license": "MIT",
      "dependencies": {
          "@angular/common": "2.0.0-rc.1",
          "@angular/compiler": "2.0.0-rc.1",
          "@angular/core": "2.0.0-rc.1",      
          "@angular/platform-browser": "2.0.0-rc.1",
          "@angular/platform-browser-dynamic": "2.0.0-rc.1",
          "es6-promise": "3.1.2",
          "es6-shim": "0.35.0",
          "reflect-metadata": "0.1.2",
          "rxjs": "5.0.0-beta.6",
          "systemjs": "0.19.27",
          "typescript": "1.8.10",
          "typings": "0.8.1",
          "zone.js": "0.6.12"
      }
    }

but I don't have it right yet

    ERROR in ./src/main.ts
    Module build failed: TypeError: Path must be a string. Received undefined
      at assertPath (path.js:7:11)
      at Object.dirname (path.js:697:5)
      at ensureTypeScriptInstance (c:\wamp\www\ng2\node_modules\ts-loader\index.js:156:103)
      at Object.loader (c:\wamp\www\ng2\node_modules\ts-loader\index.js:403:14)

using windows 7      
====answer====
A simple app needs some polyfills bundled in. Here in `app/vendor.ts` 

    // Polyfills
    import 'es6-shim';
    import 'es6-promise';
    import 'zone.js/dist/zone';
    import 'reflect-metadata';

webpack.config.js bundles them with the help of a plugin

    var webpack = require("webpack");
    module.exports = {
      entry: {
        "vendor": "./app/vendor",
        "app": "./app/boot"
      },
      output: {
        path: __dirname,
        filename: "./dist/[name].bundle.js"
      },
      resolve: {
        extensions: ['', '.js', '.ts']
      },
      devtool: 'source-map',
      module: {
        loaders: [
          {
            test: /\.ts/,
            loaders: ['ts-loader'],
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./dist/vendor.bundle.js")
      ]
    }

note: I generally don't do a npm install huge install for every little app I am playing with. I do that further up the directory tree so they can be shared by all my ng2 apps and explorations. However when you do that `exclude:['node_modules']` won't exclude them and you get an error.

I moved index.html and added the vendor bundle

    <html>
      <head>
        <title>ng2-ts-webpack-0</title>
        </head>
      <body>
        <my-app>Loading...</my-app>
      </body>
      <script src="dist/vendor.bundle.js"></script>
      <script src="dist/app.bundle.js"></script>
    </html>

the modified directory structure looks like this...

    -simple
        -dist
        -src
            app.component.ts
            main.ts
            vendor.ts
        index.html    
        package.json
        webpack.config.js

Now both `package.json` scripts works. (0.0.0.0 lets me see it on my phone)

      "scripts": {
        "build": "webpack",
        "start": "webpack-dev-server --host 0.0.0.0 --port 6100"
      }, 

I did the basic install and `linkTo` worked fine as did the back button. But when I typed into the url bar of the browser I get a "The requested URL ... was not found on this server. What would I need to do to get that functionality in a modern browser

    import {bootstrap}    from '@angular/platform-browser-dynamic'
    import { provideRouter, Routes } from '@ngrx/router';
    import {AppComponent} from './app.component'
    import {HelpComponent} from './help/help.component'
    import {AboutComponent} from './about/about.component'
    const routes: Routes = [
      { path: '/', component: AboutComponent },
      { path: '/about', component: AboutComponent },
      { path: '/help', component: HelpComponent }
    ]
    bootstrap(AppComponent, [provideRouter(routes)]);

as in 

    import { LocationStrategy,HashLocationStrategy } from '@angular/common';

I added this to bootstrap

    bootstrap(AppComponent, [
      provideRouter(routes),
      provide(LocationStrategy, { useClass: HashLocationStrategy })
    ]);

and have this in index.html

    <script>document.write('<base href="' + document.location + '" />');</script>    

adding this to webpack.config.js 

    devServer: {
      contentBase: "/wamp/www/ng2/sb/ng2-js-webp-broke-rt",
      historyApiFallback: true
    },    

does two things
1. causes page refresh if you type in the url bar
2. forgets to remove the prior path when you go back to linkTo buttons

localhost:6100/about
then press linkTo button for /help and you get
localhost:6100/about/help instead of localhost:6100/help
