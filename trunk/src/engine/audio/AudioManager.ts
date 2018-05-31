import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import Shell from "../env/Shell";
import EngineMessage from "../message/EngineMessage";
import AudioContextImpl from "./AudioContextImpl";
import AudioTagImpl from "./AudioTagImpl";
import IAudio, { AudioPlayParams } from "./IAudio";

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
    private static STORAGE_KEY_MUTE_SOUND:string = "AudioManager::muteSound";
    private static STORAGE_KEY_MUTE_MUSIC:string = "AudioManager::muteMusic";

    public constructor()
    {
        this._soundImpl = new AudioTagImpl();
        // 为WebAudio做兼容处理
        window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
        // 由于IE可能不支持AudioContext，因此如果是IE则要改用Audio标签实现
        this._musicImpl = (window["AudioContext"] ? new AudioContextImpl() : this._soundImpl);

        core.listen(EngineMessage.INITIALIZED, ()=>{
            // 读取持久化记录
            var shell:Shell = core.getInject(Shell);
            this.muteSound = (shell.localStorageGet(AudioManager.STORAGE_KEY_MUTE_SOUND) === "true");
            this.muteMusic = (shell.localStorageGet(AudioManager.STORAGE_KEY_MUTE_MUSIC) === "true");
        });
    }

    private _soundImpl:IAudio;
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
     * 获取或设置Sound类型音频静音属性
     * 
     * @type {boolean}
     * @memberof AudioManager
     */
    public get muteSound():boolean
    {
        return this._soundImpl.mute;
    }
    public set muteSound(value:boolean)
    {
        if(value === this._soundImpl.mute) return;
        this._soundImpl.mute = value;
        // 持久化
        var shell:Shell = core.getInject(Shell);
        shell.localStorageSet(AudioManager.STORAGE_KEY_MUTE_SOUND, value + "");
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
        // 判断静音
        if(this.muteSound) return;
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

    private _musicImpl:IAudio;
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
     * 获取或设置Music类型音频静音属性
     * 
     * @type {boolean}
     * @memberof AudioManager
     */
    public get muteMusic():boolean
    {
        return this._musicImpl.mute;
    }
    public set muteMusic(value:boolean)
    {
        if(value === this._musicImpl.mute) return;
        this._musicImpl.mute = value;
        // 持久化
        var shell:Shell = core.getInject(Shell);
        shell.localStorageSet(AudioManager.STORAGE_KEY_MUTE_MUSIC, value + "");
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
        // 判断静音
        if(this.muteMusic) return;
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