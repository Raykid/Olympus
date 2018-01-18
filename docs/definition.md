# Olympus的一些抽象定义

## 模块

#### 类名
Module

#### 管理器
ModuleManager

#### 描述
- 整个应用程序完全是由启动配置和[1, +∞)个模块组合而成的
- 每个模块都拥有自己独立的资源加载、初始化消息派发与接收、界面组织与展现、销毁与资源回收等功能
- 一个模块通常由一个人完成，是应用程序划分的最小单位，因此模块的粒度需要根据需要进行把控，过大则不够灵活，过小则开销太大。通常采取一个[界面](./definition.md#界面)对应一个模块
- 模块之间不可相互引用，必须通过[本地消息系统](./message.md)相互通信，从而消除模块间相互依赖的可能性
- 模块内部由[0, +∞)个[界面](./definition.md#界面)组成
  - 逻辑模块：界面数是0。即没有界面逻辑，全部为业务逻辑的模块。可用于制作条件跳转模块（根据条件判断要跳转到哪个模块，类似HTTP的302状态码的功能）
  - 界面模块：界面数大于0。绝大多数模块都是这种类型

#### 示例

开发一个模块需要声明一个class，继承自Module，并且使用@ModuleClass装饰器进行修饰，如下

    import Module from 'olympus-r/engine/module/Module';
    import { ModuleClass, DelegateMediator } from 'olympus-r/engine/injector/Injector';
    
    @ModuleClass
    class SomeModule extends Module
    {
        @DelegateMediator // 使用DelegateMediator装饰器声明托管给模块的界面
        private _mediator1:SomeMediator1;
        
        @DelegateMediator // 可以托管任意多个界面到一个模块上
        private _mediator2:SomeMediator2;
    }

## 界面

#### 对应概念：Mediator
界面中介者。不是界面实体，用来管理界面实体、书写界面逻辑、扩展界面实体功能、与框架其他部分沟通的对象。通常一个界面实体对应一个Mediator

#### Mediator的功能
界面实体通常是DOM标签，比如div标签，或者egret显示对象，他们本身不具备和Olympus框架交互的能力，Mediator作为他们和Olympus交互的媒介，为界面实体扩展出了如下功能

- [依赖注入](./injection.md)：可以注入数据层对象以便捷操作数据层，也可以注入工具对象，使用其提供的工具方法
- [数据绑定](./bindings.md)：采用MVVM架构、基于TypeScript装饰器和元数据反射功能实现的数据绑定，让界面开发更简洁
- [本地消息通信](./message.md)：可以便捷地发送和接收本地事件，与模块外进行沟通
- [远程消息通信](./remote.md)：可以便捷地发送和接收由服务器配置的、强类型的远程通讯消息

#### Mediator分类
- 组件（Component）：可复用于另外一个任意类型界面中的最灵活的界面类型，需要自行添加和移除显示。父类为Mediator
- 弹窗（Panel）：不覆盖全屏，同一时间可以有[0, +∞)个实例显示的界面类型，由PanelManager管理添加和移除显示，拥有动画弹出和关闭能力。父类为PanelMediator
- 场景（Scene）：覆盖全屏，同一时间有且仅有一个实例显示的界面类型，由SceneManager管理添加和移除显示，拥有动画切换场景能力。父类为SceneMediator