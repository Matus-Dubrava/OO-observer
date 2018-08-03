'use strict';

(() => {

  class Subject {
    constructor() {}

    subscribe(client, fn, types) {
      types.forEach((type) => {
        client.types.push(type);
        if (!this[type]) { this[type] = []; }
        this[type].push({ client, fn, type });
      });
    }

    unsubscribeFrom(client, type) {
      const idx = this[type].findIndex((sub) => sub.client === client);
      if (idx >= 0) { this[type].splice(idx, 1); }
    }

    unsubscribeAll(client) {
      client.types.forEach((type) => {
        const idx = this[type].findIndex((sub) => sub.client === client);
        if (idx >= 0) { this[type].splice(idx, 1); }
      });
    }

    notify(message, type) {
      this[type].forEach((sub) => {
        sub.client[sub.fn](message);
      });
    }
  }

  class Client {
    constructor(name) {
      this.name = name;
      this.types = [];
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

  subject.subscribe(c1, 'notifyMe', ['tech', 'politics']);
  subject.subscribe(c2, 'notifyMe', ['tech']);
  subject.subscribe(c3, 'notifyMe', ['politics']);

  subject.notify('new Tech comming to market.', 'tech');
  subject.notify('Result of local elections is known.', 'politics');

  subject.unsubscribeAll(c1);

  subject.notify('Quantum computers are knocking on our door.', 'tech');
  subject.notify('Big news incomming!!!', 'politics');

})();
