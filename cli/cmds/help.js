const menus = {
    main: `
    definer <word>

    <word> ............... word to define
    --help ............... show help menu for a command
    --version ............ show package version
    --setup .............. add your dictionaryapi.com api secrets
  `
}

module.exports = function (args) {
    const cmd = args._[0] === 'help' ? args._[1] : args._[0];

    console.log(menus[cmd] || menus.main);
}