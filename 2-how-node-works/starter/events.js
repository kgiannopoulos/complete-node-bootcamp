const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
    constructor() {
        super();

    }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log('there was a new sale');
});

myEmitter.on('newSale', () => {
    console.log('Customer name: Jonas');
});

myEmitter.on('newSale', stock => {
    console.log(`There are now ${stock} items left in stock`);

});
    myEmitter.emit('newSale', 9);

///////////////////////////////////////////////////////////////////

const server = http.createServer();

server.on('request', (req, res) => {
   console.log('request received');
   console.log(req.url);
   res.end('request received')
});

server.on('request', (req, res) => {
    console.log('another request')
});

server.on('close', () => {
    res.end('another request')
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests...');
});