import test from 'ava';
import sinon from 'sinon';
import { AdaptEvent, AdaptClickEvent } from '../dist/index';

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
    AdaptEvent.dispatch = t.contextAdaptEventDispatch;
});
test.beforeEach( t => {
    // Highjack the window.open
    t.context.windowOpen = window.open;
    window.open = sinon.spy();

    t.contextAdaptEventDispatch = AdaptEvent.dispatch;
    AdaptEvent.dispatch = sinon.spy();

    // Prepare the plugin
    AdaptEvent.PLUGINS = [];
    AdaptEvent.addPlugin( new AdaptClickEvent );

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
    t.true( AdaptEvent.dispatch.calledWith( 'click', '<div id="my-element" class="test class"></div>', closureEvent ) );

} );

test( 'adding null as paramter for adaptClick will use the default paramters', t => {

    var closureEvent = null;
    document.body.firstChild.adaptClick( function(event) {
        closureEvent = event;
    }, null, null );

    // Trigger the event
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if AdaptEvent.dispatch is called and set default properties
    t.true( AdaptEvent.dispatch.calledWith( 'click', '<div id="my-element" class="test class"></div>', closureEvent ) );
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

    t.true( AdaptEvent.dispatch.calledWith( customEventName, customEventDescription, closureEvent ) );

} );

test( 'it can navigate to a url on a click event', t => {

    let testUrl = 'https://testurl.test';

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we triggered the event
    t.true( AdaptEvent.dispatch.calledOnceWith( 'navigate-to', testUrl ) );
    t.true( AdaptEvent.dispatch.args[0][2] instanceof MouseEvent );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl, '_blank' ) );

} );

test( 'Adding null as paramter in one of the parameters returns default', t => {

    let testUrl = 'https://testurl.test';

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl, null, null );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we triggered the event

    AdaptEvent.navigate( testUrl, null, null );

    // Check if we triggered the event
    t.true( AdaptEvent.dispatch.calledTwice );
    t.true( AdaptEvent.dispatch.alwaysCalledWith( 'navigate-to', testUrl ) );
    t.true( AdaptEvent.dispatch.args[0][2] instanceof MouseEvent );

    // Check if we called open window
    t.true( window.open.calledTwice );
    t.true( window.open.alwaysCalledWith( testUrl, '_blank' ) );

} );

test( 'it can set event name and description', t => {
    let testUrl = 'https://testurl.test';

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl, 'my-click', 'on-this' );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we triggered the event
    t.true( AdaptEvent.dispatch.alwaysCalledWith( 'my-click', 'on-this' ) );
} );

test( 'other plugins can overwrite the format url we navigate to but we still keep the url on the event on the event', t => {

    let testUrl = 'https://testurl.test';

    class PluginOne {
        formatAdaptClickUrl( url ) {
            return url + '-test';
        }
    }

    class PluginTwo {
        formatAdaptClickUrl( url ) {
            return url + '-test';
        }
    }

    AdaptEvent.addPlugin( new PluginOne );
    AdaptEvent.addPlugin( new PluginTwo );

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we triggered the event
    t.is( AdaptEvent.dispatch.args[0][1], testUrl );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl + '-test' + '-test', '_blank' ) );

} );

// should adaptClickAndNavigate be its own class and extend adaptClick?
test( 'It can set what target to use when navigating to the url', t => {

    let testUrl = 'https://testurl.test';

    class FormatTargetEventClickPlugin {
        setAdaptNavigateTarget() {
            return "_self";
        }
    }

    AdaptEvent.addPlugin( new FormatTargetEventClickPlugin );

    // Setup the custom function
    document.body.firstChild.adaptClickAndNavigate( testUrl );

    // Trigger the mouse click on the element
    dispatchMouseClickOn( document.body.firstChild, 100, 200 );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl, '_self' ) );

} );

test( 'We are adding navigate function to AdaptEvent', t => {

    let testUrl = 'https://testurl.test';

    AdaptEvent.navigate( testUrl, 'event-name', 'description' );

    // Check if the event was fired
    t.true( AdaptEvent.dispatch.calledWith( 'event-name', 'description', null ) );

    // Check if we called open window
    t.true( window.open.calledWith( testUrl, '_blank' ) );

} );
