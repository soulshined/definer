const axios = require("axios");
const QueryBuilder = require("../model/query-builder");
const DatabaseService = require("./db");
const ApiDictionaryResponse = require("../model/api/collegiate-response");
const ApiThesaurusResponse = require("../model/api/thesaurus-response");
const Logger = require('js-logger');

Logger.useDefaults();
Logger.setLevel(Logger.INFO);

async function definition(phrase) {
    const resp = await request(phrase);
    const result = new ApiDictionaryResponse(resp);
    if (!result.isSuggestions && !result.isCached) {
        await DatabaseService.insertDefinition(phrase, resp.data).catch(e => Logger.debug('Error saving to cache', e));
    }

    return result;
}

async function thesaurus(phrase) {
    const resp = await request(phrase, 'Thesaurus');
    if (!resp.cached)
        await DatabaseService.insertThesaurus(phrase, resp.data).catch(e => Logger.debug('Error saving to cache', e));
    return new ApiThesaurusResponse(resp);
}

async function request(phrase, endpoint = 'Collegiate') {
    const cachedWord = await DatabaseService.getOne(
        QueryBuilder.select(endpoint).where(QueryBuilder.where('phrase', '=', phrase))
    );

    if (cachedWord) {
        Logger.debug(`has ${endpoint} cache for:`, phrase)
        return { cached: true, data : JSON.parse(cachedWord.response) };
    }

    endpoint = endpoint.toLowerCase();
    const secret = await DatabaseService.getOne(
        QueryBuilder.select('Config', `apiKey`).where(QueryBuilder.where('id', '=', endpoint === 'collegiate' ? 1 : 2))
    );

    if (secret === undefined && endpoint === 'collegiate')
        throw new Error(`No api key found for the dictionary.com collegiate API`);
    else if (secret === undefined && endpoint === 'thesaurus') return [];

    const resp = await axios.post(`https://www.dictionaryapi.com/api/v3/references/${endpoint}/json/${phrase}?key=${secret.apiKey}`).catch(e => {
        Logger.error('Error making request to dictionaryapi.com', e);
        process.exit();
    });

    if (resp.status != 200)
        throw new Error("Dictionaryapi.com return an unsatisfactory response status: " + resp.status);
    else if (resp.status === 200 && resp.data.constructor === String)
        throw new Error(`${endpoint} error => ${resp.data}`);

    return { cached: false, data: resp.data };
}

module.exports = {
    definition,
    thesaurus
};