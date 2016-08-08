import {Component} from '@angular/core';
import { RouteParams } from '@ngrx/router';
import { Observable } from 'rxjs/Observable';
import {Store} from '@ngrx/store';

@Component({
    selector: 'aval',
    template: `<h3>{{ (id$ | async).name }}: {{ (id$ | async).val }} {{me}}</h3>
    `
    // template: `<h3>{{ (id$ | async).name }}: {{ (id$ | async).val }} {{me}}</h3>
    // <route-view></route-view>
    // `
})

export class AvalComponent {
	public me: string = "aval component";
	id$: Observable<any>; 
	id: string;

	constructor(routeParams$: RouteParams, private _store: Store<any>) {
		this.id$= routeParams$
			.pluck('id')
			.switchMap(id => _store.select(s => s.mqtt[id.toString()]))

	}
}