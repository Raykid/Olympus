# Olympus

#### 定位
一个力求简单易用的前端开发框架

#### 开发语言
TypeScript

#### 核心架构
MVC（整体架构）/MVVM（界面内数据绑定）

#### 多核通讯和解耦
采用观察者模式，利用一个全局唯一的消息内核进行模块间通讯，解耦模块间依赖。同时每个模块拥有一个私有的消息内核，用于派发模块内消息，模块内消息会被转发给全局内核，但全局消息不会被转发给模块内核。

#### 表现层结构
使用桥接模式拆分接口与实现，达到一套核心驱动多套表现层的目的（目前支持DOM、Egret两种表现层），同时支持表现层的未来可扩展性

#### npm安装
安装Olympus主库：`npm i olympus-r`;
安装Olympus DOM表现层库：`npm i olympus-r-dom`;
安装Olympus Egret表现层库：`npm i olympus-r-egret`;

例如，如果你希望开发纯DOM应用，则你需要安装olympus-r和olympus-r-dom两个包，如果你的应用既可以开发DOM页面，也可以开发Egret页面，则三个包你都要安装。

#### git子模块安装
建议使用npm安装，如果不能用npm，则也可以使用git子模块直接clone本版本库到你的项目git中。

#### TypeScript装饰器注入
框架提供TypeScript装饰器注入功能，便捷获取托管对象。例如：

    export class SomeClass
    {
		@Inject // 这行就是装饰器注入的写法
		private someModel:SomeModel;
	}

#### 数据绑定
如下就是一个简单的MVVM数据绑定示例，使用TypeScript标签为你的界面绑定数据，更详细的例子请看https://github.com/Raykid/Olympus/blob/master/test/modules/FirstModule.ts

	@DOMMediatorClass("./modules/test.html")
	class FirstMediator extends SceneMediator
	{
		@Inject
		private someModel:SomeModel;
		
		// 将viewModel中的testText属性绑定到txt标签的textContent属性上
		// 你可以使用@BindValue装饰器绑定任何属性，只要你绑定的组件有这个属性
	    @BindValue("textContent", "testText")
	    public txt:HTMLElement;

		// 为btn标签添加click事件，点击时执行viewModel中的onClick方法
	    @BindOn("click", "onClick")
	    public btn:HTMLElement;
	
	    public onOpen():void
	    {
	        this.viewModel = {
	            testText: "Hello World!",
	            onClick: function():void
	            {
		            // 修改testText属性为“clicked”，此时txt标签文本会从“Hello World!”变成“clicked”
	                this.testText = "clicked";
	            },
	            // 你甚至可以将注入的Model对象加入你的绑定数据里，是不是很酷？
	            someModel: this.someModel
	        };
	    }
	}

#### 其他值得说的
1. 业务模块高度封装，尝试将开发代码量降到最低；
2. 极大简化各系统复杂度，极大降低上手难度。