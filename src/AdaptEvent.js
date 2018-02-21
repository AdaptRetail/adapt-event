let overtakenAdaptEvent = null;

module.exports = class AdaptEvent {

    static prepare() {

        overtakenAdaptEvent = window.event;

    }

    static dispatch( event, description, mousePosition = null ) {

        if (mousePosition) {
            mousePosition = {
                pageX: mousePosition.x,
                pageY: mousePosition.y,
            };
        }

        overtakenAdaptEvent( event, description, mousePosition );

    }

}
