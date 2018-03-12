# Olympus依赖注入

Olympus使用依赖注入管理数据模型及任何单例对象

实际上依赖注入本身就是单例模式的扩展，区别是传统的单例模式需要单例类自行实现getInstance方法，且单例分散，不好管理。依赖注入功能提供了一个统一的管理入口，并且提供简单的API进行注入和获取单例对象，从而提高了代码的易用性和可控性

Olympus的依赖注入有下面两种用法

- [常规用法](#常规用法)
- [装饰器用法](./decorator.md#olympus依赖注入装饰器)

本章节仅介绍常规用法，装饰器用法请参考[Olympus装饰器](./decorator.md#olympus依赖注入装饰器)章节

# 常规用法

由于依赖注入装饰器仅用于特定情况（@Injectable仅用于类型定义处，@Inject仅用于Mediator、Model类定义内部的变量上），而某些特殊情况又希望使用依赖注入功能，因此Olympus提供了依赖注入功能的常规用法

## 注入定义（对应@Injectable装饰器）

#### [core.mapInject](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#mapinject)

注入一个类型的单例。这个方法提供的是类型，而不是实例，执行方法后会立即为类型生成一个实例并注入到系统中

如果要注入实例，请使用[core.mapInjectValue](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#mapinjectvalue)

#### [core.mapInjectValue](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#mapinjectvalue)

注入一个对象实例。如果已经有实例了，或者实例希望自定义一些参数，则可以使用该方法。该方法会将传入的对象实例作为其类型的单例注入到系统中

## 获取注入单例（对应@Inject装饰器）

#### [core.getInject](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#getinject)

通过该方法，将希望获取的单例的类型传入，即可获取到已经注入的单例对象