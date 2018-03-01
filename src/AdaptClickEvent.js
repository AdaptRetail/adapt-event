const AdaptEvent = require( './AdaptEvent' );

module.exports = class AdaptClickPlugin {

    /**
     * When plugin is added we extend the Element
     * to get adaptClick function
     * 
     * This function autobinds the click event and dispatches event on click
     *
     * @return void
     */
    mounted() {
        this.createAdaptClickFunction();
        this.createNavigateFunctionOnAdaptEvent();
        this.createAdaptClickAndNavigateFunction();
    }

    /**
     * Create adaptClick function
     */
    createAdaptClickFunction() {

        if (! Element.adaptClick) {
            var self = this;
            Element.prototype.adaptClick = function( closure, eventName = null, description = null ) {

                eventName = eventName || 'click';

                this.addEventListener( 'click',
                    self.onClick.bind( this, closure, eventName, description ),
                    false );
            };
        }
    }

    /**
     * Create adaptClick function
     */
    createAdaptClickAndNavigateFunction() {

        if (! Element.adaptClickAndNavigate) {
            var self = this;
            Element.prototype.adaptClickAndNavigate = function( url, eventName = null, description = null ) {
                description = description || url;
                eventName = eventName || 'navigate-to';

                this.adaptClick( function( event ) {

                    AdaptEvent.navigate( url, eventName, description, event );

                }, eventName, description );

            };
        }
    }

    /**
     * Create navigate function on AdaptEvent
     */
    createNavigateFunctionOnAdaptEvent() {
        if (!AdaptEvent.navigate) {
            var self = this;
            AdaptEvent.navigate = function( url, eventName = null, description = null, event = null ) {
                description = description || url;
                eventName = eventName || 'navigate-to';
                AdaptEvent.dispatch( eventName, description, event );
                self.prepareAndNavigate( url, eventName, description, event );
            }
        }
    }

    prepareAndNavigate( url, eventName, description, event = null ) {

        let plugins = AdaptEvent.PLUGINS;
        let target = '_blank';
        for (var i = 0, len = plugins.length; i < len; i++) {
            let plugin = plugins[i];
            if (plugin.formatAdaptClickUrl) {
                url = plugin.formatAdaptClickUrl.call( this, url, eventName, description, event );
            }
            if (plugin.setAdaptNavigateTarget) {
                target = plugin.setAdaptNavigateTarget.call( this, url, eventName, description, event );
            }
        }

        window.open( url, target );
    }

    /**
     * Handle the click event
     *
     * @param closure
     * @param eventName
     * @param description
     * @param event
     *
     * @return void
     */
    onClick( closure, eventName, description, event ) {

        /**
         * If description does not work
         * We replace it with the html element without children as a string
         */
        if (! description) {
            description = event.target.outerHTML.replace( event.target.innerHTML, '' );
        }

        // Call the closure
        closure.call( this, event );

        // Dispatch the event
        AdaptEvent.dispatch(eventName,description,event);
    }

    /**
     * Hook into AdaptEvent.dispatch
     * by adding this function to your class
     *
     * This will be called after the original event is fired
     *
     * @param name
     * @param description
     * @param event MouseEvent
     *
     * @return void
     */
    onDispatchEvent(name, description, event) {}
}
