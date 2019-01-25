var create = require('ut-error').define;
module.exports = [
    // apk
    {
        name: 'apk',
        defaultMessage: 'ut-apk apk error',
        level: 'error'
    }
].reduce(function(prev, next) {
    var spec = next.name.split('.');
    var Ctor = create(spec.pop(), spec.join('.'), next.defaultMessage, next);
    prev[next.name] = function(params) {
        return new Ctor({params: params});
    };
    return prev;
}, {});
