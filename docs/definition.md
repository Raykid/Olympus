# Olympus的一些抽象定义

- [数据模型](#数据模型)
- [模块](#模块)
- [界面](#界面)
- [命令](#命令)

## 数据模型

#### 类名
Model

#### 描述
数据模型是数据和服务的集中营，将与后端通讯的逻辑和一些数据逻辑封装在Model内部，对外提供简洁的API供界面逻辑和业务逻辑使用

#### 特殊用法
- 可以将远程通讯的返回结构体实例直接保存在Model的公共变量上
- Model默认会被注入到系统中，且可以整体被绑定到viewModel中
- 上述两个用法配合使用，可以极大降低业务逻辑代码量，具体请在实践中体会^m^

下例展示了将Model整体绑定到viewModel中的使用方式

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @Inject
        private _someModel:SomeModel;

        @BindValue("textContent", "'My name is ' + someModel.userName")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                someModel: this._someModel
            };
        }
    }
    // 输出：<div id='myDiv'>My name is Raykid</div>

## 模块

#### 管理器
ModuleManager

#### 描述
- 模块现在退化成为Mediator的一个子功能，不再存在具体的基类
- 整个应用程序完全是由启动配置和[1, +∞)个模块组合而成的，同一时间同一模块仅可以存在一个实例
- 一个模块通常由一个人完成，是应用程序划分的最小单位，因此模块的粒度需要根据需要进行把控，过大则不够灵活，过小则开销太大。通常采取一个[界面](#界面)对应一个模块

## 界面

#### 对应概念：Mediator
界面中介者。不是界面实体，用来管理界面实体、书写界面逻辑、扩展界面实体功能、与框架其他部分沟通的对象。通常一个界面实体对应一个Mediator

#### Mediator的功能
界面实体通常是DOM标签，比如div标签，或者egret显示对象，他们本身不具备和Olympus框架交互的能力，Mediator作为他们和Olympus交互的媒介，为界面实体扩展出了如下功能

- [依赖注入](./injection.md)：可以注入数据层对象以便捷操作数据层，也可以注入工具对象，使用其提供的工具方法
- [数据绑定](./bindings.md)：采用MVVM架构、基于TypeScript装饰器和元数据反射功能实现的数据绑定，让界面开发更简洁
- [本地消息通信](./message.md)：可以便捷地发送和接收本地事件，与模块外进行沟通
- [远程消息通信](./remote.md)：可以便捷地发送和接收由服务器配置的、强类型的远程通讯消息
- 每个Mediator都拥有自己独立的资源加载、初始化消息派发与接收、界面组织与展现、销毁与资源回收等功能
- Mediator可通过@SubMediator装饰器包含另外的Mediator，从而生成一个树状结构。最顶级的Mediator可被当做模块使用

#### Mediator分类
- 组件（Component）：可复用于另外一个任意类型界面中的最灵活的界面类型，需要自行添加和移除显示。父类为Mediator
- 弹窗（Panel）：不覆盖全屏，同一时间可以有[0, +∞)个实例显示的界面类型，由PanelManager管理添加和移除显示，拥有动画弹出和关闭能力。父类为PanelMediator
- 场景（Scene）：覆盖全屏，同一时间有且仅有一个实例显示的界面类型，由SceneManager管理添加和移除显示，拥有动画切换场景能力。父类为SceneMediator

#### @MediatorClass装饰器

Mediator需要使用@MediatorClass装饰器进行装饰才能具有完整的界面中介者的功能。@MediatorClass根据表现层不同也有所区别，分类如下：
- @DOMMediatorClass：标识此Mediator操作的是DOM界面实体
- @EgretMediatorClass：标识此Mediator操作的是Egret界面实体

具体描述请看[装饰器](./decorator.md)章节。

#### 示例

开发一个界面需要声明一个class，根据实际需要继承自上述分类中的任意一个，并且使用@MediatorClass装饰器进行修饰。如下代码示范了一个最简单的界面Mediator的写法：

## 命令

#### 类名
Command

#### 描述
命令对应MVC结构中的C层，在本地消息派发时被创建并执行，也就是完全依托于[本地消息](./message.md)系统

#### 对比闭包
Command是个类，但内部仅有一个exec方法，因此实际上和闭包差异不大。但它比起闭包还是有些优势的

- 可以继承，而Command基类提供了很多有用的工具方法和属性
- 可以方便地使用类名进行注册和注销，闭包如果是匿名的或管理不善在这方面就会有困难
- 可以扩展Command功能，例如宏指令、复合指令、Promise指令、树状指令等，闭包则不方便扩展