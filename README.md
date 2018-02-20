# @adapt-retail/adapt-data
> ⚠️ Warning: This package does not yet exists yet and we are trying to figure out the API.

> Easy dispatching of events in [Adapt Retail](https://adaptretail.com).

- [Install](#install)
- [Usage](#usage)
    - [Add plugin](#add-plugin)
    - [Trigger events](#trigger-event)
    - [Assign click event on element](#adapt-click-event)

<a name="install"></a>
## Install

```bash
npm install @adapt-retail/adapt-event
```

<a name="usage"></a>
## Usage

The event class will help you trigger events in Adapt Retail.
You can use it to track whatever event you like, but we got some preconfigured events for you.

When working with the production locally we only fake the events to the server and you can see the output of your event in the console.
When pushed to Adapt, we automatically switch out the events to use the production event class.

<a name="import"></a>
### Import to project

When installed, simply import the package with normal node syntax.

```js
// EcmaScript6 and up
import AdaptData from '@adapt-retail/adapt-event';

// Require function
const AdaptData = require( '@adapt-retail/adapt-event' );

// Prepare the AdaptEvent class
AdaptData.bindToElements(); // ( This should only be called once )
```

<a name="dispatch-event"></a>
### Dispatching events

```js
/*
 * @param event
 * @param description (optional)
 * @param position (optional)
 * 
 * @return void
 */
AdaptEvent.dispatch( 'Event name', 'Description', {
    x: 100,
    y: 100,
} );
```

<a name="click-event"></a>
#### Adapt click event
Automatically triggers adapt events including the position of the mouse when the event is triggered.

```js
// Now you can call call `.adaptClick` on all `DOMElements`.
document.querySelector( '.logo' ).adaptClick( function( event ) {
    ...
} );

// If no event information is provided, the event name will be 'click',
// and the descrpition will be the element
```

```js
// You can also set custom event name and description
document.querySelector( '.logo' ).adaptClick( function( event ) {
    ...
}, 'click-on', 'logo' );
```

```js
// This function is extending the adaptClick and adds functionality to navigate to url
document.querySelector( '.logo' ).adaptClickAndNavigate( 'https://adaptretail.com' );

// Default event:
// Name: 'to-url'
// Description: The url provided to navigate to
```

```js
// You can also set custom event name and description
document.querySelector( '.logo' ).adaptClickAndNavigate( 'https://adaptretail.com',
'toUrl', 'homepage');
```

<a name="plugins"></a>
### Extending functionality

Out of the box this package automatically triggers events for Adapt Retail.
Both for Adapt Rapports and Google Analytics.

You can also easily add plugins to trigger other events like Google DoubleClick, AdForm, Delta Projects and other with the same API.

<a name="add-plugin"></a>
#### Adding plugins
> All plugins should be added before the `AdaptData.bindToElements()`.

```js
AdaptEvent.addPlugin( new AdFormEvents );
```

#### Creating plugins

> The `adaptClick` function is a plugin and can be used as a reference.

```js
class AdForm {
    onEventTrigger( event, description, position ) {

        // Cancel if resources is not available
        if (typeof dhtml === 'undefined') {
            return;
        }

        // Do the logic
        switch (event.toLowerCase()) {
            case: 'click':
                dhtml.sendEvent( 5, 'Click' );
            break;
            case: 'next':
                dhtml.sendEvent( 4, 'Next' );
            break;
        }

    }
}

AdaptEvent.addPlugin( new AdForm );
```

##### Adding new functions
When adding new functionality to an element, and you want to trigger an event it is important you call the `AdaptEvent.trigger` function and uses the event hooks to handle your logic.

This is because we want to trigger the event on all places like the Google DoubleClick events when your event is fired. The `AdaptEvent.trigger` function contains logic to trigger events on all plugins.

##### Extending existing functions
> All plugins will be extended in the order they are added.
> This means that the last plugin has presidence over the rest.

If you want to extend an existing function such as `adaptClickAndNavigate` you can do so.

```js
class AdFormClickTag {

    extendFunction() {
        if ( typeof dhtml === 'undefined' ) {
            return;
        }

        // Store the old function
        var existingFunction = Element.prototype.adaptClickAndNavigate;

        // Create a new one
        Element.prototype.adaptClickAndNavigate = function( url, event, descrpition ) {
            var clickTag = this.clickTag( dhtml.getVar( 'clickTAG' ), url )

            var landingPageTarget = dhtml.getVar('landingPageTarget', '_blank');
                window.open(newClickTAG,landingPageTarget);
            }

            existingFunction( clickTag, landingPageTarget )

    }

    clickTag(clickTag,cpdir){
		return clickTag.split("CREFURL")[0] + ";cpdir=" + cpdir +  ";CREFURL" + clickTag.split("CREFURL")[1];
	}

}

AdaptEvent.addPlugin( new AdFormClickTag );

document.querySelector( '.logo' )
    .adaptClickAndNavigate( 'https://adaptretail.com' );
```

##### Prevent adding of default plugins

 You can prevent the adding of the default plugins.

```js
// Prevent default
AdaptEvent.preventDefaultPlugins();

// Star the plugin
AdaptData.bindToElements();
```
