import React, { Component } from "react";
import { Container, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Constant from "../../util/constant_variables";
import MyStorage from '../../util/store';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: "",
            userPassword: "",
        };
        MyStorage.dispatch({ type: "" });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.userEmail !== '' && this.state.userPassword !== '') {

            const response = await this.sendLoginToServer();
            const json = await response.json();

            if (json.isLogin === "True") {
                console.log("로그인 성공:", json);

                MyStorage.dispatch({ type: "LOGIN", data: { userId: json.userId, userEmail:this.state.userEmail, userPassword: this.state.userPassword } });
                alert("환영합니다!");
                window.location.href = "/";
            } else {
                alert("비밀번호가 틀렸습니다. 다시 입력해주세요.");
                MyStorage.dispatch({ type: "LOGOUT" });
            }
        } else {
            alert('아이디와 비밀번호를 제대로 입력해주세요!');
        }
    };

    async sendLoginToServer() {
        const data = {
            userEmail: this.state.userEmail,
            userPassword: this.state.userPassword,
        };
        try {
            const response = await fetch(Constant.serviceURL + '/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            return response;
        } catch (error) {
            console.error('Error sending data to server:', error.message);
            throw error;
        }
    }

    render() {
        return (
            <Container style={{ marginTop: '40vh' }}>
                <div className="w-50 m-auto">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="email"
                                autoFocus
                                onChange={(e) => { this.setState({ userEmail: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>패스워드</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => { this.setState({ userPassword: e.target.value }) }} />
                        </Form.Group>
                        <div className="text-center">
                            <button type="submit" className="btn color-btn">로그인</button>
                        </div>
                    </Form>
                </div>
                <p>아직 회원이 아니세요? <Link to='/SignupPage' className="color-btn">회원가입</Link></p>
            </Container>
        );
    }
}