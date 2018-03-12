# 远程通讯

Olympus对与后端的交互进行了大规模的封装，但同时也支持原始的交互方式

- [原始交互方式](#原始交互方式)
- [封装交互方式](#封装交互方式)
    - [远程通讯的发送](#远程通讯的发送)
    - [远程通讯的接收](#远程通讯的接收)
    - [远程通讯的作用域](#远程通讯的作用域)

## 原始交互方式

使用[HTTPUtil](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/modules/_utils_httputil_.html)可以便捷发送和接收HTTP消息

- HTTPUtil内部使用XMLHttpRequest对象实现，并进行了兼容性判断，无需担心兼容性问题
- HTTPUtil集成了超时机制，超过指定时限没有收到回调会认为失败，不会永远等待。默认超时时限为10000毫秒，即10秒
- HTTPUtil集成了重试机制，消息失败会重试发送，直到成功或者超过重试次数。默认重试次数为2次

## 封装交互方式

Olympus集成了[消息生成器](https://github.com/Raykid/TemplateGenerator)作为消息结构体代码生成工具，将消息结构体配置工作转交后端管理，有几大好处

- 代码由工具自动生成并提交到代码库，减少编码工作量
- 前后端代码完全出自同一套消息配置，完全消除联调出错的成本
- 消息结构体为强类型，可以通过代码提示完全避免开发时手滑写错的问题
- 消息生成器除了可以生成前后端代码，还可以生成WIKI文档，消除了手动书写文档的工作量

#### 远程通讯的发送

Olympus远程通讯的发送完全基于[本地消息](./message.md)体制，netManager在全局内核上监听本地消息，发现本地消息是远程消息类型则进行远程消息发送流程

Olympus远程通讯的发送方法如下

    let request:SomeRequest = new SomeRequest();
    request.someParam = "xxx";
    core.dispatch(request);

上例是全局派发方式，如果你的代码写在Mediator、Model、Command中任何一个结构内，则你可以这样发送

    class SomeMediator extends Mediator
    {
        let request:SomeRequest = new SomeRequest();
        request.someParam = "xxx";
        this.dispatch(request);
    }

在Model和Command内部使用this.dispatch会直接将消息发送到全局核中。在Mediator中使用this.dispatch会将消息发送到模块私有核中，但根据[本地消息流转规则](./message.md#olympus多核结构与消息流转规则)，消息最终还是会转发到全局核中，被netManager处理

#### 远程通讯的接收

有三种方式可以接收远程消息返回

- [netManager.listenResponse](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_net_netmanager_.netmanager.html#listenresponse)
- [@ResponseHandler装饰器](./decorator.md#responsehandler)
- [@GlobalResponseHandler装饰器](./decorator.md#globalresponsehandler)

#### 远程通讯的作用域

由于远程通讯的发送是基于本地消息的，因此流转规则与本地消息完全一致。接收方面，流转顺序和发送正好相反，返回消息会先在全局核派发，然后按顺序派发回请求所在的模块私有核，其他模块私有核不会接收到转发，保证了模块间的“私密性”，也正因如此，产生了远程通讯的“作用域”概念