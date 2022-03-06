const AbstractApiResponse = require("./abstract-response.js");

class ApiThesaurusResponse extends AbstractApiResponse {
    constructor(response) {
        super(response);
        this.synonyms = {};
        this.antonyms = {};

        if (this.raw.length > 0 && this.raw[0].constructor === Object)
            this.raw.forEach(match => {
                if (!match.meta.target || !match.meta.target.tuuid) return;

                const tuuid = match.meta.target.tuuid;

                if (match.meta.syns) this.synonyms[tuuid] = match.meta.syns;
                if (match.meta.ants) this.antonyms[tuuid] = match.meta.ants;
            });
    }

    get_metadata_for_tuuid(tuuid) {
        const synonyms = this.synonyms[tuuid] || [];
        const antonyms = this.antonyms[tuuid] || [];

        return {
            synonyms: Array.from(new Set(...synonyms)),
            antonyms: Array.from(new Set(...antonyms))
        }
    }
}

module.exports = ApiThesaurusResponse;
