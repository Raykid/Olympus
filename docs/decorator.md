# Olympus装饰器

Olympus大量使用了TypeScript装饰器。原则上所有装饰器都可以使用原始方式代替，但使用装饰器会大大提高开发效率

当前流行的ECMAScript标准尚未支持装饰器功能（要到ES7才能支持，当前流行的是ES6），因此目前若要使用装饰器，只能用TypeScript开发

下面是所有Olympus装饰器

- [Olympus模块装饰器](#olympus模块装饰器)
    - [@ModelClass](#modelclass)
    - [@MediatorClass](#mediatorclass)
        - [@DOMMediatorClass](#dommediatorclass)
        - [@EgretSkin](#egretskin)
        - [@EgretMediatorClass](#egretmediatorclass)
    - [@SubMediator](#submediator)
- [Olympus本地消息装饰器](#olympus本地消息装饰器)
    - [@MessageHandler](#messagehandler)
    - [@GlobalMessageHandler](#globalmessagehandler)
- [Olympus远程通讯装饰器](#olympus远程通讯装饰器)
    - [@ResponseHandler](#responsehandler)
    - [@GlobalResponseHandler](#globalresponsehandler)
- [Olympus依赖注入装饰器](#olympus依赖注入装饰器)
    - [@Injectable](#injectable)
    - [@Inject](#inject)
- [Olympus数据绑定装饰器](#olympus数据绑定装饰器)
    - [@BindValue](#bindvalue)
    - [@BindFunc](#bindfunc)
    - [@BindOn](#bindon)
    - [@BindIf](#bindif)
    - [@BindFor](#bindfor)

# Olympus模块装饰器

## ModelClass

类级装饰器，标识一个类是一个数据模型（Model）。除了具有@Injectable装饰器的功能外，还可以在类内部使用变量级和方法级装饰器（@Injectable不能在类内部使用变量级和方法级装饰器）。

    @ModelClass
    class SomeModel extends Model
    {
        // 在Model内部可以使用变量级装饰器
        @Inject
        private _otherModel:OtherModel;

        // 在Model内部可以使用方法级装饰器
        @MessageHandler("MsgDispatched")
        private onMsgDispatched():void
        {
        }
    }

## MediatorClass

类级装饰器，标识一个类是一个界面中介者（Mediator）。具有可以在类内部使用变量级和方法级装饰器的能力，但类不可被注入（区别于Model）

    @MediatorClass
    class SomeMediator extends Mediator
    {
        // 在Mediator内部可以使用变量级装饰器
        @Inject
        private _someModel:SomeModel;

        // 在Mediator内部可以使用方法级装饰器
        @MessageHandler("MsgDispatched")
        private onMsgDispatched():void
        {
        }
    }

## DOMMediatorClass

类级装饰器，对DOM界面开发进行的封装。除了具有@MediatorClass的功能外，还集成了对DOM界面的操作功能，包括初始化、反射引用等

#### DOM模板用法

    // 传入模板路径。注意：相对路径起始地址为项目入口html页面，不是当前ts文件
    @DOMMediatorClass("./template.html")
    class DOMMediator extends Mediator
    {
    }

#### DOM字符串用法

    @DOMMediatorClass("<div id='myDiv'>这是一个DOM字符串</div>")
    class DOMMediator extends Mediator
    {
        // 字符串中拥有id的节点都会被反射到Mediator中，模板用法中也支持反射
        private myDiv:HTMLDivElement;
    }

## EgretSkin

类级装饰器，标识某个Mediator是操作Egret显示对象的Mediator

#### 可以且应该与@MediatorClass共同使用，但有个简洁用法请参考：[EgretMediatorClass](#egretmediatorclass)装饰器

    // 在EgretWing中拥有一个导出类名为SomeSkin的皮肤
    @EgretSkin("SomeSkin")
    @MediatorClass
    class EgretMediator extends Mediator
    {
    }

## EgretMediatorClass

类级装饰器，对Egret界面开发进行的封装。标识某个Mediator是操作Egret显示对象的Mediator，等价于@EgretSkin和@MediatorClass两个装饰器共同作用

#### 上例完全可以写成这样

    // 在EgretWing中拥有一个导出类名为SomeSkin的皮肤
    @EgretMediatorClass("SomeSkin")
    class EgretMediator extends Mediator
    {
    }

#### 如果皮肤中拥有id为someId的eui.Button，则可反射到Mediator中

    @EgretMediatorClass("SomeSkin")
    class EgretMediator extends Mediator
    {
        // 只要皮肤中起了id，便可以反射到Mediator中
        private someId:eui.Button;
    }

## SubMediator

变量级装饰器，托管一个子Mediator到当前Mediator内部，托管后的Mediator所有操作完全与父级同步，即Mediator的onOpen方法和onDispose方法都会与父级Mediator的同名方法同时执行

该装饰器为“组合模式”的一个实现，使得开发者可以通过组装多个不同组件级Mediator而生成一个更大的组件级Mediator或模块级Mediator

对应底层操作：[Mediator.delegateMediator](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_module_module_.module.html#delegatemediator)

    class ParentMediator extends Mediator
    {
        // 在Mediator内部可以通过@SubMediator装饰器托管任意多个Mediator
        @SubMediator
        private _sub1:SomeMediator;
        @SubMediator
        private _sub2:OtherMediator;
    }

# Olympus本地消息装饰器

Olympus顶级消息内核是core对象，此外每个Mediator拥有一个私有的消息内核，消息派发在内核树状结构中遵循“冒泡”方式

更多信息请参考[多核本地消息](./message.md)章节

## MessageHandler

方法级装饰器，将某个方法绑定到某个本地消息上，当该类型的本地消息派发时会执行该方法

对应的底层操作：[Mediator.listen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_module_module_.module.html#listen)、[Mediator.listen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_mediator_mediator_.mediator.html#listen)、[core.listen](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#listen)

    class SomeMediator
    {
        // 参数化用法
        @MessageHandler("MsgDispatch")
        private onMsgDispatch():void
        {
        }

        // 无参数化用法，要求方法首个参数类型必须为IMessage的实现类
        @MessageHandler
        private onAnotherMsgDispatch(msg:AnotherMsg):void
        {
        }
    }

## GlobalMessageHandler

方法级装饰器，和@MessageHandler类似，区别是@GlobalMessageHandler会明确监听最顶级消息内核中的消息，@MessageHandler则根据装饰器所属消息内核而有所区别

# Olympus远程通讯装饰器

方法级装饰器，将某个方法绑定到某个本地消息上，当该类型的本地消息派发时会执行该方法

更多信息请参考[远程通讯](./remote.md)章节

## ResponseHandler

方法级装饰器，将某个方法绑定到某个远程消息上，当该类型的远程消息收到服务器返回时会执行该方法

对应的底层操作：[netManager.listenResponse](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_net_netmanager_.netmanager.html#listenresponse)

    class SomeMediator
    {
        // 参数化用法
        @ResponseHandler(SomeResponse)
        private onMsgDispatch():void
        {
        }

        // 无参数化用法，要求方法首个参数类型必须为ResponseData的子类
        @ResponseHandler
        private onAnotherMsgDispatch(res:SomeResponse):void
        {
        }
    }

## GlobalResponseHandler

方法级装饰器，和@ResponseHandler类似，区别是@GlobalResponseHandler会明确监听最顶级消息内核中的通讯返回，@ResponseHandler则根据装饰器所属消息内核而有所区别

# Olympus依赖注入装饰器

更多信息请参考[依赖注入](./injection.md)章节

## Injectable

类级装饰器，用来标识某个类在程序初始化时生成单例并注入到core中，且可以通过[Inject](#inject)装饰器注入。

对应的底层操作：[core.mapInject](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#mapinject)、[core.mapInjectValue](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#mapinjectvalue)

@Injectable标签具有参数化用法和无参数化用法，如下

#### 参数化用法1

    @Injectable(BaseClass)
    class SomeClass extends BaseClass
    {
        // 这种用法将SomeClass注入到BaseClass中
        // 可以使用@Inject(BaseClass)获取SomeClass单例
    }

#### 参数化用法2

    @Injectable(1, "BaseClass")
    class SomeClass
    {
        // 一次可以将某个class注入到多个其他类型上，且不一定非要是个class
    }

#### 无参数化用法

    @Injectable
    class SomeClass
    {
        // 无参数化注入等价于将自身注入到自身类型上
        // 当前例子等价于：@Injectable(SomeClass)
    }

通常情况下我们都会使用无参数化注入。参数化注入通常用于“多态注入”，也叫做“桥接注入”，即注入时只提供一个基类，注入的实体是实现了该基类的具体实现类，可以在运行时随时切换实现类以达到桥接的目的。

## Inject

变量级装饰器，与@Injectable装饰器搭配使用，用来获取通过@Injectable注入的类型单例。

对应的底层操作：[core.getInject](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_core_core_.core.html#getinject)

#### 对应Injectable参数化用法1

    class SomeMediator
    {
        // 下面两个方式都是通过提供BaseClass类型来获取SomeClass单例
        @Inject
        private _someClass1:BaseClass;
        @Inject(BaseClass)
        private _someClass2:any;

        public onOpen():void
        {
            console.log(this._someClass1 instanceof SomeClass); // true
            console.log(this._someClass2 instanceof SomeClass); // true
        }
    }

#### 对应Injectable参数化用法2

    class SomeMediator
    {
        // 通过提供数字1和字符串"BaseClass"来获取SomeClass单例
        @Inject(1)
        private _someClass1:BaseClass;
        @Inject("BaseClass")
        private _someClass2:BaseClass;

        public onOpen():void
        {
            console.log(this._someClass1 instanceof SomeClass); // true
            console.log(this._someClass2 instanceof SomeClass); // true
        }
    }

#### 对应Injectable无参数化用法

    class SomeMediator
    {
        // 这应该是实际情况中最常见的用法
        @Inject
        private _someClass:SomeClass;
    }

# Olympus数据绑定装饰器

Olympus中的数据绑定都是通过TypeScript装饰器实现的，基于表现层提供的反射功能将显示对象反射到Mediator中，再在显示对象上添加装饰器来实现MVVM数据绑定

绑定装饰器全部为变量级装饰器，且均只能写在Mediator内部。每个绑定装饰器都有bindManager提供的底层方法对应，但使用过于复杂，不建议直接使用底层方法

由于不同表现层的绑定写法完全一样，因此绑定装饰器仅以DOM表现层举例，其他表现层的绑定请以此类推

更多信息请参考[数据绑定](./bindings.md)章节

## BindValue

绑定显示对象属性

对应底层操作：[bindManager.bindValue](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_bind_bindmanager_.bindmanager.html#bindvalue)

#### 重载1：一次绑定一个属性

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

#### 重载2：一次绑定多个属性

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindValue({
            // 一级寻址
            "textContent": "'Hello ' + who + '!'",
            // 多级寻址（.运算符方式）
            "style.color": "color",
            // 多级寻址（嵌套结构方式）
            {
                style: {
                    position: "position",
                    top: "top",
                    left: "left"
                }
            }
        })
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                who: "World",
                color: "red",
                position: "absolute",
                top: "0%",
                left: 50%
            };
        }
    }
    // 输出：<div id='myDiv' style='color:red; position:absolute; top:0%; left:50%;'>Hello World!</div>
    // 所有绑定命令的寻址都可以通过.运算符或嵌套结构寻址到任意深度

ViewModel本身也可以嵌套结构，例如上面的示例可以简化为如下形式

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindValue({
            "textContent": "'Hello ' + who + '!'",
            // 直接把style对象甩给div的style属性
            "style": "style"
        })
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                who: "World",
                style: {
                    color: "red",
                    position: "absolute",
                    top: "0%",
                    left: 50%
                }
            };
        }
    }
    // 输出：<div id='myDiv' style='color:red; position:absolute; top:0%; left:50%;'>Hello World!</div>

## BindFunc

绑定显示对象方法，与@BindValue类似，区别是@BindValue是赋值显示对象的属性，@BindFunc会执行显示对象的方法

对应底层操作：[bindManager.bindFunc](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_bind_bindmanager_.bindmanager.html#bindfunc)

#### 重载1：一次绑定一个方法

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindFunc("updateText", "'Hello ' + who + '!'")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                who: "World"
            };
        }
    }
    // 每次who的值改变时会执行myDiv.updateText('Hello ' + who + '!')
    // 注意：div标签并没有updateText方法，这个方法是我捏造的，就是表达个意思

#### 重载2：一次绑定多个方法

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindFunc({
            updateText: "'Hello ' + who + '!'",
            updateStyle: "style"
        })
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                who: "World",
                style: {
                    color: "red",
                    position: "absolute",
                    top: "0%",
                    left: 50%
                }
            };
        }
    }
    // 注意：div标签并没有updateText和updateStyle方法，这两个方法都是我捏造的
    // @BindFunc的寻址与@BindValue完全一致

## BindOn

为显示对象添加事件监听

对应底层操作：[bindManager.bindOn](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_bind_bindmanager_.bindmanager.html#bindon)

#### 重载1：一次添加一个监听

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 绑定回调方法引用
        @BindOn("click", "onClick1")
        // 绑定回调方法执行
        @BindOn("click", "onClick2(msg)")
        // 直接绑定表达式执行
        @BindOn("click", "console.log(msg))// 输出：I'm the Message!
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                msg: "I'm the Message!",
                onClick1: function():void
                {
                    // 绑定方法引用的this指向viewModel
                    console.log(this.msg);// 输出：I'm the Message!
                },
                onClick2: function(msg:string):void
                {
                    console.log(msg);// 输出：I'm the Message!
                }
            };
        }
    }

#### 重载2：一次绑定多个事件监听

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 绑定单击和双击两个事件监听
        @BindOn({
            click: "onClick",
            dbclick: "onDoubleClick"
        })
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                msg: "I'm the Message!",
                onClick: function():void
                {
                    console.log("这里是单击事件");
                },
                onDoubleClick: function():void
                {
                    console.log("这里是双击事件");
                }
            };
        }
    }

#### 重载3：具有寻址的事件监听

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindOn("style", "change", "onStyleChange")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                msg: "I'm the Message!",
                onStyleChange: function():void
                {
                    console.log("Style有变化了");
                }
            };
        }
    }
    // 注意：style上可能并没有change事件，这是我瞎写的
    // 寻址方式与@BindValue完全一样

## BindIf

@BindIf有两个功能
- 控制显示对象的显示和隐藏（添加删除显示列表，而不是控制visible或alpha）
- 控制子对象的绑定编译（表达式求值为false时不会进行子对象编译，直到第一次变为true）

对应底层操作：[bindManager.bindIf](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_bind_bindmanager_.bindmanager.html#bindif)

#### 重载1： 绑定当前显示对象

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindIf("test % 2 === 1")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                test: 0
            };
            setInterval(()=>{
                this.viewModel.test ++;
            }, 1000);
        }
    }

#### 重载2：可寻址的绑定

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 假设myDiv上面存在一个名为subDiv的子显示对象
        @BindIf("subDiv", "test % 2 === 1")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                test: 0
            };
            setInterval(()=>{
                this.viewModel.test ++;
            }, 1000);
        }
    }

#### 重载3：一次绑定多个对象

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 假设myDiv上面存在名为subDiv1和subDiv2的子显示对象
        @BindIf({
            subDiv1: "test % 2 === 0"
            subDiv2: "test % 2 === 1"
        })
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                test: 0
            };
            setInterval(()=>{
                this.viewModel.test ++;
            }, 1000);
        }
    }
    // 寻址方式与@BindValue完全一样

## BindFor

@BindFor可提供列表解决方案，不同的表现层在使用上略有不同
- 对于DOM显示层，任意显示对象上都可以用@BindFor
- 对于Egret显示层，只能在eui.DataGroup及其子类实例上使用@BindFor

@BindFor的表达式不同于其他绑定表达式，并不是单纯的求值或执行，而是类似js中for的两种用法：
- @BindFor("key in collection")：遍历collection中所有的键
- @BindFor("value of collection")：遍历collection中所有的值

所有写在@BindFor下方的绑定表达式会作为@BindFor的子表达式，为每一个渲染器显示对象都绑定一份，在渲染器显示对象生成时被编译

@BindFor可以遍历数组，也可以遍历Object

对应底层操作：[bindManager.bindFor](https://htmlpreview.github.io/?https://raw.githubusercontent.com/Raykid/Olympus/master/trunk/docs/classes/_engine_bind_bindmanager_.bindmanager.html#bindfor)

#### 重载1：绑定当前显示对象

使用in表达式：

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        @BindFor("key in list")
        @BindValue("textContent", "key")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                list: ["a", "b", "c"]
            };
        }
    }
    // 输出：<div id='myDiv'>0</div>
    //      <div id='myDiv'>1</div>
    //      <div id='myDiv'>2</div>

使用of表达式：

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 使用of
        @BindFor("value of list")
        @BindValue("textContent", "value")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                list: ["a", "b", "c"]
            };
        }
    }
    // 输出：<div id='myDiv'>a</div>
    //      <div id='myDiv'>b</div>
    //      <div id='myDiv'>c</div>

#### 重载2：绑定寻址显示对象

    @DOMMediatorClass("<div id='myDiv'></div>")
    class SomeMediator extends Mediator
    {
        // 假设myDiv上有一个subDiv显示对象
        @BindFor("subDiv", "value of list")
        // 这时这个@BindValue操作的就是subDiv的textContent，而不是myDiv
        @BindValue("textContent", "value")
        private myDiv:HTMLElement;

        public onOpen():void
        {
            this.viewModel = {
                list: ["a", "b", "c"]
            };
        }
    }

@BindFor的寻址功能与@BindValue完全一致