import React, { Component } from 'react';
import './index.css';
import { PropTypes } from 'prop-types';

import Thumb from './thumb';

class VideoStatus extends Component {
  static propTypes = {
    channels: PropTypes.array,
    channelData: PropTypes.object,
    playingStatus: PropTypes.string, // 播放状态 start,pause,stop,continue
    direction: PropTypes.string, // 播放方向，正常播放 forward，后退 backward
    interval: PropTypes.number, // 播放速度
  }

  static defaultProps={
    channels: [],
    channelData: [],
    playingStatus: '',
    direction: 'forward',
    interval: 1000,
  }

  constructor(props) {
    super(props);
    this.state = {
      contBoxWidth: null, // container的宽度
      containerLeftWidth: 140, // 左边栏的宽度
      timeLevel: 'hour', // hour,minute,second
      intervalHour: 0,
      intervalMinute: 0,
      thumbLeftProp: -100,
    };
  }

  componentDidMount() {
    const { clientWidth } = this.contBox;
    this.setState({
      contBoxWidth: clientWidth,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { channels } = nextProps;
    const { channels: channelsPrev } = this.props;
    if (channels !== channelsPrev) {
      this.setHMS();
    }
  }

  /**
  * state改变的是否跟之前的相等
  */
  isStateEqual=(prevState, nextState) => {
    const {
      timeLevel,
      contBoxWidth,
      containerLeftWidth,
    } = prevState;
    const {
      timeLevel: timeLevelNext,
      contBoxWidth: contBoxWidthNext,
      containerLeftWidth: containerLeftWidthNext,
    } = nextState;
    if (timeLevel !== timeLevelNext) return false;
    if (contBoxWidth !== contBoxWidthNext) return false;
    if (containerLeftWidth !== containerLeftWidthNext) return false;
    return true;
  }

  /**
   * 设置当前时分秒
   */
  setHMS=() => {
    // const
  }


  /**
   * 渲染时间标尺
   */
  renderTimeScale=() => {
    const { timeLevel } = this.state;
    switch (timeLevel) {
      case 'hour':
        return this.renderHour();
      case 'minute':
      case 'second':
        return this.renderMinuteAndSec();
      default:
        return this.renderHour();
    }
  }

  /**
   * 渲染指示器区域小时级别的网格
   */
  renderHour=() => {
    const { containerLeftWidth, contBoxWidth } = this.state;
    const sectionWidth = (contBoxWidth - containerLeftWidth) / 24;
    const renderArr = [];
    for (let i = 0; i < 24; i += 1) {
      renderArr.push(
        <div key={i} className="section" style={{ width: `${sectionWidth}px`, left: `${sectionWidth * i}px` }}>{i}<div className="section-half" /></div>,
      );
    }
    return renderArr;
  }

  /**
   * 渲染时间标尺区域分钟和秒级别的网格
   */
  renderMinuteAndSec=() => {
    const { containerLeftWidth, contBoxWidth } = this.state;
    const sectionWidth = (contBoxWidth - containerLeftWidth) / 60;
    const renderArr = [];
    for (let i = 0; i < 60; i += 1) {
      renderArr.push(
        <div key={i} className="section" style={{ width: `${sectionWidth}px`, left: `${sectionWidth * i}px` }}>{i}<div className="section-half" /></div>,
      );
    }
    return renderArr;
  }

  /**
   * 左侧通道标题
   */
  renderChannelTitle=() => {
    const { channels } = this.props;
    const channelListItems = channels.map(ele => <div className="channel-title" key={ele}>通道{ele}</div>);
    return channelListItems;
  }

 /**
  * 渲染右侧通道数据
  */
 renderChannel=() => {
   const { channels } = this.props;
   const channelHtmlArr = [];
   for (let i = 0; i < channels.length; i += 1) {
     const element = channels[i];
     channelHtmlArr.push(this.renderChannelGreen(element));
   }
   return channelHtmlArr;
 }

 /**
  * 渲染绿色区域
  */
 renderChannelGreen=(key) => {
   const { channelData } = this.props;
   const {
     contBoxWidth, containerLeftWidth, timeLevel, intervalHour, intervalMinute,
   } = this.state;
   const thumbContainerWidth = contBoxWidth - containerLeftWidth;
   let html;
   if (channelData[key]) {
     html = (
       <div className="channel" key={key}>
         {channelData[key].map((ele) => {
           const hmsStart = this.parseDate2HMS(ele.StartTime.replace(/-/g, '/'));
           const hmsEnd = this.parseDate2HMS(ele.EndTime.replace(/-/g, '/'));
           const secondDiff = hmsEnd.totalSecond - hmsStart.totalSecond;

           let greenWidth;
           let greenLeft;


           switch (timeLevel) {
             case 'hour':
               greenWidth = thumbContainerWidth * secondDiff / (3600 * 24);
               greenLeft = thumbContainerWidth * hmsStart.totalSecond / (3600 * 24);
               break;
             case 'minute':
               greenWidth = thumbContainerWidth * secondDiff / 3600;
               greenLeft = thumbContainerWidth * (hmsStart.totalSecond - intervalHour * 3600) / 3600;
               break;
             case 'second':
               greenWidth = thumbContainerWidth * secondDiff / 60;
               greenLeft = thumbContainerWidth * (hmsStart.totalSecond - (intervalHour * 3600 + intervalMinute * 60)) / 60;
               break;
             default:
               break;
           }


           return <div key={secondDiff} className="green" style={{ width: `${greenWidth}px`, left: `${greenLeft}px` }} />;
         })}
       </div>
     );
   } else {
     html = <div className="channel" key={key} />;
   }
   return html;
 }

 /**
 * 将日期字符串解析成时分秒的对象
 * 还有时分秒累计的总秒数
 */
parseDate2HMS=(dateStr) => {
  const date = new Date(dateStr);
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return {
    hour,
    minute,
    second,
    totalSecond: hour * 3600 + minute * 60 + second,
  };
}

/**
 * 左边顶部日期显示
 */
renderDate=() => {
  const { channelData } = this.props;
  let now;
  if (channelData && Object.keys(channelData).length > 0) {
    const channelIds = Object.keys(channelData);
    const channelDatas = channelData[channelIds[0]];
    if (channelDatas.length > 0) {
      now = new Date(channelDatas[0].StartTime.replace(/-/g, '/'));
    } else {
      now = new Date();
    }
  } else {
    now = new Date();
  }
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  return date;
}

/**
 * 左侧时间标尺状态标题显示
 */
renderTimeTitle=() => {
  const { timeLevel, intervalHour, intervalMinute } = this.state;
  switch (timeLevel) {
    case 'hour':
      return '小时';
    case 'minute':
      return `分钟(${intervalHour}-${intervalHour + 1}时)`;
    case 'second':
      return `秒(${intervalHour}:${intervalMinute}-${intervalHour}:${intervalMinute + 1}分)`;
    default:
      return '小时';
  }
}

/**
 * 标尺滚动事件
 */
rulerMousewheel=(event) => {
  const {
    timeLevel, containerLeftWidth, contBoxWidth, intervalHour, intervalMinute,
  } = this.state;
  const { pageX } = event;
  const { x: contPagyX } = this.contBox.getBoundingClientRect();
  const rulerWidth = contBoxWidth - containerLeftWidth; // 标尺宽度
  const mouseContLeft = pageX - contPagyX - containerLeftWidth;// 鼠标指针距离时间标尺左边的距离
  console.log('mouseContLeft', mouseContLeft);
  console.log('rulerWidth', rulerWidth);

  let hour = intervalHour; let
    minute = intervalMinute;

  let level; let second = 0;
  if (event.nativeEvent.deltaY <= 0) {
    /* scrolling up 放大 */
    if (timeLevel === 'hour') {
      level = 'minute';
      second = mouseContLeft * (3600 * 24) / rulerWidth;
      hour = parseInt(second / 3600, 10);
    }
    if (timeLevel === 'minute' || timeLevel === 'second') {
      level = 'second';
      second = mouseContLeft * 3600 / rulerWidth;
      minute = parseInt(second / 60, 10);
    }
  } else {
    /* scrolling down 缩小 */
    if (timeLevel === 'second') {
      level = 'minute';
    }
    if (timeLevel === 'minute' || timeLevel === 'hour') {
      level = 'hour';
    }
  }
  if (intervalHour === 24) {
    hour = 23;
    minute = 59;
  }

  if (timeLevel !== level) {
    this.setState({
      timeLevel: level,
      intervalHour: hour,
      intervalMinute: minute,
    });
  }
}

/**
 * 通道区域点击事件
 */
channerContainerClick=(e) => {
  const { containerLeftWidth } = this.state;
  const { pageX } = e;
  const { x: contPagyX } = this.contBox.getBoundingClientRect(); // 整个容器距离屏幕左边的距离
  const mouseContLeft = pageX - contPagyX - containerLeftWidth;// 鼠标指针距离时间标尺左边的距离
  this.setState({
    thumbLeftProp: mouseContLeft - 32,
  });
}

render() {
  const {
    contBoxWidth, containerLeftWidth, timeLevel, intervalHour, intervalMinute, thumbLeftProp,
  } = this.state;
  const {
    channels, playingStatus, channelData, direction, interval,
  } = this.props;
  const wid = contBoxWidth - containerLeftWidth;
  console.log('render', wid);
  return (
    <div className="contBox" ref={(contBox) => { this.contBox = contBox; }}>
      {
                contBoxWidth === null ? null : (
                  <div className="container">
                    <div className="container-left">
                      <div className="day">{this.renderDate()}</div>
                      <div className="title">{this.renderTimeTitle()}</div>
                      <div className="channel-title-container">
                        {this.renderChannelTitle()}
                      </div>
                    </div>
                    <div className="container-right">
                      <div className="thumb-container">
                        <Thumb
                          channels={channels}
                          thumbContainerWidth={wid}
                          timeLevel={timeLevel}
                          intervalHour={intervalHour}
                          intervalMinute={intervalMinute}
                          thumbLeftProp={thumbLeftProp}
                          playingStatus={playingStatus}
                          channelData={channelData}
                          direction={direction}
                          interval={interval}
                        />

                      </div>
                      <div className="ruler" onWheel={this.rulerMousewheel}>
                        {this.renderTimeScale()}
                      </div>
                      <div className="channel-container" onClick={this.channerContainerClick}>
                        {this.renderChannel()}
                      </div>
                    </div>
                  </div>
                )
            }
    </div>

  );
}
}

export default VideoStatus;