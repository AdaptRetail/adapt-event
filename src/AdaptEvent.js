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
            plugin.mounted.call( this );
        }
    }

    /**
     * Dispatch event to adapt retail and other
     * if other plugins is added
     * 
     * @param event
     * @param description = null
     * @param mousePosition Object = null
     *
     * @return void
     */
    static dispatch( event, description = null, mousePosition = null ) {

        // Get the original event to call
        overtakenAdaptEvent = overtakenAdaptEvent || window.event;

        // Format the mouse position for Adapt
        if (mousePosition) {
            var adaptMousePosition = {
                pageX: mousePosition.x,
                pageY: mousePosition.y,
            };
        }
        overtakenAdaptEvent( event, description, adaptMousePosition );

        // Call "onDispatch" functions on all plugins
        for (var i = 0, len = PLUGINS.length; i < len; i++) {
            if (PLUGINS[i].onDispatch) {
                PLUGINS[i].onDispatch.call( this, event, description, mousePosition );
            }
        }

    }

}
