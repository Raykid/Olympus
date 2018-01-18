#### TypeScript装饰器注入
框架提供TypeScript装饰器注入功能，便捷获取托管对象。例如：

    export class SomeClass
    {
        @Inject // 这行就是装饰器注入的写法
        private someModel:SomeModel;
    }
