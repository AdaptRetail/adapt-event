# @adapt-retail/adapt-data [![Build Status](https://travis-ci.org/AdaptRetail/adapt-event.svg?branch=master)](https://travis-ci.org/AdaptRetail/adapt-event)
> ⚠️ This package has not been released as a stable release, and changes may occur.

> Easy dispatching of events in [Adapt Retail](https://adaptretail.com).

- [Install](#install)
- [Usage](#usage)
    - [Import](#import)
    - [Dispatch events](#dispatch-event)
- [Plugins](#plugins)
    - [Default plugins](#default-plugins)
- [Development](#development)
    

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

<a name="plugins"></a>
## Plugins
It is possible to extend the functionality of the AdaptEvent using plugins.
This could be f.eks. extending the event to match other display networks, such as Google Double Click and AdForm.
> Read how to build your own [in the documentation](https://github.com/AdaptRetail/adapt-event/wiki/Plugins)

```js
AdaptEvent.addPlugin( new Plugin );
```

<a name="default-plugins"></a>
#### Default plugins

We are also including some default plugins to make your life easier.

> Read more [in the documentation](https://github.com/AdaptRetail/adapt-event/wiki/Adapt-Click-Events)

```js
// Import and add plugin
import {
    AdaptEvent,
    AdaptClickEvent,
    AdaptGoogleAnalythics
} from '@adapt-retail/adapt-event';

AdaptEvent.addPlugin( new AdaptClickEvent );
AdaptEvent.addPlugin( new AdaptGoogleAnalythics );


// Track a click 
document.querySelector( '.logo' ).adaptClick( function( event ) {
    ...
}, 'a-click', 'logo' );

// Track click and navigate to url
document.querySelector( '.logo' )
    .adaptClickAndNavigate( 'https://adaptretail.com', 'navigate', 'from-logo' );
```


<a name="development"></a>
## Development
```bash
# Install dependencies
npm install

# Run test suit
npm run test

# Run test suite on file change
npm run tdd
```
