import { React, Component } from 'react';
import { Form, Modal, CloseButton, Table } from 'react-bootstrap';
import Constant from "../../util/constant_variables";
import dayjs from 'dayjs';
import MyStorage from '../../util/store';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.module.css';

export default class ModalInquiry extends Component {
    constructor(props) {
        super(props);
        this.howMany = Constant.getHowManyBed();
        this.state = {
            today: dayjs(new Date()),
            id: this.props.room.id,
            startDate: null,
            endDate: null,
            bedType: this.howMany[0].value,
            addCost: 0,
            totalCost: this.props.room.roomCost,
            day: 1,
            userId: MyStorage.getState().userId,
            message: null
        };
    }

    getSalePercentage = (key) => {
        switch (key) {
            case 2: return 3;
            case 3: return 5;
            case 4: return 10;
            default: return 0;
        }
    };
    handleSelectionChange = (date, selectedBedType) => {
        const [start, end] = date;

        const differenceInMillis = end - start;
        const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);

        const selectedBedTypeObject = this.howMany.find((item) => item.value === selectedBedType);

        if (selectedBedTypeObject) {
            const salePercentage = this.getSalePercentage(selectedBedTypeObject.key);
            const originalCost = this.props.room.roomCost * (differenceInDays || 0);
            const costWithSale = ((originalCost * (1 - salePercentage / 100))).toFixed(2);

            this.setState({
                startDate: start,
                endDate: end,
                day: Math.floor(differenceInDays+1),
                bedType: selectedBedType,
                addCost: salePercentage,
                totalCost: costWithSale,
            });
        }

        if (this.state.message === 0) {
            this.setState({ message: null }); // 메시지 초기화
        }
    };
    // 폼 제출 이벤트 핸들러
    handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            id: this.state.id,
            startDate: dayjs(this.state.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(this.state.endDate).format('YYYY-MM-DD'),
            bedType: this.state.bedType,
            roomId: this.state.id,
            userId: this.state.userId,
            totalCost: this.state.totalCost
            // 다른 필요한 데이터 추가
        };

        if (formData.startDate == '' || formData.endDate == '') {
            alert('예약날짜를 입력해주세요.');
        } else if (formData.startDate == formData.endDate) {
            alert('당일치기는 안됩니다');
        } else {
            if (window.confirm("결제하시겠습니까?")) {
                await this.sendDataToServer(formData);
            }
        }


    }
    async sendDataToServer(data) {
        try {
            const response = await fetch(Constant.serviceURL + '/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorResponseData = await response.json();
                console.error('Server Error Response:', errorResponseData);
                throw new Error('Server Error');
            }
            const jsonResponse = await response.json();
            if (jsonResponse.tf === false) this.setState({ message: 0 });
            else {
                this.props.modalListener();
                alert('예약이 완료되었습니다!');
            }
            console.log('Server Response:', jsonResponse);
        } catch (error) {
            console.error('Error sending data to server:', error.message);
        }
    }

    render() {
        const room = this.props.room;
        return (
            <>
                <div className="wrap w-100 h-100" onClick={this.props.modalListener}></div>
                <div className="modalcontents">
                    <Form onSubmit={(e) => this.handleSubmit(e)}>
                        <Modal.Header>
                            <h3>예약</h3>
                            <CloseButton onClick={this.props.modalListener} />
                        </Modal.Header>
                        <div>
                            <Form.Group>
                                <div className="img-main">
                                    <img src={room.roomImage} width={"100%"} />

                                    <div className="w-100 p-3 img-text" >
                                        <h5>{room.roomName}</h5>
                                        <p>{room.roomText}</p>
                                    </div>
                                </div>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <th>예약날짜</th>
                                            <td colSpan={3}>
                                                <div className="parent-container">
                                                    <DatePicker
                                                        selectsRange={true}
                                                        className="datepicker form-control"
                                                        dateFormat="yyyy-MM-dd"
                                                        startDate={this.state.startDate}
                                                        endDate={this.state.endDate}
                                                        minDate={dayjs().add(1, 'day').toDate()}
                                                        onChange={(date) => this.handleSelectionChange(date, this.state.bedType)}
                                                    />
                                                    {
                                                        this.state.message === 0 && <p className="color-deadline">이미 같은 날짜에 예약되어있습니다.</p>
                                                    }
                                                </div>


                                            </td>
                                        </tr>
                                        <tr>
                                            <th>침대종류</th>
                                            <td colSpan={3}>
                                                <Form.Select className="datepicker"
                                                    onClick={(e) => this.handleSelectionChange([this.state.startDate, this.state.endDate], e.target.value)}
                                                >
                                                    {
                                                        this.howMany.map((how) =>
                                                            <option
                                                                key={how.key}
                                                                value={how.value}
                                                            >{how.value}</option>
                                                        )
                                                    }
                                                </Form.Select>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>기본 비용 ($)</th>
                                            <td><p>$ {`${room.roomCost}`}</p></td>
                                            <td><strong>할인 (%)</strong></td>
                                            <td><p>{`${this.state.addCost}`}%</p></td>
                                        </tr>

                                        <tr>
                                            <th>총 납부금액 ($)</th>
                                            <td colSpan={3}><p className="cost">$ {`${this.state.totalCost}`}</p></td>
                                        </tr>
                                    </tbody>
                                </Table>

                            </Form.Group>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                            <button className="btn cancel-btn" onClick={this.props.modalListener}>
                                취소
                            </button>
                            <button type="submit" className="btn color-btn">결제</button>
                        </div>
                    </Form>
                </div>
            </>

        );
    }

}

