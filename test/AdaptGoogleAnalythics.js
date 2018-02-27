import test from 'ava';
import sinon from 'sinon';
import { AdaptEvent, AdaptClickEvent, AdaptGoogleAnalythics } from '../dist/index';

AdaptEvent.addPlugin( new AdaptClickEvent );
AdaptEvent.addPlugin( new AdaptGoogleAnalythics );

window.adapt_data = {
    details: {
        ga_url: '?test=test',
    }
};

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
    document.body.appendChild( element );
} );

// It is binding adapt google analythics url to the event and append event name to content
test( 'It is binding adapt google analythics url to the event and append event name to content', t => {
    let testUrl = 'https://testurl.test';

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl, 'click', 'target' );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl + window.adapt_data.details.ga_url + '&utm_content=' + 'target' ) );
} );

test( 'If the description is the same as the url, we do not add utm_content', t => {
    let testUrl = 'https://testurl.test';

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl + window.adapt_data.details.ga_url ) );
} );
