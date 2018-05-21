'use strict'
const config = require('../templates');

module.exports = () => {
    console.log(JSON.stringify(config.tpl));
    process.exit();
}