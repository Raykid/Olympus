import IMediator from "olympus-r/engine/mediator/IMediator";
import IThreeSkin from "../mediator/IThreeSkin";
import { getCache, IResource } from "../assets/AssetsLoader";
import { Object3D, Camera, Renderer, WebGLRenderer, OrthographicCamera, PerspectiveCamera, Scene } from "three";
import ThreeBridge, { IInitParams } from "../../ThreeBridge";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
import IRenderHandler from "../render/IRenderHandler";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 * 
 * Egret皮肤工具集
*/

function breadthFirstTraverse(object:Object3D, callback:(object:Object3D)=>boolean):boolean
{
    let stop:boolean = false;
    let children:Object3D[] = object.children;
    // 遍历子对象
    for(let child of children)
    {
        stop = callback(child);
        if(stop) break;
    }
    // 递归遍历子对象
    if(!stop)
    {
        for(let child of children)
        {
            stop = breadthFirstTraverse(child, callback);
            if(stop) break;
        }
    }
    return stop;
}

function getCamera(resource:IResource):Camera
{
    if(resource.camera) return resource.camera;
    let camera:Camera;
    // 广度优先遍历，因为摄像机一般都放在比较表面的层级
    breadthFirstTraverse(resource.scene, (object:Object3D)=>{
        let stop:boolean = false;
        if(object instanceof Camera)
        {
            camera = object;
            stop = true;
        }
        return stop;
    });
    return camera;
}

function createRenderer():Renderer
{
    let bridge:ThreeBridge = bridgeManager.getBridge(ThreeBridge.TYPE) as ThreeBridge;
    let initParams:IInitParams = bridge.initParams;
    let renderer:WebGLRenderer = new WebGLRenderer(initParams.rendererParams);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    (<HTMLElement>initParams.container).appendChild(renderer.domElement);
    return renderer;
}

export function wrapSkin(mediator:IMediator, url:string):IThreeSkin
{
    let bridge:ThreeBridge = bridgeManager.getBridge(ThreeBridge.TYPE) as ThreeBridge;
    mediator.bridge = bridge;
    let skin:IThreeSkin;
    // 声明渲染回调
    let handler:IRenderHandler = {
        render: ()=>{
            skin.renderer.render(skin.scene, skin.camera);
        },
        resize: (width:number, height:number)=>{
            if(skin.camera instanceof OrthographicCamera)
            {
                // 无透视摄像机需要重设边框范围
                skin.camera.left = width * -0.5;
                skin.camera.right = width * 0.5;
                skin.camera.top = height * 0.5;
                skin.camera.bottom = height * -0.5;
                skin.camera.updateProjectionMatrix();
            }
            else if(skin.camera instanceof PerspectiveCamera)
            {
                // 透视摄像机需要重设边框比例
                skin.camera.aspect = width / height;
                skin.camera.updateProjectionMatrix();
            }
            // 设置渲染器
            skin.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    };
    // 篡改mediator的onOpen方法
    var oriOnOpen:any = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
    mediator.onOpen = function(...args:any[]):void
    {
        // 赋值皮肤
        let resource:IResource = getCache(url);
        if(resource)
        {
            skin = {
                scene: resource.scene,
                camera: getCamera(resource),
                renderer: createRenderer()
            };
        }
        mediator.skin = skin;
        // 转发ui引用
        let configText:string = resource.configText;
        // 从配置字符串中读取所有name
        let names:string[] = [];
        let regName:RegExp = /"name"\s*:\s*"(\w+)"/g;
        let regRes:RegExpExecArray;
        while(regRes = regName.exec(configText))
        {
            names.push(regRes[1]);
        }
        // 然后从实体中获取所有引用
        let scene:Scene = skin.scene;
        for(let name of names)
        {
            mediator[name] = scene.getObjectByName(name);
        }
        // 添加渲染回调
        bridge.addRenderHandler(handler);
        // 恢复原始方法
        if(oriOnOpen) mediator.onOpen = oriOnOpen;
        else delete mediator.onOpen;
        // 调用原始方法
        mediator.onOpen.apply(this, args);
    };
    // 篡改mediator的dispose方法
    var oriDispose:any = mediator.hasOwnProperty("dispose") ? mediator.dispose : null;
    mediator.dispose = function(...args:any[]):void
    {
        // 恢复原始方法
        if(oriDispose) mediator.dispose = oriDispose;
        else delete mediator.dispose;
        // 调用原始方法
        mediator.dispose.apply(this, args);
        // 移除渲染回调
        bridge.removeRenderHandler(handler);
        // 销毁渲染器
        let canvas:HTMLCanvasElement = skin.renderer.domElement;
        if(canvas.parentElement) canvas.parentElement.removeChild(canvas);
        skin.renderer["dispose"] && skin.renderer["dispose"]();
    };
    return skin;
}