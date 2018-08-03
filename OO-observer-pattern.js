'use strict';

(() => {

  class Subject {
    constructor() {
      this.subscribers = [];
    }

    subscribe(client, fn) {
      this.subscribers.push({ client, fn });
    }

    unsubscribe(client) {
      const idx = this.subscribers.findIndex((sub) => sub.client === client);
      if (idx >= 0) { this.subscribers.splice(idx, 1); }
    }

    notify(message) {
      this.subscribers.forEach((sub) => {
        sub.client[sub.fn](message);
      });
    }
  }

  class Client {
    constructor(name) {
      this.name = name;
    }

    notifyMe(message) {
      console.log(`I [${this.name}] have been notified with [${message}]`);
    }

    simpleNotify(message) {
      console.log(`${this.name} - notified!`);
    }

    ping() {
      console.log(`pong`);
    }
  }

  const c1 = new Client('Matus');
  const c2 = new Client('Jonh');
  const c3 = new Client('Sue');

  const clients = [c1, c2, c3];
  const subject = new Subject();

  subject.subscribe(c1, 'notifyMe');
  subject.subscribe(c2, 'simpleNotify');
  subject.subscribe(c3, 'ping');

  subject.notify('hello');

  subject.unsubscribe(c2);

  subject.notify('Big news incomming!!!');

})();
