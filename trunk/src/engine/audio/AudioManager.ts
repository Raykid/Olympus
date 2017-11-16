import { Injectable, Inject } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import Shell from "../env/Shell";
import IAudio, { AudioPlayParams } from "./IAudio";
import AudioTagImpl from "./AudioTagImpl";
import AudioContextImpl from "./AudioContextImpl";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 * 
 * 音频管理器，音频接口被强行分为两部分：Sound和Music。
 * Sound：使用Audio标签播放，可以跨域播放但可能会被某些浏览器限制，必须在点击事件处理函数中播放
 * Music：使用AudioContext播放，可以一定程度上越过点击事件检查，但无法跨域播放，适合播放背景音乐
*/
@Injectable
export default class AudioManager
{
    private _soundImpl:IAudio = new AudioTagImpl();
    /**
     * 注册Sound音频实现对象
     * 
     * @param {IAudio} soundImpl Sound音频实现对象
     * @memberof AudioManager
     */
    public registerSoundImpl(soundImpl:IAudio):void
    {
        this._soundImpl = soundImpl;
    }

    /**
     * 加载Sound音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public loadSound(url:string):void
    {
        this._soundImpl.load(url);
    }

    /**
     * 播放Sound音频，如果没有加载则会先行加载
     * 
     * @param {AudioPlayParams} params 音频播放参数
     * @memberof AudioManager
     */
    public playSound(params:AudioPlayParams):void
    {
        // 停止其他音频
        if(params.stopOthers)
        {
            this.stopAllSound();
            this.stopAllMusics();
        }
        this._soundImpl.play(params);
    }

    /**
     * 跳转Sound音频进度
     * 
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    public seekSound(url:string, time:number):void
    {
        this._soundImpl.seek(url, time);
    }

    /**
     * 停止Sound音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public stopSound(url:string):void
    {
        this._soundImpl.stop(url);
    }

    /**
     * 暂停Sound音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public pauseSound(url:string):void
    {
        this._soundImpl.pause(url);
    }

    /**
     * 停止所有Sound音频
     * 
     * @memberof AudioManager
     */
    public stopAllSound():void
    {
        this._soundImpl.stopAll();
    }

    private _musicImpl:IAudio = new AudioContextImpl();
    /**
     * 注册Music音频实现对象
     * 
     * @param {IAudio} musicImpl Music音频实现对象
     * @memberof AudioManager
     */
    public registerMusicImpl(musicImpl:IAudio):void
    {
        this._musicImpl = musicImpl;
    }

    /**
     * 加载Music音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public loadMusic(url:string):void
    {
        this._musicImpl.load(url);
    }

    /**
     * 播放Music音频，如果没有加载则会先行加载
     * 
     * @param {AudioPlayParams} [params] 音频参数
     * @memberof AudioManager
     */
    public playMusic(params:AudioPlayParams):void
    {
        // 停止其他音频
        if(params.stopOthers)
        {
            this.stopAllSound();
            this.stopAllMusics();
        }
        this._musicImpl.play(params);
    }
    
    /**
     * 跳转Music音频进度
     * 
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    public seekMusic(url:string, time:number):void
    {
        this._musicImpl.seek(url, time);
    }

    /**
     * 停止Music音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public stopMusic(url:string):void
    {
        this._musicImpl.stop(url);
    }

    /**
     * 暂停Music音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    public pauseMusic(url:string):void
    {
        this._musicImpl.pause(url);
    }

    /**
     * 停止所有Music音频
     * 
     * @memberof AudioManager
     */
    public stopAllMusics():void
    {
        this._musicImpl.stopAll();
    }
}
/** 再额外导出一个单例 */
export const audioManager:AudioManager = core.getInject(AudioManager);