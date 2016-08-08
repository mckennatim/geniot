import {AboutComponent} from './about.component'

import {describe,expect,it} from '@angular/core/testing';

describe('AboutComponent', ()=>{
	beforeEach(()=>{
		this.abo = new AboutComponent();
	})
	it('should have a me prop', ()=>{
		console.log(this.abo.me)
		expect(this.abo.me).toBe('ulysses')
	})
})