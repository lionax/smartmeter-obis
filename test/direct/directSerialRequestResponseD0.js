var SerialPort = require('serialport');
var D0Protocol = require('../lib/protocols/D0Protocol');
var SerialRequestResponseTransport = require('../lib/transports/SerialRequestResponseTransport');

var options = {
    'protocol': "D0Protocol",
    'transport': "SerialRequestResponseTransport",
    'transportSerialPort': "/dev/ir-usb1",
    'transportSerialBaudrate': 300,
    'protocolD0WakeupCharacters': 40,
    'protocolD0DeviceAddress': '',
    'requestInterval': 10,
    'transportHttpRequestUrl': ''
};

function displayData(obisResult) {
    console.log("Received data: " + Object.keys(obisResult));
    console.log(JSON.stringify(obisResult,null,2));
}

var smProtocol = new D0Protocol(options, displayData);
var smTransport = new SerialRequestResponseTransport(options, smProtocol);

smTransport.init();

smTransport.process();

setTimeout(process.exit, 60000);