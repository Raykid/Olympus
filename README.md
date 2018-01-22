# Olympus介绍

- ### [简介](./docs/intro/summary.md)

- ### [安装](./docs/intro/install.md)

- ### [定义](./docs/intro/definition.md)

- ### [装饰器](./docs/intro/decorator.md)

- ### [表现层桥](./docs/intro/bridge.md)

- ### [依赖注入](./docs/intro/injection.md)

- ### [数据绑定](./docs/intro/bindings.md)

- ### [本地消息](./docs/intro/message.md)

- ### [远程通讯](./docs/intro/remote.md)

# Olympus API

由于Olympus被设计成“1 vs. n”的方式（即一套业务逻辑对应多套表现层的桥接模式，举例：业务层执行addChild，实际在DOM中执行的是appendChild，在Egret中执行的是addChild），因此代码被分拆到了多个部分中，可根据实际情况选择所需的表现层与本体进行搭配使用。当前所有库的API目录如下

- ### [API-本体](./trunk/docs/index.html)

- ### [API-DOM表现层](./branches/dom/docs/index.html)

- ### [API-Egret表现层](./branches/egret/docs/index.html)