import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DropDown from './src/components/DropDown';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ifLoading: true,
    };

    setTimeout(() => {
      this.setState({
        ifLoading: false,
      });
    }, 2000);
  }

  render() {
    const { ifLoading } = this.state;
    const dataArr = [];
    for (let i = 0; i < 1000; i += 1) {
      dataArr.push(`第${i + 1}条数据`);
    }
    return (
      <div style={{ width: '200px', height: '50px', margin: 'auto' }}>
        <DropDown data={dataArr} placeholder="哈哈哈" ifLoading={ifLoading} />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));