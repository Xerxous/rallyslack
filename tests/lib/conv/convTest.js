/*global describe:true, it:true, before:true*/
const workPath = '../../../lib/conv/'
var assert = require('assert'),
    sinon = require('sinon'),
    conv = require(workPath + 'conv');

describe('Module standard: conv', () => {
    var options, bot, message, mod, count = 0;

    before(() => {
        options = {
            slackWeb: {
                userInfo: sinon.spy()
            },
            logger: sinon.spy()
        }
        bot = {
            reply: sinon.spy()
        }

        message = {
            text: 'message'
        }
        mod = conv(options);
    });

    it('should return an object of functions', () => {
        assert(typeof mod === 'object', 'did not return an object');
        for (var func in mod){
            assert(typeof mod[func] === 'function', 'a non-function type found in module');
        }
    });

    it('should have each function call logger upon evocation', () => {
        for (var func in mod){
            mod[func](bot, message);
            count++;
        }
        assert(options.logger.callCount === count, 'logger is not called in every function');
    });
});
