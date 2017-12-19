import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";
import IScene from "olympus-r/engine/scene/IScene";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * 淡入淡出场景切换策略
*/
export default class FadeScenePolicy implements IScenePolicy
{
    private _tempSnapshot:egret.Bitmap;

    public constructor()
    {
        this._tempSnapshot = new egret.Bitmap();
    }

    /**
     * 准备切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     */
    public prepareSwitch(from:IScene, to:IScene):void
    {
        if(from != null)
        {
            var root:egret.DisplayObjectContainer = from.bridge.root;
            // 截取当前屏幕
            var texture:egret.RenderTexture = new egret.RenderTexture();
            texture.drawToTexture(root);
            this._tempSnapshot.texture = texture;
            this._tempSnapshot.alpha = 1;
            root.addChild(this._tempSnapshot);
            // 移除from
            var fromDisplay:egret.DisplayObject = from.skin;
            if(fromDisplay.parent != null)
            {
                fromDisplay.parent.removeChild(fromDisplay);
            }
        }
    }

    /**
     * 切换场景时调度
     * @param from 切出的场景
     * @param to 切入的场景
     * @param callback 切换完毕的回调方法
     */
    public switch(from:IScene, to:IScene, callback:()=>void):void
    {
        if(from != null)
        {
            // 开始淡出
            egret.Tween.removeTweens(this._tempSnapshot);
            egret.Tween.get(this._tempSnapshot).to({
                alpha: 0
            }, 300).call(function()
            {
                // 移除截屏
                if(this._tempSnapshot.parent != null)
                {
                    this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                }
                // 回收资源
                if(this._tempSnapshot.texture != null)
                {
                    this._tempSnapshot.texture.dispose();
                    this._tempSnapshot.texture = null;
                }
                // 调用回调
                callback();
            }, this);
        }
        else
        {
            // 移除截屏
            if(this._tempSnapshot.parent != null)
            {
                this._tempSnapshot.parent.removeChild(this._tempSnapshot);
            }
            // 调用回调
            callback();
        }
    }
}