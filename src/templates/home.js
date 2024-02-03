import React, { Component } from "react";
import Menubar from "./menubar.js";
import { Container } from 'react-bootstrap';
import '../style/constructor.css';
import '../style/main.css';

//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
export default class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="background">
        <div className="top">
          <Menubar /></div>
        <div className="middle background-color">{this.props.children}</div>
      </div>
    );
  }

}


