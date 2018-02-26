import test from 'ava';
import AdaptEvent from '../dist/index';

test.beforeEach( t => {
    window.triggeredEvent = null;
} );

test( 'Dispatching event without event function, will return null', t => {

    AdaptEvent.dispatch( 'my-event', 'description' );

    t.deepEqual( window.triggeredEvent, {
        name: 'my-event',
        description: 'description',
        event: null,
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

        onDispatchEvent( name, description, event ) {
            window.testPluginEvent = {
                name,
                description,
                event,
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
    t.deepEqual( window.testPluginEvent, window.triggeredEvent );
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

// test( 'A plugin can only be added one time.', t => {
// } );
