class AbstractApiResponse {
    constructor(response) {
        this.raw = response.data;
        this.cached = response.cached || false;
    }

    get isSuggestions() {
        return this.raw && this.raw.length > 0 && this.raw[0].constructor === String;
    }

    get isCached() {
        return this.cached;
    }
}

module.exports = AbstractApiResponse;