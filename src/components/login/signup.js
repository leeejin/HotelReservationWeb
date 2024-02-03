import { React, Component } from "react";
import { Container, Card, Button, Form } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';
//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
import image from '../images/design.png';
import Constant from "../../util/constant_variables";

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.emailMenus = Constant.getEmailMenus();
        this.phoneNumber = Constant.getPhoneNumber();
        this.state = {
            userName: '',
            userPhone: '010',
            userBirth: '',
            userEmail: '',
            userPassword: '',
            passwordCheck: '',

            lastEmail: this.emailMenus[0].value,

            secondPhone: '',
            lastPhone: '',

            message: null,
        }

    }


    // 폼 제출 이벤트 핸들러
    handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            userName: this.state.userName,
            userPhone: this.state.userPhone + '-' + this.state.secondPhone + '-' + this.state.lastPhone,
            userBirth: this.state.userBirth,
            userEmail: this.state.userEmail + '@' + this.state.lastEmail,
            userPassword: this.state.userPassword
            // 다른 필요한 데이터 추가
        };

        if (formData.userName != '' && formData.userPhone != '' && formData.userBirth != '' && formData.userEmail != '' && formData.userPassword != '' && this.state.passwordCheck != '' && this.state.message == 0) {
            if (formData.userPassword == this.state.passwordCheck) {
                console.log('Sending to server:', formData);
                await this.sendDataToServer(formData);
                alert('회원가입이 완료되었습니다! 로그인해주세요.');
                window.location.href = "/LoginPage";
            }
        }
        else {
            if (this.state.message != 0) {
                alert('다시 입력해주세요.');
            }
        }



    }

    // 이메일 중복확인
    emailCheck = (e) => {
        e.preventDefault();
        const formData = {
            userEmail: this.state.userEmail + '@' + this.state.lastEmail,
        };
        if (formData.userEmail === '@' + this.state.lastEmail) {
            this.setState({ message: -1 });
        }
        else {
            fetch(Constant.serviceURL + Constant.userURL + '/checkEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((res) => res.json())
                .then((json) => {
                    console.log(formData.userEmail + '이메일 체크중');
                    if (json.tf === true) {
                        this.setState({ message: 0 });
                    } else {
                        this.setState({ message: 1 });
                    }
                });
        }
    }
    async sendDataToServer(data) {
        try {
            const response = await fetch(Constant.serviceURL + Constant.userURL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.error('Server Error Response:', errorResponseData);
                throw new Error('Server Error');
            }

            const responseData = await response.json();
            console.log('Server Response:', responseData);
        } catch (error) {
            console.error('Error sending data to server:', error.message);
        }
    }
    render() {
        return (
            <Container className="component">
                <div className="w-50 m-auto mt-5">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <Form.Control
                                type="text"
                                autoFocus
                                onChange={(e) => { this.setState({ userName: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>휴대전화</Form.Label>
                            <div className="d-flex">
                                <Form.Select
                                    onChange={(e) => {
                                        this.setState({ userPhone: e.target.value });
                                    }}>
                                    {
                                        this.phoneNumber.map((phone) =>
                                            <option
                                                key={phone.key}
                                                value={phone.value}>{phone.value}</option>
                                        )
                                    }
                                </Form.Select>
                                <span className="mx-1">-</span>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => { this.setState({ secondPhone: e.target.value }) }} />
                                <span className="mx-1">-</span>
                                <Form.Control
                                    type="text"
                                    onChange={(e) => { this.setState({ lastPhone: e.target.value }) }} />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>생년월일</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={(e) => { this.setState({ userBirth: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <button
                                className="btn color-btn"
                                onClick={(e) => { this.emailCheck(e) }}>중복체크</button>
                            <div className="d-flex">
                                <Form.Control
                                    type="text"
                                    onChange={(e) => {
                                        this.setState({ userEmail: e.target.value, message: -1 });
                                    }}
                                />
                                <span className="mx-1">@</span>
                                <Form.Select
                                    onChange={(e) => {
                                        this.setState({ lastEmail: e.target.value, message: -1 });
                                    }}>
                                    {
                                        this.emailMenus.map((email) =>
                                            <option
                                                key={email.key}
                                                value={email.value}>{email.value}</option>
                                        )
                                    }
                                </Form.Select>
                            </div>

                            {
                                this.state.message === 0 ?
                                    <p className="color-safe">사용 가능한 아이디입니다.</p>
                                    : this.state.message === -1 ?
                                        <p className="color-deadline">아이디를 입력해주세요.</p> :
                                        this.state.message === 1 &&
                                        <p className="color-deadline">다른 ID를 입력해주세요</p>

                            }

                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1">
                            <Form.Label>비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => { this.setState({ userPassword: e.target.value }) }} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => { this.setState({ passwordCheck: e.target.value }) }}
                            />
                            {
                                this.state.userPassword != this.state.passwordCheck ? <p className="color-deadline">비밀번호가 다릅니다</p> : null
                            }
                        </Form.Group>

                        <div className="text-center">
                            <button className="btn color-btn" type="submit" >회원가입</button>
                        </div>
                    </Form>
                </div>
            </Container>

        );
    }
}