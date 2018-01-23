# Olympus安装、配置与发布

- [安装](#安装)
    - [npm安装](#npm安装)
    - [git子模块安装](#git子模块安装)
- [配置](#配置)
    - [必要的tsconfig.json配置](#必要的tsconfig.json配置)
    - [代码引用方式](#代码引用方式)
    - [推荐IDE](#推荐ide)
- [发布](#发布)
    - [推荐发布方式](#推荐发布方式)

## 安装

#### npm安装
安装Olympus 本体库：`npm i olympus-r`;

安装Olympus DOM表现层库：`npm i olympus-r-dom`;

安装Olympus Egret表现层库：`npm i olympus-r-egret`;

例如，如果你希望开发纯DOM应用，则你需要安装olympus-r和olympus-r-dom两个包，如果你的应用既可以开发DOM页面，也可以开发Egret页面，则三个包你都要安装。

#### git子模块安装
建议使用npm安装，如果不能用npm，则也可以使用git子模块直接clone本版本库到你的项目git中。

## 配置

#### 必要的tsconfig.json配置

- module：es6/es2015/amd（请不要使用在window上挂大包的方式开发）
- moduleResolution：node（否则import代码会很麻烦且丑陋）
- experimentalDecorators：true（否则用不了装饰器）
- emitDecoratorMetadata：true（否则装饰器无法获取类型信息）

#### 代码引用方式

使用ts提供的三斜线语法可以便捷地引用olympus库，如下

    /// <reference types="olympus-r"/>
    /// <reference types="olympus-r-dom"/>
    /// <reference types="olympus-r-egret"/>

注意：三斜线引用必须写在文件最顶部，连import语句也要写在它的后面才行

#### 推荐IDE

目前已经验证过VSCode是最好用的IDE，idea系列尚未验证

## 发布

#### 推荐发布方式

- webpack
- gulp
- 只要你能发出来，用什么其实都是可以的