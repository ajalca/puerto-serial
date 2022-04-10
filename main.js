const { app, BrowserWindow } = require('electron')
const path = require('path')
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')

const port = new SerialPort({path: 'COM3', autoOpen: false, baudRate: 9600})
const start_data = [0x7E, 0x00, 0x50, 0x01, 0x01, 0xff, 0xff,
    0x00, 0x05, 0x00, 0x01, 0x03, 0x84, 0x00]

const open = () => (
    port.open(function (err) {
        if (!err)
           return
        console.log('Port is not open: ' + err.message);
        setTimeout(open, 10000); // next attempt to open after 10s
    })
)

port.on('open', function() {
    function send() {
        if (!port.isOpen) // v5.x require
            return console.log('Port closed. Data is not sent.');
        console.log('Port open', port.isOpen)
        port.write(start_data, function (err) {
            if (err)
                console.log('Error on write: ' +  err.message)
            port.drain(() => console.log('DONE'));
        });
    }

    setInterval(send, 1000);
});

port.on('close', function () {
    console.log('CLOSE');
    open(); // reopen 
});

port.on('data', (data) => console.log('Data: ' + data));
port.on('error', (err) => console.error('Error: ', err.message));

open();

// Read data that is available but keep the stream in "paused mode"
port.on('readable', function () {
    console.log('Data:', port.read())
})

// Switches the port into "flowing mode"
port.on('data', (data) => {
    try {
      console.log(data.toString());
    } catch (err) {
      console.log('Oops');
    }
})

// Pipe the data into another stream (like a parser or standard out)
const lineStream = port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

lineStream.on('data', console.log)
