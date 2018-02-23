import test from 'ava';
import AdaptEvent from '../src/index';
import AdaptClickEvent from '../src/AdaptClickEvent';

AdaptEvent.addPlugin( new AdaptClickEvent );

test.beforeEach( function() {

    // Prepare trigger event
    window.triggeredEvent = null;
    window.event = function( event, description, mousePosition ) {
        window.triggeredEvent = {
            event,
            description,
            mousePosition
        };
    };

    // Remove all existing childs and add new
    while( document.body.firstChild ) {
        document.body.removeChild( document.body.firstChild );
    }
    document.body.appendChild( document.createElement( 'div' ) );
} );

test( 'it can extend DOMElement to include click function', t => {

    var testEvent = null;
    var closureTriggered = false;

    document.firstChild.adaptClick( function(event) {
        testEvent = event;
        closureTriggered = true;
    } );

    document.firstChild.dispatchEvent( new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': 100,
        'screenY': 200
    } ) );

    t.true( closureTriggered );
    t.true( testEvent instanceof MouseEvent );

    // t.deepEqual( window.triggeredEvent, {
        // event: 'click',
    // } );

} );
