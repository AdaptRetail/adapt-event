window.event = function( name, description, event ) {
    window.triggeredEvent = {
        name,
        description,
        event
    };
};
