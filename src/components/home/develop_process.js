import { React, Component } from "react";
import { Container, Card, Button, Form, Table, ListGroup, Nav } from 'react-bootstrap';
//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
import image from '../images/design.png';

import nodejs from '../images/instrument_image/nodejs.png';
import front from '../images/instrument_image/htmlcssjs.jpeg';
import mysql from '../images/instrument_image/mysql.webp';
import react from '../images/instrument_image/react.png';
import redux from '../images/instrument_image/redux.png';

import mainImage from '../images/backgroundhotel.jpg'
export default class ProcessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    scrollToAboutUs1 = () => {
        const aboutUsSection = document.getElementById("aboutUsSection1");
        const offset = -70; // Adjust this offset as needed
        const targetPosition = aboutUsSection.offsetTop + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };
    scrollToAboutUs2 = () => {
        const aboutUsSection = document.getElementById("aboutUsSection2");
        const offset = -70; // Adjust this offset as needed
        const targetPosition = aboutUsSection.offsetTop + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };
    render() {

        return (
            <div className="component" style={{ color: 'white', margin: -10, marginTop: 50 }}>
                <div className="background-color1" style={{ height: 200 }} />
                <Nav variant="underline">
                    <Nav.Item>
                        <Nav.Link className="scroll-click" onClick={this.scrollToAboutUs1} >사용개발도구</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link className="scroll-click" onClick={this.scrollToAboutUs2} >개발과정</Nav.Link>
                    </Nav.Item>
                </Nav>
                <div className="background-color2 p-3" id="aboutUsSection1" >
                    <h3 className="text-center">개발도구</h3>
                    <Container className="d-flex">
                        <Card style={{ width: '33.3%' }}>
                            <Card.Title className="text-center">프론트</Card.Title>
                            <Card.Img variant="top" src={front} />
                            <Card.Img variant="top" src={react} />
                            <Card.Img variant="top" src={redux} />
                            <Card.Body>
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '33.3%' }}>
                            <Card.Title className="text-center">시나리오</Card.Title>
                            <Card.Img variant="top" src={image} />
                            <Card.Body>
                                <Card.Text>
                                    This is a sample text for the USG Assignment, Feel free to replace it with your own content.
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>1. 사용자는 호텔 객실을 조회하고 원하는 객실을 예약한다.</ListGroup.Item>
                                <ListGroup.Item>2. 사용자가 예약한 객실을 결제한다.</ListGroup.Item>
                                <ListGroup.Item>3. 사용자는 예약일 전에 예약된 객실을 취소할 수 있다.</ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <Card style={{ width: '33.3%' }}>
                            <Card.Title className="text-center">백엔드</Card.Title>
                            <Card.Text>서버</Card.Text>
                            <Card.Img variant="top" src={nodejs} />
                            <Card.Text>데이터베이스</Card.Text>
                            <Card.Img variant="top" src={mysql} />
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Container>

                </div>

                <div className="background-color2 p-3" id="aboutUsSection2">
                    <h3 className="text-center">개발 과정</h3>
                    <div className="w-50 m-auto" >

                        <Table>

                            <tbody>
                                <tr>
                                    <th>~2023-11 중순</th>
                                    <td>1. react.js로 웹페이지 디자인</td>
                                </tr>
                                <tr>
                                    <th>~2023-12-03</th>
                                    <td>1. MySql이랑 node.js, react 연동 시도</td>
                                </tr>
                                <tr>
                                    <th>2023-12-04</th>
                                    <td>
                                        <p>1.  MySql이랑 node.js, react 연동 성공</p>
                                        <p>2. 데이터 부르고 나타내기 GET</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-05</th>
                                    <td>
                                        <p>1. 데이터 수정하기 UPDATE, POST</p>
                                        <p>2. 검색창 기능</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-06</th>
                                    <td>
                                        <p>1. 회원가입</p>
                                        <p>2. 이메일 중복체크</p>
                                        <p>3. github에 올리기</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-08</th>
                                    <td>
                                        <p>1. 데이터 베이스 다시만들기</p>
                                        <p>2. 다시 만들기 완료 (room, user, reserveInfo)</p>
                                        <p>3. server에서 예약결제, 취소, inquiry,mypage페이지 로딩 수정 완료</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-09 </th>
                                    <td>
                                        <p>About us 애니메이션이랑 모달 애니메이션 넣고 배경그라데이션 삽입</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-10 </th>
                                    <td>
                                        <p>1. 가격순, 이름순 드롭다운 데이터필터링 만들기</p>
                                        <p>2. input, dropdown 디자인 수정</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-15</th>
                                    <td>
                                        <p>1. 오류 고치기</p>
                                        <p> - 데이터필터링 원래대로는 안됨 </p>
                                        <p>- 모달에서 아무것도 클릭안했을 때 에러</p>
                                        <p>2. 로그인 구현</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-16 ~ 2023-12-19 </th>
                                    <td>
                                        <p>1. 로그인/로그아웃일때 페이지 관리  = Redux 이용</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-20 </th>
                                    <td>
                                        <p>1. 로그아웃 구현 및 페이지 관리 = Redux 이용</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-24 </th>
                                    <td>
                                        <p>1. 마이페이지 들어가서 내가 예약한 룸 리스트 불러오기</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-26 </th>
                                    <td>
                                        <p>1. 회원정보 수정 - 비밀번호 변경 완료</p>
                                        <p>2. 드롭리스트 수정하기 ~까지하면 기능 끝</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-27</th>
                                    <td>
                                    <p>1. DatePicker 수정하기</p>
                                    <p>2. dd일부터 dd일까지 수정하고 이 사이에 예약있을 경우 false로 반환하는 mysql, server 수정 완료</p>
                                    </td>
                                </tr>
                                <tr>
                                    <th>2023-12-28 (예정)</th>
                                    <td>
                                        <p>1. 취소 눌렀을때 redirect하게 만들기</p>
                                        <p>2. 디자인 수정</p>
                                        <p>3. 코드 수정</p>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div className="background-color3" style={{ height: 200 }} />
            </div>


        );
    }
}