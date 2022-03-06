module.exports = function () {
    const definer = require('../../package.json').version;
    console.log(`definer v${definer}`);
}