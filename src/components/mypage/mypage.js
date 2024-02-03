import React, { Component } from "react";
import { Form, Container, Card, Button, ButtonGroup, Nav } from 'react-bootstrap';
import { Link } from "react-router-dom";

import Constant from "../../util/constant_variables";
import ReservedList from "./reservedList";
import Modify from "./modify_info";

import MyStorage from '../../util/store';
import Axios from "axios";
export default class Mypage extends Component {
    constructor(props) {
        super(props);
        this.origin = [];
        this.getMyPageStatus = Constant.getMyPageStatus();
        this.state = {
            userContents: [],
            isLoading: true, // Add a loading state
            userId: MyStorage.getState().userId,
            contents: [],
            nowSituation: 0,
        };
    }

    componentDidMount() {
        this.callGetMyInfoAPI().then((response) => {
            this.origin = response;
            this.setState({ userContents: this.origin, isLoading: false });
        });
    }

    handleMenuClick = async (menuKey) => {
        const menuActions = {
            1: () => this.setState({ nowSituation: 1 }),
            2: () => this.setState({ nowSituation: 2 }),
            3: async () => {
                try {
                    if (window.confirm("로그아웃 하시겠습니까?")) {
                        await Axios.get(Constant.serviceURL + '/logout');
                        MyStorage.dispatch({ type: "LOGOUT" });
                        alert("로그아웃 성공!");
                        window.location.href = "/";
                    }
                } catch (error) {
                    alert("로그아웃 실패!");
                    console.error(error);
                }
            },
        };

        const selectedAction = menuActions[menuKey];

        if (selectedAction) selectedAction();

    };
    async callGetMyInfoAPI() {
        try {
            const response = await Axios.get(Constant.serviceURL + `/mypage/${this.state.userId}`);
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];
            return dataArray[0]; // Return the first item in the array
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <div>Loading...</div>;
        }

        return (
            <>
                <Container className="component">
                    <Card className="text-center">
                        <Card.Body>
                            <Card.Title>{this.state.userContents.userName}님! 환영합니다.</Card.Title>
                            <Nav className="justify-content-end" >
                                {
                                    this.getMyPageStatus.map((status) =>
                                        <Nav.Item>
                                            <Nav.Link className="color-btn" onClick={() => this.handleMenuClick(status.value)}>{status.name}</Nav.Link>
                                        </Nav.Item>
                                    )
                                }
                            </Nav>
                        </Card.Body>
                    </Card>

                    {
                        this.state.nowSituation === 0 ? null : this.state.nowSituation === 1 ? <ReservedList /> : <Modify />
                    }

                </Container>

            </>

        );
    }
}