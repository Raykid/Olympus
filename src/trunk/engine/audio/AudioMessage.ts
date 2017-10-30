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
}