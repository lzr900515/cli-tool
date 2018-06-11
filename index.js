#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');

program.version('1.0.3', '-v, --version');

program.command('help')
    .action(function () {
        console.log(`
    =========================================
    ************cli-toop Help Menu***********
    =========================================
    
    -v, --version: to get cli-tool version
    help: get command tips
    init [name]: to init a project with the [name]
    
    =========================================
    author: lzr_must    email: lzr_must@163.com
    `);
    });

program.command('init <name>')
    .action(function (name) {
        if (name) {
            inquirer.prompt([
                {
                    name: 'description',
                    message: 'enter some description:'
                },
                {
                    name: 'author',
                    message: 'enter author name:'
                },
                {
                    type: 'list',
                    name: 'repository',
                    choices: ['React', 'React + Node SSR', 'Angularjs', 'jQuery', 'Vue'],
                    message: 'choose the repository:'
                }
            ]).then((answers) => {
                let gitUrl = '';
                switch (answers.repository) {
                    case 'React':
                        gitUrl = 'github:lzr900515/react-webpack-gulp-eslint#master';
                        break;
                    default:
                        gitUrl = 'github:lzr900515/reactDndDemo#master';
                        break;
                }
                const spinner = ora('down load repository...');
                spinner.start();
                download(gitUrl, name, {clone: false}, (err) => {
                    if (err) {
                        spinner.fail();
                        console.log(symbols.error, chalk.red('Failed ' + err));
                        process.exit(1);
                    } else {
                        spinner.succeed();
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        };
                        const fileTo = `${name}/package.json`;
                        const fileFrom = `${process.cwd()}/cli-tool/template/package.json`;
                        if (fs.existsSync(fileFrom)) {
                            const content = fs.readFileSync(fileFrom).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileTo, result);
                        }
                        console.log(symbols.success, chalk.green('repository init finished.'));
                    }
                });
            })
        } else {
            process.exit(1);
        }
    });

program.parse(process.argv);