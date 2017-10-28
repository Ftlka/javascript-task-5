'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

const callFunc = (events, copyEvent) => events[copyEvent].forEach(person => {
    person[copyEvent]();
});
const getIndex = (events, event, context) => events[event].indexOf(context);

function getEmitter() {
    let events = {};

    return {
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push(context);
            context[event] = handler;

            return this;
        },

        off: function (event, context) {
            const keysAr = Object.keys(events);
            keysAr.forEach(element => {
                if ((element + '.').startsWith(event)) {
                    events[element].splice([getIndex(events, element, context)], 1);
                    delete context[element];
                }
            });

            return this;
        },

        emit: function (event) {
            let current = event.split('.');
            let copyEvent = event;
            for (let i = 0; i < current.length; i++) {
                if (events.hasOwnProperty(copyEvent)) {
                    callFunc(events, copyEvent);
                }
                copyEvent = copyEvent.substr(0, copyEvent.lastIndexOf('.'));
            }

            return this;
        }

        // several: function (event, context, handler, times) {
        //     return this;
        // },

        // through: function (event, context, handler, frequency) {
        //     return this;
        // }
    };
}
