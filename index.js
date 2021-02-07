const express = require('express');
const morgan = require('morgan');
const { json, urlencoded } = require('body-parser');
require('./dispatcher');

var app = express();

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(morgan('dev'));

app.use('/', express.static('public'));

app.use('/event', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.connection.setTimeout(0);

  function messageHandler(e) {
    res.write('event: change\n');
    res.write(
      `data: ${JSON.stringify({ action: 'add', message: e.message })}\n\n`
    );
    res.write('\n\n');
  }

  dispatcher.on('message', messageHandler);

  res.write('event: change\n');
  res.write(
    `data: ${JSON.stringify({
      action: 'toast',
      message: `<p>Welcome back on event at ${new Date()}</p>`,
    })}\n\n`
  );

  res.on('close', () => {
    console.log(`/event anonymous Connection closed`);
    dispatcher.removeListener('message', messageHandler);
  });
});

var cnt = 0;
setInterval(() => {
  var dispatcheMsg = {
    message: `<p>Event # ${cnt++}</p>`,
  };
  dispatcher.send('message', dispatcheMsg);
}, 5000);

app.listen(80);
