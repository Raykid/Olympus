# Olympus
#### 定位
一个力求简单易用的前端开发框架
#### 开发语言
TypeScript
#### 核心架构
MVC
#### 模块间通讯和解耦
采用事件机制，利用一个全局唯一的事件派发器进行模块间通讯，解耦模块间依赖
#### 表现层结构
使用桥接模式拆分接口与实现，达到一套核心驱动多套表现层的目的（目前支持DOM、Egret、PixiJS三种表现层），同时支持表现层的未来可扩展性
#### TypeScript装饰器注入
框架提供TypeScript装饰器注入功能，便捷获取托管对象。例如：

    export class Fuck
    {
		@Inject(model.SomeModel)// 折行就是装饰器注入的写法
		private someModel:model.SomeModel;
	}
#### 其他值得说的
1. 业务模块高度封装，尝试将开发代码量降到最低；
2. 极大简化各系统复杂度，极大降低上手难度。