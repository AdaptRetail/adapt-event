export default class GoogleAnalythicsUrl {
    formatAdaptClickUrl( url, name, description, event ) {

        let returnUrl = url;

        returnUrl += window.adapt_data.details.ga_url

        if (description != url) {
            returnUrl += '&utm_content=' + description;
        }

        return returnUrl;

    }
}
