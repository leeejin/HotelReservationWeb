import React, { Component } from "react";
import { BrowserRouter, Outlet, Route, Routes, Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from './pages/mainpage_page';
import InquiryPage from "./pages/inquiryroom_page";
import Mypage from './pages/mypage_page';
import Login from './pages/login_page';
import Signup from './pages/signup_page';
import Develop from './pages/process_page';

import Constant from "./util/constant_variables";

import MyStorage from "./util/store";

//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log("초기 상태:", MyStorage.getState());
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/DevelopPage" element={<Develop />} />
          <Route path="/LoginPage" element={<Login />} />
          <Route path="/SignupPage" element={<Signup />} />

          <Route path="/MyPage" element={<ConditionRoute path={'/LoginPage'} originPath={"/MyPage"} />} >
            <Route path="/MyPage" element={<Mypage />} />
          </Route>
          <Route path="/InquiryPage" element={<InquiryPage />} />
        </Routes>
      </BrowserRouter >
    )
  }
}

class ConditionRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: sessionStorage.getItem("userEmail"),
      userPassword: sessionStorage.getItem("userPassword"),
    };
  }

  componentDidMount() {
    this.unsubscribe = MyStorage.subscribe(this.onStorageChange);
    console.log("초기 상태:", MyStorage.getState());
  }

  onStorageChange = () => {
    console.log('라우터에서 리덕스에 변경된 값을 감지 = ', MyStorage.getState());
    this.setState({
      userEmail: sessionStorage.getItem("userEmail"),
      userPassword: sessionStorage.getItem("userPassword"),
    });
  };

  render() {
    if (this.state.userEmail !== '') {
      return (<Outlet />);
    } else {
      return (<Navigate to={this.props.originPath} />);
    }
  }
}