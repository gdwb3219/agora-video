import React from "react";

class LifeCycleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("111.===Constructor");
  }

  static getDerivedStateFromProps(props, state) {
    console.log("222.===getDerivedStateFromProps");
    return null; // state 변경이 필요 없는 경우
  }

  componentDidMount() {
    console.log("333.===ComponentDidMount");
    // 컴포넌트가 마운트된 후 수행할 작업
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("444.===ShouldComponentUpdate");
    return true; // false를 반환하면 업데이트를 하지 않음
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("555.===getSnapshotBeforeUpdate");
    return null; // 업데이트 전에 DOM 상태를 캡처
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("666.===ComponentDidUpdate");
    // 컴포넌트가 업데이트된 후 수행할 작업
  }

  componentWillUnmount() {
    console.log("777.===ComponentWillUnmount");
    // 컴포넌트가 언마운트되기 전에 수행할 작업
  }

  render() {
    console.log("888.===Render");
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Increment
        </button>
      </div>
    );
  }
}

export default LifeCycleComponent;
