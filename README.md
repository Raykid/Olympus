# Olympus用户手册

- ### [简介](./docs/summary.md)

- ### [安装、配置与发布](./docs/install.md)

- ### [脚手架工具](./docs/scaffold.md)

- ### [抽象定义](./docs/definition.md)

- ### [装饰器](./docs/decorator.md)

- ### [依赖注入](./docs/injection.md)

- ### [数据绑定](./docs/bindings.md)

- ### [表现层桥](./docs/bridge.md)

- ### [多核本地消息](./docs/message.md)

- ### [远程通讯](./docs/remote.md)

# Olympus API

由于Olympus被设计成“1 vs. n”的方式（即一套业务逻辑对应多套表现层的桥接模式，举例：业务层执行addChild，实际在DOM中执行的是appendChild，在Egret中执行的是addChild），因此代码被分拆到了多个部分中，可根据实际情况选择所需的表现层与本体进行搭配使用。当前所有库的API目录如下

- ### [API-本体](https://htmlpreview.github.io/?https://github.com/Raykid/Olympus/blob/master/trunk/docs/index.html)

- ### [API-DOM表现层](https://htmlpreview.github.io/?https://github.com/Raykid/Olympus/blob/master/branches/dom/docs/index.html)

- ### [API-Egret表现层](https://htmlpreview.github.io/?https://github.com/Raykid/Olympus/blob/master/branches/egret/docs/index.html)