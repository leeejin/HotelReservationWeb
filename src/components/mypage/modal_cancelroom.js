import { React, Component } from 'react';
import { Button, Form, Modal, CloseButton, Container, Table } from 'react-bootstrap';
import Constant from "../../util/constant_variables";
import dayjs from 'dayjs';

export default class ModalCancel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            today: dayjs(new Date()).format('YYYY-MM-DD'),
            id: this.props.room.id,
        }
    }

    // 폼 제출 이벤트 핸들러
    handleSubmit = async () => {

        const formData = {
            id: this.state.id,
            // 다른 필요한 데이터 추가
        };

        // this 키워드를 사용하여 클래스 내부의 함수 호출
        if (window.confirm("예약을 취소하시겠습니까?")) {
            await this.sendDataToServer(formData);
            alert("취소 완료되었습니다!");

        }

    };

    async sendDataToServer(data) {
        try {
            const response = await fetch(Constant.serviceURL + '/cancel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const responseData = await response.json();
            console.log('Server Response:', responseData);

        } catch (error) {
            console.error('Error sending data to server:', error.message);
        }
    }

    render() {
        const info = this.props.room;
        const formattedStartDate = dayjs(info.startDate).format('YYYY-MM-DD');
        const formattedEndDate = dayjs(info.endDate).format('YYYY-MM-DD');
        return (
            <>
                <div className="wrap w-100 h-100" onClick={this.props.modalListener}></div>
                <div className="modalcontents">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Modal.Header>
                            <h3>취소</h3>
                            <CloseButton onClick={this.props.modalListener} />
                        </Modal.Header>

                        <Form.Group>
                            <div className="img-main">
                                <img src={info.roomImage} width={"100%"} />
                                <div className="w-100 p-3 img-text" >
                                    <h5>{info.roomName}</h5>
                                    <p>{info.roomText}</p>
                                </div>
                            </div>

                            <Table>
                                <tbody>
                                    <tr>
                                        <th><strong>비용 ($)</strong></th>
                                        <td>{info.totalCost}</td>
                                    </tr>
                                    <tr>
                                        <th><strong>침대타입</strong></th>
                                        <td>{info.bedType}</td>
                                    </tr>
                                    <tr>
                                        <th><strong>예약된날짜</strong></th>
                                        <td>
                                            <span className={info.startDate >= this.state.today ? "color-safe" : "color-deadline"}>
                                                {formattedStartDate} ~ {formattedEndDate}
                                            </span>
                                        </td>

                                    </tr>
                                </tbody>
                            </Table>
                        </Form.Group>

                        <div style={{ textAlign: 'right' }}>
                            <button className="btn cancel-btn" onClick={this.props.modalListener}>닫기</button>
                            {
                                info.startDate > this.state.today ?
                                    <button type="submit" className="btn color-btn">예약취소</button> :
                                    <button type="submit" className="btn color-btn">삭제</button>
                            }

                        </div>
                    </Form>
                </div>
            </>

        );
    }

}
