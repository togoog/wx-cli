# wx-progress 

> 一个简易的前端脚手架工具
 [![tests](https://travis-ci.org/glangzh/wx-cli.svg?branch=master)](http://travis-ci.org/glangzh/wx-cli)
 [![npm](https://img.shields.io/npm/v/wx-cli.svg?style=flat-square)](https://www.npmjs.com/package/wx-cli) [![npm](https://img.shields.io/npm/dt/wx-cli.svg?style=flat-square)](https://www.npmjs.com/package/wx-cli) [![npm](https://img.shields.io/npm/l/wx-cli.svg?style=flat-square)](https://www.npmjs.com/package/wx-cli)

## 使用方法
* 安装
```javascript
npm i wx-cli
```
* 添加模板
```javascript
wx add

> ? Template name:  wx-cli
> ? Git https link:  https://github.com/glangzh/wx-cli
> ? Branch:  master
```
* 查看模板列表
```javascript
wx list

> {"wx-cli":{
    "url":"https://github.com/glangzh/wx-cli","branch":"master"
  }}
```
* 删除模板
```javascript
wx delete
```
* 初始化项目
```javascript
wx init xxx
```