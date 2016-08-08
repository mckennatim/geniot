import {Component, OnInit, AfterViewInit, OnDestroy} from '@angular/core';
import * as mqtt from 'mqtt';
import {Store} from '@ngrx/store'

@Component({
    selector: 'mqtt',
    template: `
	    <h3>about Mqtt {{me}} {{frog}} {{(mqtt | async).timr1.val}}</h3>
	    {{mqtt | async |json}} <br />
	    <button type="button" (click)="subscribe($event)">Subscribe to WebSocket</button>
			<route-view></route-view>    
	`
})

export class MqttComponent implements AfterViewInit, OnDestroy {
	public me: string = "ulysses";
	public frog: string;
	public client: any; 
	public deviceId = 'CYURD001';
	public statuTopic = this.deviceId + '/status';
	public tmrTopic = this.deviceId + '/tmr';
	public progsTopic = this.deviceId + '/progs';
	public mqtt;

	constructor(private _store: Store<any>) {
		this.mqtt = _store.select('mqtt')
			.map((m)=>{
					m.subsys.map((s)=>{
					console.log(m[s])
					s=m[s]
					console.log(s)
					return s
				})
				console.log(m)
				return m;
			})
		this.frog = "mabibi";
		console.log("whaaaaat")
	}
	
	ngAfterViewInit() {
		var self = this;
		//this.client = mqtt.connect('ws://10.0.1.100:3333')
		this.client = mqtt.connect('ws://162.217.250.109:3333')
		this.client.on('connect', function() {
			console.log('maybe connected');
			self.client.subscribe(self.statuTopic)
			self.client.subscribe(self.tmrTopic)
			self.client.subscribe(self.progsTopic)
			self.client.publish('presence', 'Web Client is alive.. Test Ping! ');
			self.client.on('message', function(topic, payload) {
				//console.log(topic)
				var pls = payload.toString()
				// console.log(pls)
				var plo = JSON.parse(pls)
				// console.log(plo)
				//self.frog = plo.temp1;
				var sp = topic.split("/")
				var job = sp[1];
				switch (job) {
					case "status":
						self._store.dispatch({ type: "UPDATE_STATUS", payload: plo })
						break;
					case "tmr":
						self._store.dispatch({ type: "UPDATE_TMR", payload: plo })
						break;
					case "progs":
						self._store.dispatch({ type: "UPDATE_PROGS", payload: plo })
						break;
				}						
			})
		});
	}

	ngOnDestroy() {
		console.log('cleint disconnectin')
		this.client.publish('presence', 'Help, wants to close! ');
		this.client.end();
	}

	subscribe($event) {
		console.log("trying to unsubscribe to ws");
		console.log($event);
	}

}
//[CYURD001/progs] {"crement":5,"serels":[0,99,1,2],"progs":[
//[[0,0,80,77],[6,12,82,75],[8,20,85,78],[16,0,78,74],[16,15,83,79]],
//[[0,0,58],[18,0,68],[21,30,58]],
//[[0,0,0],[16,0,1],[16,15,0]]]}