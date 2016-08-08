import {Component}from '@angular/core';
import {Observable} from 'rxjs'
import {Store} from '@ngrx/store'

import {FilterSelect} from './filter-select'
import {PersonInput} from './person-input';
import {PersonList}from './person-list';

import {people} from "../..//reducers/people";
import {filter} from "../../reducers/filter";


@Component({
	selector: 'party',
	template:`
		<h3>Party thing</h3>
      <filter-select
        (updateFilter)="updateFilter($event)"
      >
      </filter-select>
      <person-input
        (addPerson)="addPerson($event)"
      >
      </person-input>
      <person-list
        [people]="people | async"
        (addGuest)="addGuest($event)"
        (removeGuest)="removeGuest($event)"
        (removePerson)="removePerson($event)"
        (toggleAttending)="toggleAttending($event)"
      >
      </person-list>		
	`,
	directives: [FilterSelect, PersonInput, PersonList]
}) 
export class PartyComponent{
	public people;
	private id=0;

	constructor(private _store: Store<any>){
		this.people = Observable.combineLatest(
			_store.select('people'),
			_store.select('filter'),
			(people, filter) => {
				return people.filter(filter);
			}
		)
	}
	addPerson(name) {
		this._store.dispatch({
			type: "ADD_PERSON", payload: {
				id: ++this.id,
				name,
				guests: 0,
				attending: false
			}
		})
	}
	addGuest({id}) {
		this._store.dispatch({ type: "ADD_GUESTS", payload: id });
	}
	removeGuest({id}) {
		this._store.dispatch({ type: "REMOVE_GUESTS", payload: id });
	}
	removePerson({id}) {
		this._store.dispatch({ type: "REMOVE_PERSON", payload: id });
	}
	toggleAttending({id}) {
		this._store.dispatch({ type: "TOGGLE_ATTENDING", payload: id });
	}
	updateFilter(filter) {
		this._store.dispatch({ type: filter });
	}
}