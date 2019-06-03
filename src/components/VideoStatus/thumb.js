import React, { Component } from 'react';
import './index.css';
import { PropTypes } from 'prop-types';

class Thumb extends Component {
  static propTypes = {
    channels: PropTypes.array.isRequired,
    channelData: PropTypes.object.isRequired,
    thumbContainerWidth: PropTypes.number.isRequired,
    timeLevel: PropTypes.string.isRequired,
    intervalHour: PropTypes.number.isRequired,
    intervalMinute: PropTypes.number.isRequired,
    thumbLeftProp: PropTypes.number.isRequired,
    playingStatus: PropTypes.string, // 是否开始播放
    interval: PropTypes.number.isRequired, // 播放速度
    direction: PropTypes.string.isRequired,
  }

  static defaultProps={
    playingStatus: '',
    // currentHour: 0,
    // currentMinute: 0,
    // currentSecond: 0,
    // channels: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      mouseDownX: 0, // 鼠标按下时的坐标
      thumbLeft: -32, // thumb的left值
      mouseDownThumbLeft: 0, // 鼠标按下时thumb的left值
      currentHour: 0,
      currentMinute: 0,
      currentSecond: 0,
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { timeLevel, thumbLeftProp, playingStatus } = nextProps;
    const {
      timeLevel: timeLevelPrev, thumbLeftProp: thumbLeftPropPrev,
      playingStatus: playingStatusPrev,
    } = this.props;
    if (timeLevel !== timeLevelPrev) {
      this.setThumbLeft(nextProps);
    }

    if (thumbLeftProp !== thumbLeftPropPrev && thumbLeftProp >= -32) {
      const { currentHour, currentMinute, currentSecond } = this.calculateHMS(thumbLeftProp);
      this.setState({
        thumbLeft: thumbLeftProp,
        currentHour,
        currentMinute,
        currentSecond,
      });
    }

    if (playingStatus === 'start' && playingStatusPrev !== 'start') {
      this.onStartPlaying();
    }

    if (playingStatus === 'stop' && playingStatusPrev !== 'stop') {
      this.onStopPlaying();
    }

    if (playingStatus === 'pause' && playingStatusPrev !== 'pause') {
      this.onPausePlaying();
    }

    if (playingStatus === 'continue' && playingStatusPrev !== 'continue') {
      this.onContinuePlaying();
    }
  }

/**
 * 开始播放
 */
onStartPlaying=() => {
  if (this.timer) {
    clearInterval(this.timer);
  }


  const { hour, minute, second } = this.getEarliestTime();

  // 这一步设置初始left的值，要从有数据的地方开始播放的话在这里设置
  this.setState({
    thumbLeft: -32,
    currentHour: hour,
    currentMinute: minute,
    currentSecond: second,
  }, () => {
    this.setThumbLeftInterval();

    this.setPlayingTimer();
  });
}

/**
 * 设置定时器播放
 */
setPlayingTimer=() => {
  const { interval } = this.props;
  this.timer = setInterval(() => {
    this.setThumbLeftInterval();
  }, interval);
}

/**
 * 停止播放
 */
onStopPlaying=() => {
  if (this.timer) {
    clearInterval(this.timer);
  }
  this.setState({
    thumbLeft: -32,
    currentHour: 0,
    currentMinute: 0,
    currentSecond: 0,
  });
}

/**
 * 暫停播放
 */
onPausePlaying=() => {
  if (this.timer) {
    clearInterval(this.timer);
  }
}

/**
 * 继续播放
 */
onContinuePlaying=() => {
  this.setPlayingTimer();
}

/**
 * 获取有数据的最早时间点
 */
getEarliestTime=() => {
  const { channelData } = this.props;
  const channelIds = Object.keys(channelData);
  let minDate = null;
  let itemDate = null;
  let hour;
  let minute;
  let second;

  for (let i = 0; i < channelIds.length; i += 1) {
    const element = channelIds[i];
    const greens = channelData[element];

    for (let j = 0; j < greens.length; j += 1) {
      if (minDate === null) {
        minDate = new Date(greens[j].StartTime.replace(/-/g, '/'));
      } else {
        itemDate = new Date(greens[j].StartTime.replace(/-/g, '/'));
        if (minDate > itemDate) {
          minDate = itemDate;
        }
      }
    }
  }

  if (!minDate) {
    hour = 0;
    minute = 0;
    second = 0;
  } else {
    hour = minDate.getHours();
    minute = minDate.getMinutes();
    second = minDate.getSeconds();
  }
  return {
    hour, minute, second,
  };
}

/**
 * 每一秒設置left的值
 */
setThumbLeftInterval=() => {
  const {
    timeLevel, thumbContainerWidth, intervalHour, intervalMinute, direction,
  } = this.props;

  const {
    currentHour, currentMinute, currentSecond,
  } = this.state;
  const sec = direction === 'forward' ? this.transformHMSToSec(currentHour, currentMinute, currentSecond) + 1
    : this.transformHMSToSec(currentHour, currentMinute, currentSecond) - 1;
  if (sec > 24 * 60 * 60 || sec < 0) {
    return;
  }

  const { h, m, s } = this.transformSecToHMS(sec);

  let left;
  switch (timeLevel) {
    case 'hour':
      left = thumbContainerWidth * sec / (24 * 3600);
      break;
    case 'minute':
      left = thumbContainerWidth * (sec - intervalHour * 3600) / 3600;
      break;
    case 'second':
      left = thumbContainerWidth
          * (sec - (intervalHour * 3600 + intervalMinute * 60)) / 60;
      break;
    default:
      break;
  }
  left -= 32;
  this.setState({
    thumbLeft: left,
    currentHour: h,
    currentMinute: m,
    currentSecond: s,
  });
}

/**
 * 時分秒转化为秒数
 */
transformHMSToSec=(h, m, s) => h * 60 * 60 + m * 60 + s

/**
 * 秒数转化为时分秒
 */
transformSecToHMS=(sec) => {
  let num;
  const h = parseInt(sec / 60 / 60, 10);
  num = sec - h * 60 * 60;
  const m = parseInt(num / 60, 10);
  num -= m * 60;
  const s = num;
  return {
    h,
    m,
    s,
  };
}

/**
   * 如果传入的数字小于10，给前面加0
   * 返回字符串
   */
   padZero=(num) => {
     if (num < 10) {
       return `0${num.toString()}`;
     }
     return num.toString();
   }

   /**
   * 计算时分秒的总秒数
   */
    hms2Second=(hour, minute, second) => hour * 3600 + minute * 60 + second

   /**
    * 根据timeLevel改变thumb的left值
    */
   setThumbLeft=(nextProps) => {
     const {
       timeLevel, thumbContainerWidth, intervalHour, intervalMinute,
     } = nextProps;
     const { currentHour, currentMinute, currentSecond } = this.state;
     const totalSecond = this.hms2Second(currentHour, currentMinute, currentSecond);
     let left;
     console.log('timeLevel', timeLevel);

     switch (timeLevel) {
       case 'hour':
         left = thumbContainerWidth * totalSecond / (24 * 3600);
         break;
       case 'minute':
         left = thumbContainerWidth * (totalSecond - intervalHour * 3600) / 3600;
         break;
       case 'second':
         left = thumbContainerWidth
          * (totalSecond - (intervalHour * 3600 + intervalMinute * 60)) / 60;
         break;
       default:
         break;
     }
     left -= 32;
     console.log('left', left);
     this.setState({
       thumbLeft: left,
     });
   }

   thumbMouseDown=(event) => {
     //  console.log('event', event.pageX);
     const { thumbLeft } = this.state;
     this.setState({
       mouseDownX: event.pageX,
       mouseDownThumbLeft: thumbLeft,
     });
     document.onmousemove = this.documentMouseMove;
     document.onmouseup = this.documentMouseUp;
   }

   /**
    * 鼠标移动事件
    */
   documentMouseMove=(event) => {
     const { pageX } = event;
     const { mouseDownX, mouseDownThumbLeft } = this.state;
     const {
       thumbContainerWidth,
     } = this.props;
     const mouseMoveDis = pageX - mouseDownX;
     let left = mouseDownThumbLeft + mouseMoveDis;
     left = Math.max(-32, left);
     left = Math.min(thumbContainerWidth - 32, left);

     const { currentHour, currentMinute, currentSecond } = this.calculateHMS(left);

     this.setState({
       thumbLeft: left,
       currentHour,
       currentMinute,
       currentSecond,
     });
   }

   /**
    * 鼠标抬起事件
    */
   documentMouseUp=() => {
     document.onmousemove = null;
     document.onmousemove = null;
   }

   /**
    * 根据left,timeLevel计算currentHour，currentMinute，currentSecond
    */
   calculateHMS=(left) => {
     const {
       thumbContainerWidth, timeLevel, intervalHour, intervalMinute,
     } = this.props;
     let second; let currentHour; let currentMinute; let currentSecond;
     if (timeLevel === 'hour') {
       second = (left + 32) * (3600 * 24) / thumbContainerWidth;
       currentHour = parseInt(second / 3600, 10);
       second -= currentHour * 3600;
       currentMinute = parseInt(second / 60, 10);
       second -= currentMinute * 60;
       currentSecond = parseInt(second, 10);
     }
     if (timeLevel === 'minute') {
       currentHour = intervalHour;
       second = (left + 32) * 3600 / thumbContainerWidth;
       currentMinute = parseInt(second / 60, 10);
       second -= currentMinute * 60;
       currentSecond = parseInt(second, 10);
     }
     if (timeLevel === 'second') {
       currentHour = intervalHour;
       currentMinute = intervalMinute;
       second = (left + 32) * 60 / thumbContainerWidth;
       currentSecond = parseInt(second, 10);
     }

     if (currentHour === 24) {
       currentHour = 23;
       currentMinute = 59;
       currentSecond = 59;
     }
     return {
       currentHour,
       currentMinute,
       currentSecond,
     };
   }

   /**
    * thumb 是否显示
    */
   ifThumbShow=() => {
     const { thumbLeft } = this.state;
     const { thumbContainerWidth } = this.props;
     return thumbLeft >= -32 && thumbLeft <= thumbContainerWidth - 32;
   }

   render() {
     const {
       channels,
     } = this.props;
     const {
       thumbLeft, currentHour, currentMinute, currentSecond,
     } = this.state;
     const len = channels.length + 1;
     const thumbShow = this.ifThumbShow();
     return (
       <div
         className={thumbShow ? 'thumb' : 'thumb hide'}
         style={{ left: `${thumbLeft}px` }}
         ref={(cont) => { this.thumb = cont; }}
         onMouseDown={this.thumbMouseDown}
        //  onMouseMove={this.thumbMouseMove}
       >
         <span className="h">{this.padZero(currentHour)}:</span>
         <span className="m">{this.padZero(currentMinute)}:</span>
         <span className="s">{this.padZero(currentSecond)}</span>
         <div className="line" style={{ height: `${30 * len}px` }} />
       </div>
     );
   }
}

export default Thumb;