/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 音频消息
*/
var AudioMessage = /** @class */ (function () {
    function AudioMessage() {
    }
    /**
     * 音频加载开始事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_LOAD_STARTED = "audioLoadStarted";
    /**
     * 音频加载完毕事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_LOAD_ENDED = "audioLoadEnded";
    /**
     * 音频播放开始事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_PLAY_STARTED = "audioPlayStarted";
    /**
     * 音频播放停止事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_PLAY_STOPPED = "audioPlayStopped";
    /**
     * 音频播放完毕事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_PLAY_ENDED = "audioPlayEnded";
    /**
     * 音频播放进度事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_PLAY_PROGRESS = "audioPlayProgress";
    /**
     * 音频错误事件
     *
     * @static
     * @type {string}
     * @memberof AudioMessage
     */
    AudioMessage.AUDIO_ERROR = "audioError";
    return AudioMessage;
}());
export default AudioMessage;
