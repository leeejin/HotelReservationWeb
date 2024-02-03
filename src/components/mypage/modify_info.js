import { React, Component } from "react";
import { Form, Container, Card, Button, Modal, CloseButton, Table } from 'react-bootstrap';
import Constant from "../../util/constant_variables";
import MyStorage from '../../util/store';
import Axios from "axios";
import dayjs from 'dayjs';
export default class Modify extends Component {
    constructor(props) {
        super(props);
        this.origin = [];
        this.state = {
            userContents: [],
            userId: MyStorage.getState().userId,
            modalVisible: false,
            isFine: false,
            newPassword: '',
            newPasswordCheck: '',
            checking: false,
        }
    }

    componentDidMount() {
        this.callGetMyInfoAPI().then((response) => {
            this.origin = response;
            this.setState({ userContents: this.origin, isLoading: false });
        });
    }
    modalListener = () => {
        this.setState({ modalVisible: !this.state.modalVisible });
    }
    passwordChange = () => {
        this.setState({ isFine: true, modalVisible: false });
    }
    newPasswordChange = async (e) => {
        const formData = {
            userId: this.state.userId,
            newPassword: this.state.newPassword
        };
        if (formData.newPassword === this.state.newPasswordCheck) {
            await this.sendDataToServer(formData);

        } else {
            this.setState({ checking: true });
        }
    }

    async callGetMyInfoAPI() {
        try {
            const response = await Axios.get(Constant.serviceURL + `/mypage/${this.state.userId}`);
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];
            return dataArray[0]; // Return the first item in the array
        } catch (error) {
            console.error(error);
            return {}; // Return an empty object in case of an error
        }
    }

    async sendDataToServer(data) {
        try {
            const response = await fetch(Constant.serviceURL + `/mypage/${this.state.userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }


            const responseData = await response.json();
            console.log('Server Response:', responseData);
            alert("비밀번호가 성공적으로 변경되었습니다!");
            this.setState({ isFine: false });
        } catch (error) {
            console.error('Error sending data to server:', error.message);
        }
    }
    render() {
        const formattedRoomDate = dayjs(this.state.userContents.userBirth).format('YYYY-MM-DD');
        return (
            <>
                <Card className="mt-3 p-3">
                    <Card.Body>
                        <h5 className="text-center">회원정보</h5>
                        <Table>
                            <tbody>
                                <tr>
                                    <th>이메일</th>
                                    <td>{this.state.userContents.userEmail}</td>
                                </tr>
                                <tr>
                                    <th>생년월일</th>
                                    <td>{formattedRoomDate}</td></tr>
                                <tr>
                                    <th>전화번호</th>
                                    <td>{this.state.userContents.userPhone}</td>
                                </tr>

                            </tbody>
                        </Table>
                        <button className="btn color-btn" onClick={this.modalListener}>비밀번호 변경</button>
                    </Card.Body>
                </Card>
                {
                    this.state.modalVisible === true && <ModalPasswordChange modalListener={this.modalListener} passwordChange={this.passwordChange} userContents={this.state.userContents} />
                }
                {
                    this.state.isFine === true && <Card className="mt-3 p-3">
                        <Card.Body>
                            <h5 className="text-center">비밀번호 변경</h5>
                            <Form.Label>새로운 비밀번호를 입력해주세요.</Form.Label>
                            <Form.Control
                                type="password"
                                className="mb-3"
                                onChange={(e) => { this.setState({ newPassword: e.target.value }) }}
                            />
                            <Form.Label>비밀번호 확인을 위해 한번 더 입력해주세요.</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) => { this.setState({ newPasswordCheck: e.target.value }) }}
                            />
                            {
                                this.state.checking === true && <div>
                                    <p className="color-deadline">비밀번호가 틀립니다.</p>
                                </div>
                            }

                            <div style={{ textAlign: 'right' }}>
                                <button type="submit" className="btn color-btn" onClick={(e) => this.newPasswordChange(e)}>변경</button>
                            </div>

                        </Card.Body>
                    </Card>
                }
            </>

        );
    }
}

class ModalPasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userPassword: ''
        }
    }
    modalListener = () => {
        this.props.modalListener();
    }
    handleSubmit = (e) => {
        e.preventDefault();

        if (this.props.userContents.userPassword === this.state.userPassword) {
            this.props.passwordChange();
        } else {
            alert("비밀번호가 틀렸습니다!");
        }
    }
    render() {
        console.log(this.state.userPassword)
        return (
            <>
                <div className="wrap w-100 h-100" onClick={this.props.modalListener}></div>
                <div className="modalcontents">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Modal.Header>
                            <h3>비밀번호 변경</h3>
                            <CloseButton onClick={this.props.modalListener} />
                        </Modal.Header>

                        <Form.Group>
                            <Form.Label>비밀번호 변경을 위해 이전 비밀번호를 입력해주세요.</Form.Label>
                            <Form.Control onChange={(e) => { this.setState({ userPassword: e.target.value }) }} />
                        </Form.Group>

                        <div style={{ textAlign: 'right' }}>
                            <button className="btn cancel-btn" onClick={this.props.modalListener}>닫기</button>
                            <button type="submit" className="btn color-btn">확인</button>
                        </div>
                    </Form>
                </div>
            </>
        )
    }
}