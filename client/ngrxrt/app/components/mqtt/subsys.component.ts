import {Component} from '@angular/core';

@Component({
    selector: 'val',
    template: `
    	<h3>{{me}}</h3>
			<route-view></route-view>
    `
})

export class SubsysComponent {
	public me: string = "subsytems for this device"
}