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

test( 'it can add empty plugin without throwing error', t => {

    t.notThrows(()=> {
        class TestPlugin {}

        AdaptEvent.addPlugin( new TestPlugin );

        AdaptEvent.dispatch( 'test' );
    });

} );

test( 'it throws error if no plugin is provided', t => {

    const error = t.throws(()=> {
        AdaptEvent.addPlugin();
    });

    t.is( error.message, 'No plugin provided.' )
} );

test( 'it can add plugin to extend what happends when we trigger an event', t => {

    class TestPlugin {

        onDispatch( event, description, position ) {
            window.testPluginEvent = {
                event,
                description,
                position,
            };
        }

    }

    // Add the plugin
    AdaptEvent.addPlugin( new TestPlugin );

    // Dispatch event
    AdaptEvent.dispatch( 'my-event', 'description', {
        x: 100,
        y: 200,
    } );

    // Check if we are calling the normal event
    t.deepEqual( window.triggeredEvent, {
        event: 'my-event',
        description: 'description',
        mousePosition: {
            pageX: 100,
            pageY: 200,
        }
    } );

    // Check if we are calling the normal event
    t.deepEqual( window.testPluginEvent, {
        event: 'my-event',
        description: 'description',
        position: {
            x: 100,
            y: 200,
        }
    } );
} );

test( 'plugins can add own functionality', t => {

    window.testPluginMountCalled = false;

    class TestPlugin {

        mounted() {
            window.testPluginMountCalled = true;
        }

    }

    AdaptEvent.addPlugin( new TestPlugin );

    t.true( window.testPluginMountCalled );
} );
