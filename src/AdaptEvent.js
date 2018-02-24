let overtakenAdaptEvent = null;

const PLUGINS = [];

module.exports = class AdaptEvent {

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

        // Get the original event to call
        overtakenAdaptEvent = overtakenAdaptEvent || window.event;

        // Format the mouse position for Adapt
        overtakenAdaptEvent( name, description, event );

        // Call "onDispatchEvent" functions on all plugins
        for (var i = 0, len = PLUGINS.length; i < len; i++) {
            if (PLUGINS[i].onDispatchEvent) {
                PLUGINS[i].onDispatchEvent.call( PLUGINS[i], name, description, event );
            }
        }

    }

}
