let overtakenAdaptEvent = null;

const PLUGINS = [];

module.exports = class AdaptEvent {

    static addPlugin( plugin ) {
        PLUGINS.push( plugin );
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
            PLUGINS[i].onDispatch.call( this, event, description, mousePosition );
        }

    }

}
