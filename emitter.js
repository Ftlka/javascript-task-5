'use strict';

getEmitter.isStar = true;
module.exports = getEmitter;

const callFunc = (events, copyEvent) => events[copyEvent].forEach(person => {
    person.handler.call(person.context);
});


function getEmitter() {
    const events = {};

    return {
        on: function (event, context, handler) {
            if (!events.hasOwnProperty(event)) {
                events[event] = [];
            }
            events[event].push({ context, handler });

            return this;
        },


        off: function (event, context) {
            Object.keys(events)
                .filter(element => (element + '.').startsWith(event + '.'))
                .forEach(key => {
                    events[key] = events[key]
                        .filter(person => context !== person.context);
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
        },

        several: function (event, context, handler, times) {
            this.on(event, context, () => {
                if (times > 0) {
                    handler.call(context);
                    times--;
                }
            });

            return this;
        },

        through: function (event, context, handler, frequency) {
            let idx = 0;
            this.on(event, context, () => {
                if (idx % frequency === 0) {
                    handler.call(context);
                }
                idx++;
            });

            return this;
        }
    };
}
