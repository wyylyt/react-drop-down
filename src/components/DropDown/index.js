import React, { Component } from 'react';
import './index.css';
import { PropTypes } from 'prop-types';

class DropDown extends Component {
  static propTypes = {
    data: PropTypes.array, // 列表数据
    placeholder: PropTypes.string, // input placeholder
    inputValueChange: PropTypes.func, // input值改变触发的方法
    ifLoading: PropTypes.bool, // 是否还在加载数据
  }

  static defaultProps={
    data: [],
    placeholder: '',
    inputValueChange: null,
    ifLoading: true,
  }

  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      selectedVal: '', // 输入框的值
      listData: data, // props传递的数据
      renderData: data, // list渲染的数据
      dropMenuShow: false, // 显示隐藏下拉列表
      selectedValMatch: true, // 输入框的值是否匹配list,默认是
      ifHideDelIcon: true,
    };
  }

  componentDidMount() {
    document.addEventListener('click', this.hideDropMenu);
  }

  /**
   * 渲染list列表
   */
  listItem=(data) => {
    const { selectedVal } = this.state;
    const listItems = data.map((ele, index) => (
      <div key={index} className={selectedVal === ele ? 'drop-item drop-item-select' : 'drop-item'} onClick={() => { this.checkListItem(ele); }}>
        {ele}
      </div>
    ));
    return listItems;
  }

  /**
   * 选择list
   */
  checkListItem=(val) => {
    const { inputValueChange } = this.props;
    const selectedValMatch = this.matchInputval(val);
    this.setState({
      selectedVal: val,
      dropMenuShow: false,
      selectedValMatch,
    });
    if (typeof inputValueChange === 'function') {
      inputValueChange(val);
    }
  }

  /**
   * input改变
   */
  inputChange=(event) => {
    const { inputValueChange } = this.state;
    const { target: { value } } = event;
    const val = value.replace(/\s+/g, '');

    const selectedValMatch = this.matchInputval(val);
    const bool = !(val.length > 0);

    this.setState({
      selectedVal: val,
      renderData: this.filterData(val),
      selectedValMatch,
      ifHideDelIcon: bool,
    });
    if (typeof inputValueChange === 'function') {
      inputValueChange(val);
    }
  }

  /**
   * 匹配输入框值是否存在list中
   */
  matchInputval=(val) => {
    const { listData } = this.state;
    const arr = listData.filter(ele => ele === val);
    const bool = arr.length > 0;
    return bool;
  }

  /**
   * 筛选list
   */
  filterData=(val) => {
    const { listData } = this.state;
    const data = listData.filter(ele => ele.indexOf(val) !== -1);
    return data;
  }

  /**
   * 三角点击
   */
  dropArrowClick=(event) => {
    const { listData, dropMenuShow } = this.state;
    const { ifLoading } = this.props;

    if (ifLoading) {
      return;
    }

    this.stopPropagation(event);
    this.setState({
      renderData: listData,
      dropMenuShow: !dropMenuShow,
    });
    this.textInput.focus();
  }

  /**
   * input click
   */
  inputClick=(event) => {
    this.stopPropagation(event);
    const { ifLoading } = this.props;
    if (ifLoading) {
      return;
    }
    this.setState({
      renderData: this.filterData(event.target.value),
      dropMenuShow: true,
    });
  }

  /**
   * 隐藏dropmenu
   */
  hideDropMenu=() => {
    this.setState({
      dropMenuShow: false,
    });
  }

  /**
   * 清空输入框
   */
  clearInput=(event) => {
    this.stopPropagation(event);
    this.setState({
      selectedVal: '',
      ifHideDelIcon: true,
    });
  }

  /**
   * 阻止冒泡
   */
  stopPropagation(e) {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const {
      selectedVal, renderData, dropMenuShow, selectedValMatch, ifHideDelIcon,
    } = this.state;
    const { placeholder, ifLoading } = this.props;
    return (
      <div className="container">
        <input
          className={selectedValMatch === true ? 'drop-input' : 'drop-input drop-input-notmatch'}
          placeholder={placeholder}
          ref={input => this.textInput = input}
          onChange={this.inputChange}
          onClick={this.inputClick}
          value={selectedVal}
          disabled={!!ifLoading}
        />

        <i className={ifHideDelIcon ? 'delIcon hide' : 'delIcon'} onClick={this.clearInput} />

        <span className="drop-arrow" onClick={this.dropArrowClick}>
          <i className={ifLoading ? 'loading-state' : 'caret'} />
        </span>
        <div
          onClick={(e) => { this.stopPropagation(e); }}
          className={dropMenuShow ? 'drop-box active' : 'drop-box'}
        >
          <div className="drop-menu">
            {this.listItem(renderData)}
          </div>
        </div>
      </div>
    );
  }
}

export default DropDown;