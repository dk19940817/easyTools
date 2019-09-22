import React, { PureComponent } from 'react';
import ReactPlayer from 'react-player';
// npm: react-player API:https://www.npmjs.com/package/react-player#adding-custom-players
import EventEmitter from 'events';
import { timeConvert } from '../../utils/time';
import { getOsInfo, OS_TYPE } from '../../utils/ostype';
import { Loader } from '../index';
import style from './audio.css';

/*
基于react-player封装的精简版音频播放器，自由搭配，开箱即用

支持播放、缓冲等状态获取、可拖拽进度条、自定义样式、独占播放等

自定义样式通过参数获取各个信息，如下调用：

const audioData = {
  head: '',
  intro: '歌名',
* playurl: '', 
  duration: 248,
}

<Audio {...audioDate}>
  {
    ({
      onPlay, // fn 可传参布尔值控制播放暂停 onPlay(true)或onPlay(false) onPlay()为自动转换状态 
      playing, // Boolean 播放状态
      buffer, // Boolean 是否缓冲中
      currentTime, // Num/string 已播放时间
      backgroundsize, // Num/string 播放进度百分比
    }) => (<div>...</div>)
  }
</Audio>

或

<Audio {...audioDate} />
直接使用默认样式

...
*/

const audioEmitter = new EventEmitter().setMaxListeners(100);

export default class Audio extends PureComponent {
    static defaultProps = {
      children: false,
      head: '', // 头像
      intro: '', // 音频信息
      playurl: '', // 音频链接
      duration: 0, // 总时长 单位：秒
    };
    constructor(props) {
      super(props);
      this.state = {
        playing: false, // 播放状态
        url: null,
        currentTime: 0, // 已播放时间
        backgroundsize: 0,
        buffer: true, // 缓冲状态
      };
      this.elmId = `easyTools-audio-${parseInt(
        Math.random() * Number.MAX_SAFE_INTEGER,
        10,
      )}`;
      audioEmitter.on('@audioplaying', this.onOtherPlay);
    }
    componentWillUnmount() {
      audioEmitter.removeListener('@audioplaying', this.onOtherPlay);
    }
    // 实时获取音频各信息状态
    onProgress = e => {
      if (this.state.playing) {
        this.setState({
          currentTime: e.playedSeconds,
          backgroundsize: `${e.played * 100}%`,
        });
        console.log(e.loadedSeconds, e.playedSeconds);
        if (e.loadedSeconds <= e.playedSeconds) {
          this.setState({ buffer: true });
        } else {
          this.setState({ buffer: false });
        }
      }
    }
    onSeekChange = e => {
      if (this.state.playing || this.state.currentTime !== 0) {
        const { duration } = this.props;
        this.setState({
          currentTime: `${parseFloat(e.target.value) * duration / 100}`,
          backgroundsize: `${parseFloat(e.target.value)}%`,
        });
        this.player.seekTo(`${parseFloat(e.target.value) * duration / 100}`);
      }
    }
    onOtherPlay = elmId => {
      if (this.elmId !== elmId && this.state.playing) {
        this.setState({ playing: false });
      }
    }
    playPause(b) {
      let playing = typeof b === 'boolean' ? b : !this.state.playing;
      this.setState({ playing }, () => {
        if (this.state.playing) {
          audioEmitter.emit('@audioplaying', this.elmId);
        }
      });
    }

    // 安卓不支持播放wav格式，IOS不支持播放amr格式（如需支持兼容需做服务器转码）
    // 暂时设置为安卓不显示wav格式   IOS不显示amr格式
    canPlay = url => {
      if (!url) {
        console.error('AudioError: "playurl" is not found');
      }
      const amr = /\.(amr)$/;
      const wav = /\.(wav)$/;
      const osType = getOsInfo().os;
      if (amr.test(url) && osType === OS_TYPE.ANDROID) {
        return true;
      }
      if (wav.test(url) && osType === OS_TYPE.IOS) {
        return true;
      }
      return ReactPlayer.canPlay(url);
    }
    render() {
      const { playing, currentTime, backgroundsize, buffer } = this.state;
      const {
        head,
        intro,
        playurl,
        duration,
        children,
      } = this.props;
      if (!this.canPlay(playurl)) {
        return null;
      }
      return (
        <div>
          {
            children ?
              children({
                onPlay: b => this.playPause(b),
                playing,
                buffer,
                currentTime,
                backgroundsize,
              })
              :
              <div className={style.player}>
                {/* 播放暂停按钮 */}
                <div className={style.controls}>
                  <div className={style.play} onClick={() => this.playPause()}>
                    {
                      playing ?
                        <div>
                          {buffer ?
                            <Loader
                              type='line-spin-fade-loader'
                              active
                              color='#059CFA'
                              style={{
                                width: '48px',
                                width: '6.4vw',
                                height: '48px',
                                height: '6.4vw',
                                transform: 'scale(0.6) translate(50%, 50%)',
                              }}
                            />
                            :
                            <img
                              src="//mat1.gtimg.com/www/images/wise/icon_zanting.png"
                              alt=""
                              className={style.icon_play}
                            />
                          }
                        </div>
                        :
                        <img
                          src="//mat1.gtimg.com/www/images/wise/icon_bofang.png"
                          alt=""
                          className={style.icon_play}
                        />
                    }
                  </div>
                </div>
                {/* 音频头像信息 */}
                <div className={style.audio_wrapper}>
                  <div className={style.progress}>
                    {
                      head &&
                      <img src={head} className={playing && !buffer ? style.rotate : ''} alt="" />
                    }
                    {
                      intro &&
                      <span className={style.progress_bar}>{intro}</span>
                    }
                  </div>
                  {/* 播放进度条   */}
                  <div
                    className={style.duration}
                  >
                    <input
                      type="range"
                      className={style.audioLine}
                      style={{ backgroundSize: `${backgroundsize} 100%` }}
                      value={`${currentTime / duration * 100}`}
                      onChange={this.onSeekChange}
                    />
                  </div>
                  {/* 播放时间   */}
                  <div className={style.time}>
                    <span>
                      {timeConvert(currentTime)}
                    </span>
                    <span className={style.total}>{timeConvert(duration - 1)}</span>
                  </div>
                </div>
              </div>
          }
          {/* 播放器  */}
          {/* npm: react-player API:https://www.npmjs.com/package/react-player#adding-custom-players */}
          <ReactPlayer
            url={playurl}
            width="0"
            height="0"
            ref={e => { this.player = e; }}
            playing={playing}
            onPlay={() => this.setState({ playing: true })}
            onPause={() => this.setState({ playing: false })}
            onEnded={() =>
              this.setState({
                currentTime: 0,
                playing: false,
                backgroundsize: 0,
              })}
            onError={e => console.error('audioError:', e)}
            onProgress={this.onProgress}
          />
        </div>
      );
    }
}
