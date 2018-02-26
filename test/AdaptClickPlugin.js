import test from 'ava';
import sinon from 'sinon';
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

test.afterEach( t => {
    // Restore the window.open
    window.open = t.context.windowOpen;
});
test.beforeEach( t => {
    // Highjack the window.open
    t.context.windowOpen = window.open;
    window.open = sinon.spy();

    // Prepare trigger event
    window.triggeredEvent = null;

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
    document.body.firstChild.adaptClick( function(event) {
        closureEvent = event;
    } );

    // Trigger the event
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if the closure is called
    // And if the event is a MouseEvent
    t.true( closureEvent instanceof MouseEvent );

    // Check if AdaptEvent.dispatch is called and set default properties
    t.deepEqual( window.triggeredEvent, {
        name: 'click',
        description: '<div id="my-element" class="test class"></div>',
        event: closureEvent
    } );

} );

test( 'it can overwrite the event and description', t => {

    var closureEvent = null;
    var customEventName = 'custom-event-name';
    var customEventDescription = 'Custom event description';

    document.body.firstChild.adaptClick( function(event) {
        closureEvent = event;
    }, customEventName, customEventDescription );

    // Trigger the event
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    t.deepEqual( window.triggeredEvent, {
        name: customEventName,
        description: customEventDescription,
        event: closureEvent
    } );

} );

test( 'it can navigate to a url on a click event', t => {

    let testUrl = 'https://testurl.test';

    // Trigger the event
    document.body.firstChild.adaptClickAndNavigate( testUrl );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we triggered the event
    t.true( window.triggeredEvent.event instanceof MouseEvent );
    t.deepEqual( window.triggeredEvent, {
        name: 'navigate-to',
        description: testUrl,
        event: window.triggeredEvent.event,
    } );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl, '_blank' ) );

} );

// it can set event name and description
// other plugins can overwrite the format url we navigate to but we still keep the url on the event on the event
// It can set what target to open the url
// It is binding adapt google analythics url to the event and append event name to content
