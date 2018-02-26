import test from 'ava';
import AdaptEvent from '../dist/index';
import sinon from 'sinon';

test.beforeEach( t => {
    window.triggeredEvent = null;
} );

test( 'Is console.logging the event if no event is called.', t => {

    // Take over the console log to make it testable
    var tmpConsoleLog = console.log;
    console.log = sinon.spy();

    // Set the event function to null
    var tmpAdaptEvent = AdaptEvent.EVENT;
    AdaptEvent.EVENT = null;

    // Dispatch the event
    AdaptEvent.dispatch( 'my-event', 'description' );

    // Make sure the event is not triggered
    t.is( window.triggeredEvent, null );

    // Check if we console logged the event
    t.true( console.log.calledWith( 'AdaptEvent: ', {
        name: 'my-event',
        description: 'description',
        event: null,
    } ) );

    // Restore the taken over functions
    console.log = tmpConsoleLog;
    AdaptEvent.EVENT = tmpAdaptEvent;

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
