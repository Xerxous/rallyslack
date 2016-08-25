/*global describe:true, it:true*/
const workPath = '../../../lib/conv/'
var assert = require('assert'),
    conv = require(workPath + 'listens');

describe('Listens standard: conv', () => {
    it('should return an two-dimensional array with 3 columns', function(){
        for (var i = 0; i < conv.length; i++){
            assert(conv[i].length === 3);
        }
    })
});
