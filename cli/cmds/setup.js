const inquirer = require('inquirer');
const db = require("../../lib/service/db");

module.exports = async function() {

    const { collegiate } = await inquirer.prompt([
        {
            name: "collegiate",
            type: "input",
            message: "Enter your dictionary.com Collegiate API key secret:"
        }
    ]);

    await db.updateApiKey('collegiate', collegiate);

    const { addThesaurus } = await inquirer.prompt([
        {
            name: "addThesaurus",
            type: "confirm",
            message: "Do you want to include a dictionaryapi.com thesaurus api key?",
            default: false
        }
    ]);

    if (addThesaurus) {

        const { thesaurus } = await inquirer.prompt([
            {
                name: "thesaurus",
                type: "input",
                message: "Enter your dictionary.com Thesaurus API key secret:"
            }
        ]);

        await db.updateApiKey('thesaurus', thesaurus);
    }

    console.log("Successfully updated configs");
}