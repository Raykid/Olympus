# Olympus安装

#### npm安装
安装Olympus 本体库：`npm i olympus-r`;

安装Olympus DOM表现层库：`npm i olympus-r-dom`;

安装Olympus Egret表现层库：`npm i olympus-r-egret`;

例如，如果你希望开发纯DOM应用，则你需要安装olympus-r和olympus-r-dom两个包，如果你的应用既可以开发DOM页面，也可以开发Egret页面，则三个包你都要安装。

#### git子模块安装
建议使用npm安装，如果不能用npm，则也可以使用git子模块直接clone本版本库到你的项目git中。

#### 必要的tsconfig.json配置

- module：es6/es2015/amd（请不要使用在window上挂大包的方式开发）
- moduleResolution：node（否则import代码会很麻烦且丑陋）
- experimentalDecorators：true（否则用不了装饰器）
- emitDecoratorMetadata：true（否则装饰器无法获取类型信息）