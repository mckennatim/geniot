import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
    	<h3>ng2-typescript-webpack-ngrx-hrt</h3>
			<nav>
			  <a linkTo="/help">Help</a>
			  <a linkTo="/about">About</a>
			  <a linkTo="/cnt">Count</a>
			  <a linkTo="/party">Party</a>
			  <a linkTo="/mqtt">Mqtt</a>
			</nav>
			<route-view></route-view>
    `,
  })
export class AppComponent {}	
