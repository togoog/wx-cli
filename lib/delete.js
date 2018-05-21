'use strict'
const inquirer = require("inquirer");
const config = require('../templates')
const chalk = require('chalk')
const fs = require('fs')

module.exports = () => {
    if (!config.tpl || config.tpl == {} || Object.keys(config.tpl).length === 0){
        console.log(chalk.red('Template empty!'));
        return;
    }

    inquirer.prompt([{
        type: 'list',
        name: 'template',
        message: 'Select the template?',
        choices: Object.keys(config.tpl),
        filter: function (val) {
            return val.toLowerCase();
        }
    }]).then(answers => {
        let template = answers.template;
        // 删除对应的模板
        if (config.tpl[template]) {
            config.tpl[template] = undefined;
        } else {
            console.log(chalk.red('Template does not exist!'));
            process.exit();
        }

        // 更新 template.json
        fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
            if (err) console.log(err);
            console.log(chalk.green('Template deleted!'));
            console.log(chalk.grey('The last template list is: \n'));
            console.log(JSON.stringify(config));
            console.log('\n');
            process.exit();
        });
    });
}