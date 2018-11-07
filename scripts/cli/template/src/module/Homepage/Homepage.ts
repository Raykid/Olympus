import { EgretMediatorClass } from "olympus-r-egret/egret/injector/Injector";
import { BindOn, BindValue } from 'olympus-r/engine/injector/Injector';
import { moduleManager } from 'olympus-r/engine/module/ModuleManager';
import SceneMediator from 'olympus-r/engine/scene/SceneMediator';
import Second from '../Second/Second';

@EgretMediatorClass("Homepage", "skins.HomepageSkin")
export default class Homepage extends SceneMediator
{
    @BindValue("text", "curText")
    public txt:eui.Label;
    @BindOn(egret.TouchEvent.TOUCH_TAP, "onClickBtn")
    public btn:eui.Button;

    /**
     * 这个方法返回模块依赖的Egret资源组
     * 
     * @returns {string[]} 
     * @memberof Homepage
     */
    public listAssets():string[]
    {
        return ["homepage"];
    }

    public onOpen(data?:any):void
    {
        // 请这里设置ViewModel
        this.viewModel = {
            curText: "欢迎使用Olympus，这是个Egret模块",
            onClickBtn: ()=>{
                moduleManager.open(Second);
            }
        };
    }
}
