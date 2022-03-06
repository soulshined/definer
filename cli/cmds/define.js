const inquirer = require('inquirer');
const { definition, thesaurus } = require('../../lib/service/api-service');
const open = require('open');

module.exports = async function define(args) {
    const resp = await definition(args.word);

    if (resp.isSuggestions) {
        const { choice } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'choice',
                    message: 'Multiple matches were found. Select one for more info',
                    choices: resp.suggestions,
                    loop: false
                },
        ]);

        define({ word: choice.trim() });
        return;
    }

    if (resp.matches.length === 1) {
        console.log(resp.matches[0].toString());
        displayMatch(resp.matches[0]);
        return;
    }

    //show match list
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Multiple matches were found. Select one for more info',
                choices: resp.matches.map(m => `${m.query} \0[${m.labels.functional}] - \0${m.definitions.shortdefs[0]}`),
                loop: false
            },
        ])
        .then(async ({ choice }) => {
            let [query, label, def] = choice.trim().split("\0");
            query = query.trim();
            label = label.substring(1, label.indexOf("]"));
            const match = resp.matches.find(e => query === e.query && label === e.labels.functional && def === e.definitions.shortdefs[0]);
            console.log(match.toString());
            displayMatch(match);
        });

}

async function displayMatch(match) {
    const prn = match.first_pronounciation;
    const thes = await thesaurus(match.query);
    const { synonyms, antonyms } = thes.get_metadata_for_tuuid(match.uuid);

    let choices = [];
    if (prn !== null) choices.push("speak");
    if (synonyms.length > 0) choices.push("synonyms");
    if (antonyms.length > 0) choices.push("antonyms");

    if (choices.length > 0)
        inquirer.prompt([
            {
                type: 'list',
                name: "choice",
                message: "Select an option for more info or press CTRL+C to quit",
                suffix: "\n",
                choices,
                loop: false
            }
        ]).then(({ choice }) => {
            if (choice === 'speak') open(prn.sound.uri);
            if (['antonyms', 'synonyms'].includes(choice)) {
                let out = choice === 'synonyms' ? synonyms : antonyms;
                let msg = "";
                for (let i = 0; i < out.length; i += 10)
                    msg += `\n ${out.slice(i, i + 10).join(", ")}`;

                console.log(msg);
            }

            displayMatch(match);
        })
}