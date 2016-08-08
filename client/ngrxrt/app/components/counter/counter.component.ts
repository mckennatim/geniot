import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {INCREMENT, DECREMENT, RESET} from '../../reducers/counter';
import {Observable} from 'rxjs/Observable'
import {AboutComponent} from '../about/about.component'

// interface AppState {
//     counter$: Observable<number>;
// }

@Component({
    selector: 'count',
    template: `
        <br />
        <h4>simple counter</h4>
        <button (click)="increment()">Increment</button>
        <div>Current Count: {{ counter$ | async }}</div>
        <button (click)="decrement()">Decrement</button>
        <about></about>
    `,
    directives: [AboutComponent]
})
export class CounterComponent {
    counter$: Observable<number>;
    constructor(public store: Store<number>) {
        this.counter$ = store.select<number>('counter');
    }
    increment() {
        this.store.dispatch({ type: INCREMENT });
    }
    decrement() {
        this.store.dispatch({ type: DECREMENT });
    }
    reset() {
        this.store.dispatch({ type: RESET });
    }
}