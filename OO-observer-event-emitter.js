const EventEmitter = require('events').EventEmitter;

class News extends EventEmitter {
  constructor() {
    super();
    this.subscribers = new Set();
  }

  addSubscriber(sub) {
    this.subscribers.add(sub);
  }

  releaseNews(type, message) {
    console.log('NEWS: releasing ' + type);
    this.emit(type, type, message);
  }

  notifySubscribers(evt, msg) {
    for (const sub of this.subscribers) {
      sub.types.forEach((type) => {
        if (type === evt) { sub.receiveMessage(msg); }
      });
    }
  }
}

class Observer {
  constructor(name, types) {
    this.name = name;
    this.types = types;
  }

  receiveMessage(msg) {
    console.log(`${this.name} GOT: ${msg}`);
  }
}

const observer1 = new Observer('obs1', ['major']);
const observer2 = new Observer('obs2', ['message', 'major']);
const observer3 = new Observer('obs3', ['major', 'message', 'minor']);

const news = new News();
news.on('message', news.notifySubscribers);
news.on('major', news.notifySubscribers);
news.on('minor', news.notifySubscribers);

news.addSubscriber(observer1);
news.addSubscriber(observer2);
news.addSubscriber(observer3);

news.releaseNews('message', 'hello news');
news.releaseNews('major', 'This a major news.');
news.releaseNews('minor', 'just some random stuff...');
