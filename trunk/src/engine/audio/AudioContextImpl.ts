import { core } from "../../core/Core";
import { assetsManager } from "../assets/AssetsManager";
import { environment } from "../env/Environment";
import { ICancelable, system } from "../system/System";
import AudioMessage from "./AudioMessage";
import IAudio, { AudioPlayParams } from "./IAudio";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 * 
 * 使用AudioContext实现IAudio接口的实现类
*/
export default class AudioContextImpl implements IAudio
{
    private _mute:boolean = false;
    private _playingDict:{[url:string]:AudioPlayParams} = {};
    /**
     * 静音状态
     * 
     * @type {boolean}
     * @memberof AudioTagImpl
     */
    public get mute():boolean
    {
        return this._mute;
    }
    public set mute(value:boolean)
    {
        this._mute = value;
        // 静音，暂停所有声音
        for(var url in this._playingDict)
        {
            if(value)
            {
                // 静音，停止音频，不可调用stop方法，因为要保持播放中的音频状态
                this._doStop(url);
            }
            else
            {
                // 非静音，播放音频
                var params:AudioPlayParams = this._playingDict[url];
                this.play(params);
            }
        }
    }

    private _context:AudioContext;
    private _inited:boolean = false;
    private _audioCache:{[url:string]:AudioData} = {};

    public constructor()
    {
        this._context = new (window["AudioContext"] || window["webkitAudioContext"])();
        var onInit:()=>void = ()=>{
            window.removeEventListener("touchstart", onInit, true);
            window.removeEventListener("mousedown", onInit, true);
            // 生成一个空的音频，播放并停止，用以解除限制
            var source: AudioBufferSourceNode = this._context.createBufferSource();
            source.buffer = this._context.createBuffer(1, 1, 44100);
            source.connect(this._context.destination);
            source.start();
            source.stop();
            // 要先挂起
            this._context.suspend();
            // 设置标识符
            this._inited = true;
            // 如果当前有正在播放的音频，全部再播放一次
            for(var url in this._audioCache)
            {
                var data:AudioData = this._audioCache[url];
                if(data.status == AudioStatus.PLAYING)
                {
                    // 停止播放
                    this.stop(data.playParams.url);
                    // 重新播放
                    this.play(data.playParams);
                }
            }
        };
        // 这里监听触摸事件，一定要使用捕获阶段，否则会被某些框架阻止，比如egret
        window.addEventListener("touchstart", onInit, true);
        window.addEventListener("mousedown", onInit, true);
    }

    /**
     * 加载音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioContextImpl
     */
    public load(url:string):void
    {
        var toUrl:string = environment.toCDNHostURL(url);
        // 尝试获取缓存数据
        var data:AudioData = this._audioCache[toUrl];
        // 如果没有缓存才去加载
        if(!data)
        {
            // 使用AudioContext加载
            this._audioCache[toUrl] = data = {buffer: null, status: AudioStatus.LOADING, playParams: null, progress: null};
            // 派发加载开始事件
            core.dispatch(AudioMessage.AUDIO_LOAD_STARTED, url);
            // 开始加载
            assetsManager.loadAssets(toUrl, (result:ArrayBuffer) => {
                if(result instanceof ArrayBuffer)
                {
                    this._context.decodeAudioData(result, (buffer:AudioBuffer)=>{
                        data.buffer = buffer;
                        // 设置状态
                        data.status = AudioStatus.PAUSED;
                        // 派发加载完毕事件
                        core.dispatch(AudioMessage.AUDIO_LOAD_ENDED, url);
                        // 如果自动播放则播放
                        if(data.playParams) this.play(data.playParams);
                    });
                }
            }, "arraybuffer");
        }
    }

    /**
     * 播放音频，如果音频没有加载则先加载再播放
     * 
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void} 
     * @memberof AudioContextImpl
     */
    public play(params:AudioPlayParams):void
    {
        var toUrl:string = environment.toCDNHostURL(params.url);
        // 尝试获取缓存数据
        var data:AudioData = this._audioCache[toUrl];
        if(!data)
        {
            // 没有加载过，开始加载音频
            this.load(params.url);
            // 设置播放参数
            this._audioCache[toUrl].playParams = params;
        }
        else
        {
            switch(data.status)
            {
                case AudioStatus.LOADING:
                    // 正在加载中，替换自动播放参数
                    data.playParams = params;
                    break;
                case AudioStatus.PLAYING:
                    // 正在播放，关闭后再播放
                    this.stop(params.url);
                    this.play(params);
                    break;
                case AudioStatus.PAUSED:
                    // 设置状态
                    data.status = AudioStatus.PLAYING;
                    // 记录播放中
                    this._playingDict[toUrl] = params;
                    // 已经加载完毕，直接播放
                    data.node = this._context.createBufferSource();
                    data.node.buffer = data.buffer;
                    if(params.loop != null) data.node.loop = params.loop;
                    data.node.connect(this._context.destination);
                    // 监听播放完毕
                    data.node.onended = ()=>{
                        var data:AudioData = this._audioCache[toUrl];
                        if(data)
                        {
                            // 停止播放
                            this.stop(params.url);
                            // 派发播放完毕事件
                            core.dispatch(AudioMessage.AUDIO_PLAY_ENDED, params.url);
                        }
                    };
                    // 要播放之前要起用
                    this._context.resume();
                    // 开始播放，优先取参数中的时间，没有就取默认开始时间
                    var playTime:number;
                    if(params && params.time != null) playTime = params.time * 0.001;
                    else playTime = data.playTime;
                    delete data.playTime;
                    data.node.start(playTime);
                    // 开始播放进度监测
                    var lastTime:number = this._context.currentTime;
                    var curTime:number = playTime || 0;
                    data.progress = system.enterFrame(()=>{
                        var nowTime:number = this._context.currentTime;
                        var deltaTime:number = nowTime - lastTime;
                        lastTime = nowTime;
                        if(data.status == AudioStatus.PLAYING)
                        {
                            curTime += deltaTime * 1000;
                            var totalTime:number = data.node.buffer.duration * 1000;
                            core.dispatch(AudioMessage.AUDIO_PLAY_PROGRESS, params.url, curTime, totalTime);
                        }
                    });
                    // 派发播放开始事件
                    core.dispatch(AudioMessage.AUDIO_PLAY_STARTED, params.url);
                    break;
            }
        }
    }

    private _doStop(url:string, time?:number):void
    {
        var toUrl:string = environment.toCDNHostURL(url);
        var data:AudioData = this._audioCache[toUrl];
        if(data)
        {
            // 设置状态
            data.status = AudioStatus.PAUSED;
            // 取消进度监测
            data.node.onended = null;
            if(data.progress) data.progress.cancel();
            // 结束播放
            if(data.node)
            {
                try
                {
                    // 这里可能会报错，需要try cath
                    data.node.stop(time);
                    // 停止播音频时需要挂起
                    this._context.suspend();
                }
                catch(err)
                {
                    console.warn(err);
                }
                // 派发播放停止事件
                core.dispatch(AudioMessage.AUDIO_PLAY_STOPPED, url);
            }
        }
    }
    
    /**
     * 暂停音频（不会重置进度）
     * 
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    public pause(url:string):void
    {
        this._doStop(url);
        // 移除播放中
        var toUrl:string = environment.toCDNHostURL(url);
        delete this._playingDict[toUrl];
    }
    
    /**
     * 停止音频（会重置进度）
     * 
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    public stop(url:string):void
    {
        this._doStop(url, 0);
        // 移除播放中
        var toUrl:string = environment.toCDNHostURL(url);
        delete this._playingDict[toUrl];
    }

    /**
     * 停止所有音频
     * 
     * @memberof AudioContextImpl
     */
    public stopAll():void
    {
        for(var url in this._audioCache)
        {
            this.stop(url);
        }
    }
    
    /**
     * 跳转音频进度
     * 
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioContextImpl
     */
    public seek(url:string, time:number):void
    {
        var toUrl:string = environment.toCDNHostURL(url);
        var data:AudioData = this._audioCache[toUrl];
        if(data)
        {
            var params:AudioPlayParams = data.playParams;
            if(data.status == AudioStatus.PLAYING)
            {
                // 停止重新播放
                this.stop(url);
                params.time = time;
                this.play(params);
            }
            else
            {
                data.playTime = time;
            }
        }
    }
}

enum AudioStatus
{
    /**
     * 加载中
     */
    LOADING,
    /**
     * 已暂停
     */
    PAUSED,
    /**
     * 播放中
     */
    PLAYING
}

interface AudioData
{
    /**
     * 音频二进制数据
     * 
     * @type {AudioBuffer}
     * @memberof AudioData
     */
    buffer:AudioBuffer;
    /**
     * 音频状态
     * 
     * @type {AudioStatus}
     * @memberof AudioData
     */
    status:AudioStatus;
    /**
     * 播放参数
     * 
     * @type {AudioPlayParams}
     * @memberof AudioData
     */
    playParams:AudioPlayParams;
    /**
     * 播放节点
     * 
     * @type {AudioBufferSourceNode}
     * @memberof AudioData
     */
    node?:AudioBufferSourceNode;
    /**
     * 播放开始时的默认毫秒数
     * 
     * @type {number}
     * @memberof AudioData
     */
    playTime?:number;
    /**
     * 播放的取消句柄
     * 
     * @type {ICancelable}
     * @memberof AudioData
     */
    progress:ICancelable;
}