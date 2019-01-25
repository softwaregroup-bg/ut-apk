import { List, Map, Iterable } from 'immutable';

function asList(value) {
    if (Iterable.isIndexed(value)) {
        return value.toList();
    } else if (Iterable.isIterable(value)) {
        // Non-indexed collections may not be stable, return undefined & hopefully someone will notice
        return undefined;
    } else {
        return new List([value]);
    }
}

// See https://github.com/facebook/immutable-js/wiki/Predicates
function keyIn(/* ...keys */) {
    const keySet = new Set(arguments);
    return function(v, k) {
        return keySet.has(k);
    };
}

function transform(object, config, seed = new Map()) {
    return config.reduce((out, value, key) => {
        const mapFrom = asList(value.get('from'));
        const mapTo = asList(value.get('to'));
        const transform = (typeof value.get('transform') === 'function') ? value.get('transform') : undefined;

        let newValue;
        if (object.hasIn(mapFrom)) {
            newValue = object.getIn(mapFrom);
        }
        if (newValue) {
            return out.setIn(mapTo, transform ? newValue.update(transform) : newValue);
        } else {
            return out;
        }
    }, seed);
}

export { transform, keyIn, asList };
