import IAudio, { AudioPlayParams } from "./IAudio";
import { assetsManager } from "../assets/AssetsManager";
import { core } from "../../core/Core";
import AudioMessage from "./AudioMessage";

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
    private _context:AudioContext;
    private _inited:boolean = false;
    private _audioCache:{[url:string]:AudioData} = {};

    public constructor()
    {
        this._context = new (window["AudioContext"] || window["webkitAudioContext"])();
        var onInit:()=>void = ()=>{
            window.removeEventListener("touchstart", onInit);
            window.removeEventListener("mousedown", onInit);
            // 生成一个空的音频，播放并停止，用以解除限制
            var source: AudioBufferSourceNode = this._context.createBufferSource();
            source.buffer = this._context.createBuffer(1, 1, 44100);
            source.connect(this._context.destination);
            source.start();
            source.stop();
            // 设置标识符
            this._inited = true;
            // 如果当前有正在播放的音频，全部再播放一次
            for(var url in this._audioCache)
            {
                var data:AudioData = this._audioCache[url];
                if(data.status == AudioStatus.PLAYING)
                {
                    // 停止播放
                    this.stop(url);
                    // 重新播放
                    this.play(data.playParams);
                }
            }
        };
        window.addEventListener("touchstart", onInit);
        window.addEventListener("mousedown", onInit);
    }

    /**
     * 加载音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioContextImpl
     */
    public load(url:string):void
    {
        // 尝试获取缓存数据
        var data:AudioData = this._audioCache[url];
        // 如果没有缓存才去加载
        if(!data)
        {
            // 使用AudioContext加载
            this._audioCache[url] = data = {buffer: null, status: AudioStatus.LOADING, playParams: null};
            // 开始加载
            assetsManager.loadAssets(url, (result:ArrayBuffer) => {
                if(result instanceof ArrayBuffer)
                {
                    this._context.decodeAudioData(result, (buffer:AudioBuffer)=>{
                        data.buffer = buffer;
                        // 设置状态
                        data.status = AudioStatus.PAUSED;
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
        // 尝试获取缓存数据
        var data:AudioData = this._audioCache[params.url];
        if(!data)
        {
            // 没有加载过，开始加载音频
            this.load(params.url);
            // 设置播放参数
            this._audioCache[params.url].playParams = params;
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
                    // 已经加载完毕，直接播放
                    if(this._inited)
                    {
                        data.node = this._context.createBufferSource();
                        data.node.buffer = data.buffer;
                        if(params.loop != null) data.node.loop = params.loop;
                        data.node.connect(this._context.destination);
                        // 监听播放完毕
                        data.node.onended = ()=>{
                            var data:AudioData = this._audioCache[params.url];
                            if(data)
                            {
                                // 停止播放
                                this.stop(params.url);
                                // 派发播放完毕事件
                                core.dispatch(AudioMessage.AUDIO_PLAY_ENDED, params.url);
                            }
                        };
                        // 开始播放，优先取参数中的时间，没有就取默认开始时间
                        var playTime:number;
                        if(params && params.time != null) playTime = params.time * 0.001;
                        else playTime = data.playTime;
                        delete data.playTime;
                        data.node.start(playTime);
                        // 派发播放开始事件
                        core.dispatch(AudioMessage.AUDIO_PLAY_STARTED, params.url);
                    }
                    break;
            }
        }
    }

    private _doStop(url:string, time?:number):void
    {
        var data:AudioData = this._audioCache[url];
        if(data && data.node)
        {
            data.node.stop(time);
            // 设置状态
            data.status = AudioStatus.PAUSED;
            // 派发播放停止事件
            core.dispatch(AudioMessage.AUDIO_PLAY_STOPPED, url);
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
        var data:AudioData = this._audioCache[url];
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
}