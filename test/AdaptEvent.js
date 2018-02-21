import test from 'ava';
import AdaptEvent from '../src/index';

test.beforeEach( t => {

    window.triggeredEvent = null;

    window.event = function( event, description, mousePosition ) {
        window.triggeredEvent = {
            event,
            description,
            mousePosition
        };
    };

    AdaptEvent.prepare();
} );

test( 'when dispatching event we are calling the "event" function provided by adapt', t => {

    AdaptEvent.dispatch( 'my-event', 'description', {
        x: 100,
        y: 200,
    } );

    t.deepEqual( window.triggeredEvent, {
        event: 'my-event',
        description: 'description',
        mousePosition: {
            pageX: 100,
            pageY: 200,
        }
    } );

} );
