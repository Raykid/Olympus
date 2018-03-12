# 表现层桥

Olympus的设计目标是可操作任何web前端渲染引擎，且可随时平滑切换，对开发者透明，因此在表现层方面，Olympus使用了桥接模式对表现层进行了抽象，桥的一端与表现层完全无关，桥的另一端只包含表现层相关的操作，且都实现了统一的桥接接口，从而达到本体库可以与任意表现层库搭配使用的目的

- [当前实现的库](#当前实现的库)
- [表现层桥使用方法](#表现层桥使用方法)

## 当前实现的库

- 本体：Olympus本体库不包含任何显示相关的部分，对应NPM包名为`olympus-r`
- DOM表现层：Olympus DOM表现层库仅包含所有DOM渲染操作，对应NPM包名为`olympus-r-dom`
- Egret表现层：Olympus Egret表现层库仅包含所有Egret渲染操作，对应NPM包名为`olympus-r-egret`

## 表现层桥使用方法

1. 首先必须安装本体库`olympus-r`
2. 如果需要开发DOM界面，则安装DOM表现层库`olympus-r-dom`
3. 如果需要开发Egret界面，则安装Egret表现层库`olympus-r-egret`
4. 如果应用同时需要开发DOM和Egret界面，则两个库都要安装
5. 如果某个界面需要DOM和Egret并存，则以其中一个Mediator作为场景，另一个Mediator作为组件，使用@SubMediator装饰器组合到场景Mediator中