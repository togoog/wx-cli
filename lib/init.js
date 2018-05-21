"use strict";
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const list = glob.sync('*');
const download = require("./download");
var config = require('../templates');
const add = require("./add");
const exec = require('child_process').exec;

module.exports = (program) => {
    // 根据输入，获取项目名称
    let projectName = program.args[2];
    if (!projectName) {
        inquirer.prompt([{
            name: 'projectName',
            message: '请输入项目名称: '
        }]).then(answers => {
            if(answers.projectName) {
                init(program, answers.projectName);
            } else {
                // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
                program.help();
                return;
            }
        });
    } else {
        init(program, projectName);
    }
};

// 1. 当前目录下是否已存在要创建文件
// 2. 如果不存在，当前目录是否为要创建文件
// 3. 在当前目录下创建文件
const init = (program, projectName) => {
    let next = undefined;  // promise
    let rootName = path.basename(process.cwd());  //当前目录
    if (list.length) {
        if (list.filter(name => {
            const fileName = path.resolve(process.cwd(), path.join('.', name));
            const isDir = fs.statSync(fileName).isDirectory();
            return name.indexOf(projectName) !== -1 && isDir;
        }).length !== 0) {
            console.log(`项目${projectName}已经存在`);
            return;
        }
        next = Promise.resolve(projectName);
    } else if (rootName === projectName) {
        next = inquirer.prompt([
            {
                name: 'Ok',
                message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
                type: 'confirm',
                default: true
            }
        ]).then(answer => {
            return Promise.resolve(answer.Ok ? '.' : projectName);
        })
    } else {
        next = Promise.resolve(projectName);
    }

    if(next){
        // 检查是否有模板
        if (config.tpl) {
            go(next);
        }else{
            add((_config) => {
                config = _config;
                go(next);
            });
        }
    }
};

// 1. 同步创建文件目录
// 2. 下载模板
const go = (next) => {
    next.then(projectRoot => {
        return inquirer.prompt([{
            type: 'list',
            name: 'template',
            message: 'Select the template?',
            choices: Object.keys(config.tpl),
            filter: function (val) {
                return val.toLowerCase();
            }
        }]).then(answers => {
            if (projectRoot !== '.') {
                fs.mkdirSync(projectRoot);
            }

            let url = config.tpl[answers.template].url;
            let branch = config.tpl[answers.template].branch;
            return download(url, projectRoot)(branch);
        });
    }).then(target => {
        return inquirer.prompt([
            {
                name: 'version',
                message: '项目的版本号: ',
                default: '1.0.0'
            }, {
                name: 'author',
                message: 'author: '
            }, {
                name: 'desc',
                message: '项目的简介: '
            }
        ]).then(answers => {
            updatePackage(target, answers);
        })
    }).catch(err => {
        console.error(err)
    })
};

/**
 * 按用户输入替换package.json
 * @param {*} target
 * @param {*} answers 
 */
const updatePackage = (target, answers) => {
    fs.readFile('./' + target + '/package.json', function (err, data) {
        if (err) {
            return console.error(err);
        }

        let pkg = JSON.parse(data.toString());
        if (pkg) {
            pkg.version = answers.version;
            pkg.author = answers.author;
            pkg.description = answers.desc;
        }
    });
}