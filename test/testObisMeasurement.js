/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jshint expr: true*/
var expect = require('chai').expect;
var ObisMeasurement = require('../lib/ObisMeasurement');

describe('Test ObisMeasurement', function() {

    it('Test Constructor', function () {
        expect(new ObisMeasurement('1.8.1').idToString()).to.be.equal('1.8.1');

        expect(new ObisMeasurement('1.8.1', 1).idToString()).to.be.equal('1-0:1.8.1');

        expect(new ObisMeasurement('1-0:1.8.1').idToString()).to.be.equal('1-0:1.8.1');

        expect(new ObisMeasurement('1-0:1.8.1', 2).idToString()).to.be.equal('1-0:1.8.1');

        expect(new ObisMeasurement('1.8.1*255').idToString()).to.be.equal('1.8.1*255');

        expect(new ObisMeasurement('6.8*01').idToString()).to.be.equal('6.8*1');

        expect(new ObisMeasurement('1-0:1.8.1*255').idToString()).to.be.equal('1-0:1.8.1*255');

        expect(new ObisMeasurement('1-0:1.8.1*255').idToString('full')).to.be.equal('1-0:1.8.1*255');

        expect(new ObisMeasurement('1-0:1.8.1*255').idToString('base')).to.be.equal('1.8.1');

        expect(new ObisMeasurement('1-0:1.8.1*255').idToString('extended')).to.be.equal('1-0:1.8.1');

        var obis1 = new ObisMeasurement('1-0:1.8.1*255');
        obis1.tariffRate = undefined;
        expect(obis1.idToString()).to.be.equal('1-0:1.8*255');

        expect(new ObisMeasurement('F').idToString()).to.be.equal('97');

        expect(new ObisMeasurement('1-1:F.F').idToString()).to.be.equal('1-1:97.97');

        expect(new ObisMeasurement(new Buffer('8181C78227FF', 'hex')).idToString()).to.be.equal('129-129:199.130.39*255');

        expect(function() {new ObisMeasurement(new Buffer('8181C78227', 'hex'));}).to.throw(Error,/Invalid Buffer length/);

        expect(new ObisMeasurement(1,0,1,8,1,255).idToString()).to.be.equal('1-0:1.8.1*255');

        expect(new ObisMeasurement('1','0','1','8','1','255').idToString()).to.be.equal('1-0:1.8.1*255');

        expect(new ObisMeasurement(undefined,undefined,1,8,1,255).idToString()).to.be.equal('1.8.1*255');

        expect(new ObisMeasurement('8181C78227FF').idToString()).to.be.equal('129-129:199.130.39*255');

        expect(function() {new ObisMeasurement('INVALID');}).to.throw(Error,/Invalid Obis String INVALID/);
    });

    it('Test Value Functions', function () {
        var obis = new ObisMeasurement('1.8.1*255');
        obis.addValue(123456.78, 30);
        expect(obis.valueToString()).to.be.equal('123.45678 kWh');

        obis.addValue('123456.78', 30);
        expect(obis.valueToString()).to.be.equal('123.45678 kWh, 123.45678 kWh');

        obis.addValue('123456.78', '30');
        expect(obis.valueToString()).to.be.equal('123.45678 kWh, 123.45678 kWh, 123.45678 kWh');

        obis.addValue('123.456', 'kWh');
        expect(obis.valueToString()).to.be.equal('123.45678 kWh, 123.45678 kWh, 123.45678 kWh, 123.456 kWh');

        obis.addValue('234.567');
        expect(obis.valueToString()).to.be.equal('123.45678 kWh, 123.45678 kWh, 123.45678 kWh, 123.456 kWh, 234.567');

        expect(obis.getValueLength()).to.be.equal(5);
        expect(obis.getValue(4).value).to.be.equal(234.567);
        expect(obis.getValue(4).unit).to.be.equal('');


        obis = new ObisMeasurement('1.8.1*255');
        obis.addValue(new Buffer('454d48', 'hex'), 255);
        expect(obis.valueToString()).to.be.equal('EMH');


        obis = new ObisMeasurement('1.8.1*255');
        obis.addValue(new Buffer('0901454d48000041f045', 'hex'), 255);
        expect(obis.valueToString()).to.be.equal('0901454d48000041f045');
    });

    it('Test Get/Set Functions', function () {
        var obis = new ObisMeasurement();
        obis.setMedium(1);
        obis.setChannel(0);
        obis.setMeasurement(1);
        obis.setMeasureType(8);
        obis.setTariffRate(1);
        obis.setPreviousMeasurement(255);
        obis.setRawValue('0901454d48000041f045');

        expect(obis.getMedium()).to.be.equal(1);
        expect(obis.getChannel()).to.be.equal(0);
        expect(obis.getMeasurement()).to.be.equal(1);
        expect(obis.getMeasureType()).to.be.equal(8);
        expect(obis.getTariffRate()).to.be.equal(1);
        expect(obis.getPreviousMeasurement()).to.be.equal(255);
        expect(obis.getRawValue()).to.be.equal('0901454d48000041f045');

        expect(obis.idToString()).to.be.equal('1-0:1.8.1*255');

    });
});
