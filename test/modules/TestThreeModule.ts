import Module from "olympus-r/engine/module/Module";
import SceneMediator from "olympus-r/engine/scene/SceneMediator";
import { DelegateMediator, ModuleClass } from "olympus-r/engine/injector/Injector";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import { system } from "olympus-r/engine/system/System";
import ThreeBridge from "olympus-r-three/ThreeBridge";
import { getCache } from "olympus-r-three/three/assets/AssetsLoader";
import { ThreeMediatorClass } from "olympus-r-three/three/injector/Injector";
import { Scene, Group, StereoCamera, ArrayCamera, PerspectiveCamera } from "three";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-22
 * @modify date 2018-02-22
 * 
 * 测试Three场景的模块
*/
@ThreeMediatorClass("./assets/scene.json")
export class TestThreeMediator extends SceneMediator
{
    public Group:Group;

    public listAssets():string[]
    {
        return ["./assets/scene.json"];
    }

    public onOpen():void
    {
        system.enterFrame(()=>{
            this.Group.rotation.x += 0.01;
            this.Group.rotation.y += 0.02;
        });
    }
}

@ModuleClass
export default class TestThreeModule extends Module
{
    @DelegateMediator
    private _mediator:TestThreeMediator;
}