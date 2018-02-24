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
