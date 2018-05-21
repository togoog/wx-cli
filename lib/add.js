'use strict'
const config = require('../templates.json');
const inquirer = require("inquirer");
const chalk = require('chalk');
const fs = require('fs');

module.exports = (next) => {
  let questions = [
    {
      type: 'input',
      name: 'template',
      message: "Template name: "
    },
    {
      type: 'input',
      name: 'link',
      message: "Git https link: "
    },
    {
      type: 'input',
      name: 'branch',
      message: "Branch: "
    }
  ];

  inquirer.prompt(questions).then(answers => {
    let template = answers.template;
    let link = answers.link;
    let branch = answers.branch;

    // 避免重复添加
    if (!config.tpl[template]) {
      config.tpl[template] = {};
      config.tpl[template]['url'] = link.replace(/[\u0000-\u0019]/g, ''); // 过滤unicode字符
      config.tpl[template]['branch'] = branch;
    } else {
      console.log(chalk.red('Template has already existed!'));
      process.exit();
    }

    // 把模板信息写入templates.json
    fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config), 'utf-8', (err) => {
      if (err) console.log(err);
      console.log(chalk.green('New template added!\n'));
      console.log(chalk.grey('The last template list is: \n'));
      console.log(config);
      console.log('\n');
      process.exit();
      next && next(config);
    })
  });
}