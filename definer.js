const { definition } = require("./lib/service/api-service.js");
const DatabaseService = require("./lib/service/db");

class Definer {

    constructor(collegiateApiKey) {
         DatabaseService.updateApiKey('collegiate', collegiateApiKey);
    }

    async define(word) {
        const resp = await definition(word);
        if (resp.isSuggestions) return resp.suggestions;

        return resp.matches;
    }

}

module.exports = Definer;