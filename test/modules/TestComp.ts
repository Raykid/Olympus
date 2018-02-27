import Mediator from "olympus-r/engine/mediator/Mediator";
import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";

@EgretMediatorClass("TestComp", "TestCompSkin")
export default class TestComp extends Mediator
{
    public onOpen():void
    {
        this.skin.x = 100;
        this.skin.y = 100;
        this.parent.skin.addChild(this.skin);

        this.dispatch("TestCompMsg");
    }

    public onDispose():void
    {
        this.parent.skin.removeChild(this.skin);
    }
}