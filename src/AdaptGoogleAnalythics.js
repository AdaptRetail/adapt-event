export default class GoogleAnalythicsUrl {
    formatAdaptClickUrl( url, name, description, event ) {

        if (! window.adapt_data) {
            return url;
        }

        let returnUrl = url;

        returnUrl += window.adapt_data.details.ga_url

        if (description != url) {
            returnUrl += '&utm_content=' + description;
        }

        return returnUrl;

    }
}
