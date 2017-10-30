import IAudio, { AudioPlayParams } from "./IAudio";
import { core } from "../../core/Core";
import AudioMessage from "./AudioMessage";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 * 
 * 使用Audio标签实现IAudio接口的实现类
*/
export default class AudioTagImpl implements IAudio
{
    private _audioCache:{[url:string]:AudioData} = {};
    /**
     * 加载音频
     * 
     * @param {string} url 音频地址
     * @memberof AudioTagImpl
     */
    public load(url:string):void
    {
        // 尝试获取缓存数据
        var data:AudioData = this._audioCache[url];
        // 如果没有缓存才去加载
        if(!data)
        {
            // 使用Audio标签加载
            var node:HTMLAudioElement = document.createElement("audio");
            node.src = url;
            // 保存数据
            this._audioCache[url] = data = {node: node, status: AudioStatus.LOADING, playParams: null};
            // 监听加载
            node.onloadeddata = ()=>{
                // 记录加载完毕
                data.status = AudioStatus.PAUSED;
                // 如果自动播放则播放
                if(data.playParams) this.play(data.playParams);
            };
            node.onended = ()=>{
                // 派发播放完毕事件
                core.dispatch(AudioMessage.AUDIO_PLAY_ENDED, url);
            };
        }
    }

    /**
     * 播放音频，如果音频没有加载则先加载再播放
     * 
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void} 
     * @memberof AudioTagImpl
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
                    // 已经加载完毕，暂停中，直接播放
                    if(params.stopOthers) this.stopAll();
                    if(params.loop != null) data.node.loop = params.loop;
                    if(params.time != null) data.node.currentTime = params.time * 0.001;
                    data.node.play();
                    // 设置状态
                    data.status = AudioStatus.PLAYING;
                    // 派发播放开始事件
                    core.dispatch(AudioMessage.AUDIO_PLAY_STARTED, params.url);
                    break;
            }
        }
    }

    private _doStop(url:string, time?:number):void
    {
        var data:AudioData = this._audioCache[url];
        if(data)
        {
            data.node.autoplay = false;
            data.node.pause();
            // 设置停止时间
            if(time != null) data.node.currentTime = time * 0.001;
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
     * @memberof AudioTagImpl
     */
    public pause(url:string):void
    {
        this._doStop(url);
    }
    
    /**
     * 停止音频（会重置进度）
     * 
     * @param {string} url 音频URL
     * @memberof AudioTagImpl
     */
    public stop(url:string):void
    {
        this._doStop(url, 0);
    }

    /**
     * 停止所有音频
     * 
     * @memberof AudioTagImpl
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
     * @memberof AudioTagImpl
     */
    public seek(url:string, time:number):void
    {
        var data:AudioData = this._audioCache[url];
        if(data) data.node.currentTime = time * 0.001;
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
     * 音频的HTML节点
     * 
     * @type {HTMLAudioElement}
     * @memberof AudioData
     */
    node:HTMLAudioElement;
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
}