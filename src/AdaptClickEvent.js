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
        this.createAdaptClickAndNavigateFunction();
    }

    /**
     * Create adaptClick function
     */
    createAdaptClickFunction() {

        if (! Element.adaptClick) {
            var self = this;
            Element.prototype.adaptClick = function( closure, eventName = 'click', description = null ) {
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
            Element.prototype.adaptClickAndNavigate = function( url, eventName = 'navigate-to', description = null ) {
                description = description || url;

                this.adaptClick( function( event ) {

                    let plugins = AdaptEvent.PLUGINS;
                    let target = '_blank';
                    for (var i = 0, len = plugins.length; i < len; i++) {
                        let plugin = plugins[i];
                        if (plugin.formatAdaptClickUrl) {
                            url = plugin.formatAdaptClickUrl.call( this, url, eventName, description, event );
                        }
                        if (plugin.setAdaptClickTarget) {
                            target = plugin.setAdaptClickTarget.call( this, url, eventName, description, event );
                        }
                    }

                    window.open( url, target );

                }, eventName, description );

            };
        }
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
