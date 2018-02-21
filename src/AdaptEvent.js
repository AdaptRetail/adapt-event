let overtakenAdaptEvent = null;

const PLUGINS = [];

module.exports = class AdaptEvent {

    static addPlugin( plugin ) {

        if (!plugin) {
            throw new TypeError( 'No plugin provided.' );
        }

        PLUGINS.push( plugin );

        if (typeof plugin.mounted !== 'undefined') {
            plugin.mounted.call( this );
        }
    }

    static dispatch( event, description, mousePosition = null ) {

        overtakenAdaptEvent = overtakenAdaptEvent || window.event;

        if (mousePosition) {
            var adaptMousePosition = {
                pageX: mousePosition.x,
                pageY: mousePosition.y,
            };
        }

        overtakenAdaptEvent( event, description, adaptMousePosition );

        for (var i = 0, len = PLUGINS.length; i < len; i++) {
            if (typeof PLUGINS[i].onDispatch !== 'undefined') {
                PLUGINS[i].onDispatch.call( this, event, description, mousePosition );
            }
        }

    }

}
