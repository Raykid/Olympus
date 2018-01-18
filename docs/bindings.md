#### 数据绑定
如下就是一个简单的MVVM数据绑定示例，使用TypeScript标签为你的界面绑定数据，更详细的例子请看[FirstModule](../test/modules/FirstModule.ts)

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
