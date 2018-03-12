# MVVM数据绑定

Olympus为界面开发提供MVVM形式的数据绑定功能

数据绑定功能只能在Mediator中使用，通常使用[装饰器](./decorator.md#olympus数据绑定装饰器)方式实现。理论上Mediator中的一切公共变量都可以绑定，包括基类中的变量，如skin和viewModel本身（绑定viewModel可一定程度上实现反向绑定）

- [使用方法](#使用方法)
- [隐式变量](#隐式变量)
- [注意事项](#注意事项)
- [高级用法](#高级用法)

## 使用方法

- 重写Mediator的onOpen方法，为this.viewModel赋值
- 在Mediator的公共变量上书写绑定装饰器

下面是一个简单的绑定实例：

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindValue("textContent", "'Hello ' + who + '!'")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                who: "World"
            };
        }
    }
    // 输出：<div id='myDiv'>Hello World!</div>

更详细的绑定实例请参考[数据绑定装饰器](./decorator.md#olympus数据绑定装饰器)章节

## 隐式变量

Olympus在绑定表达式中提供一些以$开头的隐式变量，供开发者使用，如下列出了各种情况下的隐式变量

- 任何情况下
    - $this：指向Mediator
    - $data：指向ViewModel
    - $bridge：指向表现层桥
    - $currentTarget：指向表达式当前作用对象
    - $target：指向表达式绑定对象，如果在@BindFor内部则指向renderer
- 在@BindFor内部
    - $key：指向遍历到的键
    - $value：指向遍历到的值
    - $parent：指向上一级ViewModel

## 注意事项

- 在绑定表达式中以及在viewModel的方法中，如果没有使用Lambda表达式且没有使用.bind方法修改this指向的话，this都会指向viewModel
- viewModel就是一个常规Object，一切变量、方法、getter/setter都可以放到viewModel里，而无需提供其他结构体

## 高级用法
- 通过在Mediator中声明skin变量对界面整体进行绑定。由于skin存在于基类中，并由基类逻辑赋值，因此子类中仅需声明即可，无需赋值
- 通过在Mediator中声明viewModel变量对viewModel进行绑定。此做法可一定程度上实现反向绑定