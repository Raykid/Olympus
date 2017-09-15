/// <reference path="../dist/Olympus.d.ts"/>

import Core, {core} from "core/Core"
import IMessage from "core/message/IMessage"
import View from "view/View"
import Explorer from "engine/env/Explorer"
import Query from "engine/env/Query"
import External from "engine/env/External"
import Hash from "engine/env/Hash"
import PanelManager from "engine/panel/PanelManager"
import SceneManager from "engine/scene/SceneManager"
import ModuleManager from "engine/module/ModuleManager"
import NetManager from "engine/net/NetManager"
import System from "engine/system/System"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 测试项目
*/
core.listen("fuck", handler, "this");

core.dispatch("fuck");

function handler(msg:IMessage):void
{
    core.unlisten("fuck", handler, this);
}

@Model
class Fuck
{
    @Inject(Core)
    public core:Core;
}

@Mediator
class Fuck2
{
    @Inject(Fuck)
    public fuck:Fuck;

    @Inject(Core)
    public core:Core;

    @Inject(View)
    public view:View

    @Inject(Explorer)
    public explorer:Explorer;

    @Inject(Query)
    public query:Query;

    @Inject(External)
    public external:External;

    @Inject(Hash)
    public hash:Hash;
    
    @Inject(PanelManager)
    public panelManager:PanelManager;
    
    @Inject(SceneManager)
    public sceneManager:SceneManager;
    
    @Inject(ModuleManager)
    public moduleManager:ModuleManager;

    @Inject(NetManager)
    public netManager:NetManager;

    @Inject(System)
    public system:System;

    public shit():void
    {
        console.log(this.fuck);
    }

    @Handler("fuck")
    private testHandler():void
    {
        console.log("测试Handler注入成功！");
    }
}

var fuck2:Fuck2 = new Fuck2();
fuck2.shit();
console.log(fuck2);

window["fuck2"] = fuck2;
window["Fuck2"] = Fuck2;

core.dispatch("fuck");