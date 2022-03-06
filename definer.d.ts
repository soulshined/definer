declare module 'definer' {

    export class Definer {
        /**
         *
         * @param collegiateApiKey Your api key for dictionaryapi.com's collegiate api
         */
        constructor(collegiateApiKey: string);

        /**
         * async
         * @param word word, or phrase, to define
         */
        define(word: string) : [];
    }

}