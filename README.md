# @adapt-retail/adapt-data
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
We dont tell you what to track, but we got some preconfigured events for you.

<a name="add-plugin"></a>
### Add plugin

You can easily add plugins to trigger other events like Google Double click, AdForm, Delta projects and other with the same api.

```js
AdaptEvent.addPlugin( new AdFormEvents );
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

<a name="adapt-click-event"></a>
### Assign click event on element

You can assign click event on all DOM elements,
that automatically triggers adapt events including the position of the event.

```js
import AdaptData from '@adapt-retail/adapt-event';

// First we must extend the DOMElement
// To include the adapt event logic
AdaptData.bindToElements();

// The functions will now be binded to all Elements
document.querySelector( '.logo' ).adaptClick( function( event ) {
    ...
}, 'click-on', 'logo' );
```
