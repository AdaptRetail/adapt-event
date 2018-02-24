import test from 'ava';
import { AdaptEvent, AdaptClickEvent } from '../dist/index';

AdaptEvent.addPlugin( new AdaptClickEvent );

var dispatchMouseClickOn = function( element, x, y ) {
    var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'pageX': x,
        'pageY': y,
        'clientX': x,
        'clientY': y,
        'screenX': x,
        'screenY': y,
    });
    element.dispatchEvent(event);
}

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
    var element = document.createElement( 'div' );

    element.innerHTML = 'This is a test';

    element.id = 'my-element';
    element.classList.add( 'test' );
    element.classList.add( 'class' );

    // Add child element
    var childElement = document.createElement( 'div' );
    childElement.innerHtml = 'This is a child element'

    element.appendChild( childElement );
    document.body.appendChild( element );
} );

test( 'it can extend DOMElement to include click function', t => {

    var closureEvent = null;
    document.firstChild.adaptClick( function(event) {
        closureEvent = event;
    } );

    // Trigger the event
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );
    //

    // Check if the closure is called
    // And if the event is a MouseEvent
    t.true( closureEvent instanceof MouseEvent );

    // Check if AdaptEvent.dispatch is called and set default properties
    t.deepEqual( window.triggeredEvent, {
        description: '<div id="my-element" class="test class"></div>',
        event: 'click',
        mousePosition: closureEvent
    } );

} );

test( 'it can overwrite the event and description', t => {

    var closureEvent = null;
    var customEventName = 'custom-event-name';
    var customEventDescription = 'Custom event description';

    document.firstChild.adaptClick( function(event) {
        closureEvent = event;
    }, customEventName, customEventDescription );

    // Trigger the event
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    t.deepEqual( window.triggeredEvent, {
        description: customEventDescription,
        event: customEventName,
        mousePosition: closureEvent
    } );

} );

// test( 'it console.log the event if no event is defined on window', t => {
// } );
