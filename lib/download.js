const exec = require('child_process').exec
const ora = require('ora');

// 1. 根据具体的模板地址设置下载的url，注意，如果是git，url后面需添加 branch 信息
// 2. 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
// 3. 设置默认模板地址
// const url = "https://github.com:username/templates-repo.git#master";

module.exports = (url, target) => {
    let cmdStr = `git clone ${url} ${target} && cd ${target}`;
    return (branch) => {
        if(branch){
            cmdStr = cmdStr + ` && git checkout ${branch}`;
        }
        cmdStr = cmdStr + ` && npm install`;

        const spinner = ora(`正在加载项目模板：${url}`);
        spinner.start();
        
        return new Promise((resolve, reject)=>{
            exec(cmdStr, (error, stdout, stderr) => {
                if (error) {
                    spinner.fail();
                    reject(error);
                } else {
                    spinner.succeed();
                    resolve(target);
                }
            });
        });
    }
}