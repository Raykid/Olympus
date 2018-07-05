/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 * 
 * 音频消息
*/
export default class AudioMessage
{
    /**
     * 音频加载开始事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_LOAD_STARTED:string = "audioLoadStarted";
    /**
     * 音频加载完毕事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_LOAD_ENDED:string = "audioLoadEnded";
    /**
     * 音频播放开始事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_PLAY_STARTED:string = "audioPlayStarted";
    /**
     * 音频播放停止事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_PLAY_STOPPED:string = "audioPlayStopped";
    /**
     * 音频播放完毕事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_PLAY_ENDED:string = "audioPlayEnded";
    /**
     * 音频播放进度事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_PLAY_PROGRESS:string = "audioPlayProgress";
    /**
     * 音频错误事件
     * 
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    public static AUDIO_ERROR: string = "audioError";
}