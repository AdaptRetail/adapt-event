# @adapt-retail/adapt-data
> ⚠️ This package has not been released as a stable release, and changes may occur.

> Easy dispatching of events in [Adapt Retail](https://adaptretail.com).

- [Install](#install)
- [Usage](#usage)
    - [Import](#import)
    - [Add plugin](#add-plugin)
    - [Dispatch events](#dispatch-event)
    - [Extending functionality](#plugins)

<a name="install"></a>
## Install

```bash
npm install @adapt-retail/adapt-event
```

<a name="usage"></a>
## Usage

The event class will help you dispatch events in Adapt Retail.
You can use it to track whatever event you like, but we got some preconfigured events for you.

<a name="import"></a>
### Import to project

When installed, simply import the package with normal node syntax.

```js
// EcmaScript6 and up
import AdaptEvent from '@adapt-retail/adapt-event';
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
AdaptEvent.dispatch( 'Event name', 'Description' );
```

If you dispatching an MouseEvent, add the event as the third parameter
to track where the click occur.
```js
var logo = document.querySelector( '.logo' );

logo.addEventListener( 'click', function( event ) {
    AdaptEvent.dispatch( 'click', 'on-logo', event );
} );
```

<a name="adapt-click-events"></a>
#### Adapt Click events

We are also including a plugin to trigger event on click for you.

```js
// Import both classes
import {AdaptEvent, AdaptClickEvent} from '@adapt-retail/adapt-event';

// Add the plugin
AdaptEvent.addPlugin( new AdaptClickEvent );

/*
 * Automatically dispatchs adapt events,
 * including the position of the mouse when the event is dispatched.
 *
 * @param closure
 * @param event (optional) (default: 'click')
 * @param description (optional) (default: String representation of the element)
 * Example (<div class=".logo"></div>)
 * 
 * @return void
 */
document.querySelector( '.logo' ).adaptClick( function( event ) {
    ...
}, 'a-click', 'logo' );
```

<a name="plugins"></a>
### Extending functionality

Out of the box this package automatically dispatchs events for Adapt Retail.
Both for Adapt Rapports and Google Analytics.

You can also easily add plugins to dispatch other events like Google DoubleClick, AdForm, Delta Projects and other with the same API.

<a name="add-plugin"></a>
#### Adding plugins

You can extend functionality of the AdaptEvent by adding plugins.

```js
AdaptEvent.addPlugin( new AdForm );
```

<a name="create-plugins"></a>
#### Creating plugins
> [AdaptClickEvent](https://github.com/AdaptRetail/adapt-event/blob/master/src/AdaptClickEvent.js) is actually a plugin.
> Use it as a reference.

Here is an example of extending the AdaptEvent to trigger AdForm events when we trigger events.

```js
class AdForm {

    /**
     * This method is called when
     * the plugin is added to the plugin stack
     * @return void
     */
    mounted() {
        console.log( 'Plugin is ready!' );
    }

    /**
     * Gets called when AdaptEvent.dispatch
     * is called.
     * 
     * @param event
     * @param description = null
     * @param mousePosition Object = null
     *
     * @return void
     */
    onDispatchEvent( name, description, event ) {

        // Cancel if resources is not available
        if (typeof dhtml === 'undefined') {
            return;
        }

        // Do the logic
        switch (name.toLowerCase()) {
            case: 'click':
                dhtml.sendEvent( 5, 'Click' );
            break;
            case: 'next':
                dhtml.sendEvent( 4, 'Next' );
            break;
            case: 'previous':
                dhtml.sendEvent( 4, 'Previous' );
            break;
        }

    }
}

// Add the plugin to AdaptEvent
AdaptEvent.addPlugin( new AdForm );
```

## Development
```bash
# Install dependencies
npm install

# Run test suit
npm run test

# Run test suite on file change
npm run tdd
```
