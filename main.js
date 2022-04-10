
const { SerialPort, ReadlineParser } = require('serialport')
const port = new SerialPort ({
    path: '/dev/ttyS3', baudRate: 9600
})
/* const parser = new ReadlineParser()
port.pipe(parser)
parser.on('data',console.log)
port.write('XBEE PLEASE RESPOND\n')

port.pipe(new ReadlineParser()) */
console.log(port.isOpen)


