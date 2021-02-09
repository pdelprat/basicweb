const EventEmitter = require('events');

class Dispatcher extends EventEmitter {
  send(eventName, data) {
    console.log('Dispather receive:', data);

    this.emit(eventName, data);
  }
}

dispatcher = new Dispatcher();

