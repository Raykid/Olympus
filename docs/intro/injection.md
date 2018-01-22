# Olympus依赖注入
Olympus提供TypeScript装饰器注入功能，便捷获取托管对象。例如：

    export class SomeClass
    {
        @Inject // 这行就是装饰器注入的写法
        private someModel:SomeModel;
    }

上述@Inject装饰器仅能在Mediator、Module、Model中以公共变量形式使用。如果希望在其他情况下使用，可以如下：

    import { core } from "olympus-r/core/Core";

    let someModel:SomeModel = core.getInject(SomeModel);

core为Olympus核心类Core的单例对象，直接由Core模块export出来，可以直接import使用。这个用法不限环境，任何地方都可以使用。