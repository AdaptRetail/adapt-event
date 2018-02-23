const AdaptEvent = require( './AdaptEvent' );

module.exports = class AdaptClickPlugin {
    mounted() {

        if (! Element.adaptClick) {
            var self = this;
            Element.prototype.adaptClick = function( closure, code = 'click', desc = null ) {
                this.addEventListener( 'click',
                    self.onClick.bind( this, closure, code, desc ),
                    false );
            };
        }

    }

    onClick( closure, code, desc, event ) {

        // if (!desc) {
            // if (this.id) {
                // desc += this.id;
            // }
            // if (this.className) {
                // desc += this.className;
            // }
        // }

        closure.call( this, event );

        AdaptEvent.dispatch(code,desc, {
            pageX: event.clientX,
            pageY: event.clientY,
        });
    }

    onDispatch() {}
}
