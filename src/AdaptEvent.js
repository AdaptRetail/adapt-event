let overtakenAdaptEvent = window.event;

const PLUGINS = [];

module.exports = class AdaptEvent {

    /**
     * Access the plugins of the class
     * 
     * @return Array
     */
    static get PLUGINS() {
        return PLUGINS;
    }

    /**
     * Access the event function or create new 
     * that console logs the event
     *
     * @return function
     */
    static get EVENT() {
        // Get the original event to call
        return overtakenAdaptEvent = overtakenAdaptEvent || function(name, description, event) {
            console.log( 'AdaptEvent: ', {
                name,
                description,
                event,
            } );
        };
    }

    /**
     * Set the event. 
     * This is only to overwrite the event in tests.
     *
     * @param value
     *
     * @return void
     */
    static set EVENT( value ) {
        overtakenAdaptEvent = value;
    }

    /**
     * Add plugins to extend the funcitonality
     *
     * @param plugin
     *
     * @return void
     */
    static addPlugin( plugin ) {

        if (!plugin) {
            throw new TypeError( 'No plugin provided.' );
        }

        PLUGINS.push( plugin );

        if (plugin.mounted) {
            plugin.mounted.call( plugin );
        }
    }

    /**
     * Dispatch event to adapt retail and other
     * if other plugins is added
     * 
     * @param event
     * @param description = null
     * @param event MouseEvent = null
     *
     * @return void
     */
    static dispatch( name, description = null, event = null ) {

        // Format the mouse position for Adapt
        AdaptEvent.EVENT( name, description, event );

        // Call "onDispatchEvent" functions on all plugins
        for (var i = 0, len = PLUGINS.length; i < len; i++) {
            if (PLUGINS[i].onDispatchEvent) {
                PLUGINS[i].onDispatchEvent.call( PLUGINS[i], name, description, event );
            }
        }

    }

}
