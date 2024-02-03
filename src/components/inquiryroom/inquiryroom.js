import { React, Component } from "react";
import { Card, Container, Carousel, Form, Badge, Offcanvas, Navbar, Stack } from 'react-bootstrap';
import ModalInquiry from "./modal_inquiryroom";
import Constant from "../../util/constant_variables";
import Axios from "axios";
import dummy from "../../util/data";

import search from "../images/search.png";
import FormRange from "react-bootstrap/esm/FormRange";
import filterIcon from "../images/filter_icon.png"
export default class Inquiryroom extends Component {
    constructor(props) {
        super(props);

        this.menus = Constant.getFilterMenus();
        this.origin = [];

        this.state = {
            modalVisible: false,
            room: {},
            contents: [],

            title: '',
            isSettleComplete: this.menus[0].value,
        }
    }


    componentDidMount() {
        this.callGetRoomListAPI().then((response) => {
            this.origin = response;
            this.setState({ contents: this.origin });
        });
    }

    modalListener = (room) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            room: room
        });

    }
    search = (e) => {
        e.preventDefault();
        this.dataFiltering(this.state.title);
    }
    showSelectedValue = () => {
        this.dataFiltering(null, this.state.isSettleComplete);
    }

    dataFiltering = (title, filter) => {
        let filteredContents = [...this.state.contents];

        if (title) {
            filteredContents = filteredContents.filter((room) => room.roomName.includes(title))
        }
        else if (filter) {
            switch (Number(filter)) {
                case this.menus[1].value:
                    filteredContents = filteredContents.sort((a, b) => b.roomCost - a.roomCost);
                    break;
                case this.menus[2].value:
                    filteredContents = filteredContents.sort((a, b) => a.roomCost - b.roomCost);
                    break;
                case this.menus[3].value:
                    filteredContents = filteredContents.sort((a, b) => b.roomName < a.roomName ? 1 : b.roomName > a.roomName ? -1 : 0);
                    break;
                case this.menus[4].value:
                    filteredContents = filteredContents.sort((a, b) => b.roomName > a.roomName ? 1 : b.roomName < a.roomName ? -1 : 0);
                    break;
                default:
                    filteredContents = this.origin;
                    break;

            }
        }

        this.setState({ contents: filteredContents });
    }
    async callGetRoomListAPI() {
        try {
            const response = await Axios.get(Constant.serviceURL + '/inquiry');
            // response.data를 배열로 변환
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];

            return dataArray;
        } catch (error) {
            console.error(error);
        }
    }
    render() {
        const expand = false;
        return (
            <>
                <Container className="component">

                    <Navbar key={false} expand={expand}>
                        <Container>
                            <div className="toggler">
                                <Navbar.Toggle className="toggler-style" aria-controls={`offcanvasNavbar-expand-${expand}`} ><img src={filterIcon} width={30} /></Navbar.Toggle>
                            </div>
                            <Navbar.Offcanvas
                                id={`offcanvasNavbar-expand-${expand}`}
                                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                                placement="end"
                            >
                                <Offcanvas.Header closeButton />
                                <Offcanvas.Body>
                                    <Form onSubmit={(e) => { this.search(e) }}>
                                        <div className="search-form" >
                                            <div className="search-input">
                                                <Form.Control
                                                    type="text"
                                                    placeholder="호텔명으로 검색해주세요."
                                                    onChange={(e) => this.setState({ title: e.target.value })}
                                                    autoFocus
                                                />
                                            </div>
                                            <div className="search-button">
                                                <img src={search} width={40} onClick={(title) => this.search(title)} />
                                            </div>
                                        </div>
                                    </Form>
                                    <div className="mt-3">
                                        {this.menus.map((filter) => (
                                            <>
                                                {filter.key === 0 ? <p>이름순</p> : filter.key === 3 && <p>가격순</p>}

                                                <button
                                                    className="filtering-badge filtering-badge-uncheck"
                                                    key={filter.key}
                                                    value={filter.value}
                                                    onClick={(e) => {
                                                        this.setState({ isSettleComplete: e.target.value }, () => {
                                                            this.showSelectedValue(); // 새로운 값으로 표시 갱신
                                                        });
                                                    }}>
                                                    {filter.name}
                                                </button>

                                            </>

                                        ))}

                                    </div>

                                </Offcanvas.Body>
                            </Navbar.Offcanvas>
                        </Container>
                    </Navbar>

                    {
                        this.state.modalVisible && <ModalInquiry modalListener={this.modalListener} room={this.state.room} />
                    }

                </Container>
                <div>
                    {

                        this.state.contents.map((room) =>
                            <ListItem room={room} key={room.id} modalListener={(room) => this.modalListener(room)} />
                        )
                    }
                </div>
            </>
        );
    }
}

class ListItem extends Component {
    constructor(props) {
        super(props);
    }
    modalListener = () => {
        this.props.modalListener(this.props.room);

    }
    render() {
        const room = this.props.room;
        return (
            room.roomUsable !== 0 &&
            <div className="list-item" >
                <Card>
                    <Card.Img variant="top" src={room.roomImage} style={{ height: 200 }} />
                    <Card.Body>
                        <Card.Title className="title">{room.roomName}</Card.Title>
                        <Card.Text className="content">{room.roomText}</Card.Text>

                        <div className="w-100 d-flex" >
                            <Card.Text className="cost flex-grow-1">$<span>{room.roomCost}</span></Card.Text>
                            <button className="btn color-btn" onClick={this.modalListener}>예약하기</button>
                        </div>
                    </Card.Body>
                </Card>
            </div>

        );
    }
}