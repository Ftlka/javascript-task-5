'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

const callFunc = (events, copyEvent) => events[copyEvent].forEach(person => {
    person.handler.call(person.context);
});


function getEmitter() {
    let events = {};

    return {
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },

        off: function (event, context) {
            Object.keys(events).forEach(element => {
                if ((element + '.').startsWith(event + '.')) {
                    events[element].forEach((person, idx) => {
                        if (context === person.context) {
                            events[element].splice(idx, 1);
                        }
                    });
                }
            });

            return this;
        },

        emit: function (event) {
            const loops = event.split('.').length;
            for (let i = 0; i < loops; i++) {
                if (events.hasOwnProperty(event)) {
                    callFunc(events, event);
                }
                event = event.substr(0, event.lastIndexOf('.'));
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
