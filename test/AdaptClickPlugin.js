import test from 'ava';
import AdaptEvent from '../src/index';
import AdaptClickEvent from '../src/AdaptClickEvent';

AdaptEvent.addPlugin( new AdaptClickEvent );

var dispatchMouseClickOn = function( element, x, y ) {
    var event = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
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

    // element.id = 'my-element';
    // element.classList.add( 'test' );
    // element.classList.add( 'class' );
    document.body.appendChild( element );
    // console.log(document.body.firstChild.outerHTML);
} );

test( 'it can extend DOMElement to include click function', t => {

    var closureTriggered = false;

    document.firstChild.adaptClick( function(event) {
        closureTriggered = true;
    } );

    document.firstChild.click();

    t.truthy( window.triggeredEvent );
});

// test( 'it can extend DOMElement to include click function', t => {

    // var testEvent = null;
    // console.log(document.body.firstChild.outerHTML);

    // document.firstChild.adaptClick( function(event) {
        // console.log(this.outerHTML);
        // testEvent = event;
    // } );

    // dispatchMouseClickOn( document.firstChild, 100, 200 );

    // t.true( testEvent instanceof MouseEvent );

    // t.deepEqual( window.triggeredEvent, {
        // event: 'click',
    // } );

// } );
