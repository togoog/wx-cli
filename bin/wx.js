#! /usr/bin/env node
const commander = require("commander");
const inquirer = require("inquirer");

'use strict'
// 定义脚手架的文件路径
process.env.NODE_PATH = __dirname + '/../node_modules/';

// 定义当前版本
commander.version(require("../package").version);

// 定义使用方法
commander.usage("<command>");

commander
    .command('add')
    .description('Add a new template')
    .alias('-a')
    .action(() => {
        require("../lib/add")(commander);
    });

commander
    .command("list")
    .description("List all the templates")
    .alias("-l")
    .action(() => {
        require("../lib/list")(commander);
    });

commander
    .command("init")
    .description("Generate a new project")
    .alias("-i")
    .action(() => {
        require("../lib/init")(commander);
    });

commander
    .command('delete')
    .description('Delete a template')
    .alias('-d')
    .action(() => {
        require('../lib/delete')(commander)
    })

// 执行
commander.parse(process.argv);
if (!commander.args.length) {
    commander.help();
}