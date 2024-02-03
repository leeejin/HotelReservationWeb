import { React, Component } from "react";
import { Container, Card, Button, Form, Table, } from 'react-bootstrap';
//아메시스트 : #9966CC 밝은 레드오렌지 : #ffb7b3
import image from '../images/design.png';
import lobby from '../images/lobby.jpg';
import restaurant from '../images/restaurant.jpg';
import bar from '../images/roof bar.jpg';
import mainImage from '../images/backgroundhotel.jpg'
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.structure = [{
            src: lobby,
            title: '로비',
            contents: '로비는 호텔의 브랜드 이미지와 분위기를 반영하는 곳으로, 고급스러운 가구와 예술 작품, 조명 등이 조화롭게 배치돼 있습니다. 색상 선택과 장식은 고객에게 편안하고 환영받는 느낌을 주기 위해 신중하게 고려됩니다.'
        }, {
            src: restaurant,
            title: '레스토랑',
            contents: '레스토랑은 음식과 서비스를 제공하여 손님들에게 특별한 식사 경험을 제공하는 음식 서비스 업종 중 하나입니다. 레스토랑은 다양한 형태와 스타일로 나타날 수 있으며, 다양한 요구에 맞춰 메뉴, 분위기, 서비스 등을 제공합니다.'
        }, {
            src: bar,
            title: '루프탑 바',
            contents: '루프탑 바는 레스토랑과 비슷하게 음식과 서비스를 제공하며 손님들에게 특별한 경험을 선사합니다. 다양한 음료와 분위기를 즐길 수 있습니다.'
        }]
    }

    scrollToAboutUs = () => {
        const aboutUsSection = document.getElementById("aboutUsSection");
        const offset = -70; // Adjust this offset as needed
        const targetPosition = aboutUsSection.offsetTop + offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };
    render() {


        return (
            <div className="component" style={{ color: 'white', margin: -10, marginTop: 50 }}>
                <div className="background-color1" style={{ height: 200 }} />
                <div style={{ position: 'relative' }}>
                    <img
                        className="w-100"
                        src={mainImage}
                        style={{ height: 400 }}
                        alt="Main Background"
                    />

                    <div className="w-100 p-3 rel-text" >
                        <div>
                            <h1><strong>The GRAND BUDAPEST HOTEL</strong></h1>
                            <p style={{ width: '60%' }}>환영합니다! 저희 호텔 예약 홈페이지는 여행을 더욱 편리하게 계획하고 즐겁게 즐길 수 있도록 고안되었습니다. 최고의 숙박 경험을 제공하기 위해 편리한 예약 시스템을 통해 간편하게 객실을 검색하고 예약할 수 있습니다. 언제든지 저희 호텔 예약 홈페이지를 방문하여 편리하고 즐거운 여행을 시작하세요! </p>
                        </div>
                        <span className="scroll-click" onClick={this.scrollToAboutUs} style={{ position: 'absolute' }}>
                            About us
                        </span>
                    </div>
                </div>


                <div className="background-color2 p-5" id="aboutUsSection" >
                    <h3 className="text-center">호텔 구성</h3>
                    <Container>
                        {
                            this.structure.map((struct, i) =>
                                <div className="d-flex" key={i}>
                                    <img src={struct.src} width={'50%'} style={{ order: i % 2 === 0 ? 0 : 1 }} />
                                    <div className="w-50 m-auto">
                                        <h3 className="text-center">{struct.title}</h3>
                                        <p>{struct.contents}</p>
                                    </div>
                                </div>
                            )
                        }
                    </Container>
                </div>
                <div className="background-color3" style={{ height: 200 }} />
            </div>


        );
    }
}