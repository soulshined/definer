const AbstractApiResponse = require("./abstract-response.js");
const { ApiResponseMatch } = require("./response-match.js");

class ApiCollegiateResponse extends AbstractApiResponse {
    constructor(response) {
        super(response);
        this.matches = [];
        if (!this.isSuggestions)
            this.matches = this.raw.map(m => new ApiResponseMatch(m));
    }

    get suggestions() {
        const suggestions = [...this.raw];
        suggestions.sort((a, b) => {
            a = a.toLowerCase();
            b = b.toLowerCase();
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        });
        return suggestions;
    }
}

module.exports = ApiCollegiateResponse;
