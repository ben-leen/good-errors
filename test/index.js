'use strict';

// Load modules

const Errors = require('..').Errors;

const Code = require('code');
const Lab = require('lab');
const Boom = require('boom');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

describe('Errors', () => {

    it('converts errors to json objects', (done) => {

        const stream = new Errors({});

        stream.on('readable', () => {

            const result = stream.read();

            if (!result) {
                return done();
            }

            expect(result).to.equal({ data: { name: 'Error', stack: 'Some\nstack', message: 'foo' } });
        });

        const err = new Error('foo');
        err.stack = 'Some\nstack';
        stream.end({ data: err });
    });

    it('converts boom wrapped errors to json objects', (done) => {

        const stream = new Errors({});

        stream.on('readable', () => {

            const result = stream.read();

            if (!result) {
                return done();
            }

            expect(result).to.equal({ data: { name: 'Error', stack: 'Some\nstack', message: 'foo' } });
        });

        let err = new Error('foo');
        err.stack = 'Some\nstack';
        err = Boom.wrap(err);
        stream.end({ data: err });
    });

    it('leaves non error data untouched', (done) => {

        const stream = new Errors({});

        stream.on('readable', () => {

            const result = stream.read();

            if (!result) {
                return done();
            }

            expect(result).to.equal({ data: { a: 1 } });
        });

        stream.end({ data: { a: 1 } });
    });

    it('leaves non good frames untouched', (done) => {

        const stream = new Errors({});

        stream.on('readable', () => {

            const result = stream.read();

            if (!result) {
                return done();
            }

            expect(result).to.equal({ a: 1 });
        });

        stream.end({ a: 1 });
    });
});
