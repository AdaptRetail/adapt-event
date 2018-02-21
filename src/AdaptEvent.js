let overtakenAdaptEvent = null;

const PLUGINS = [];

module.exports = class AdaptEvent {

    static prepare() {

        overtakenAdaptEvent = window.event;

    }

    static addPlugin( plugin ) {
        PLUGINS.push( plugin );
    }

    static dispatch( event, description, mousePosition = null ) {

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
