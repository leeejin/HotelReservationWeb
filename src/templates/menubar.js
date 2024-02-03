import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';
import Constant from "../util/constant_variables";
import logo from "../components/images/logo.png";
import Axios from "axios";
import MyStorage from "../util/store";

export default class Menubar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectList: Constant.getSideMenus(),
        }
    }


    componentDidMount() {
        const updatedSelectList = this.state.selectList.filter(menu => {
            if (MyStorage.getState().mode === true) {
                return menu.key === 0 || menu.key === 3 || menu.key === 4;
            } else {
                return menu.key === 0 || menu.key === 1 || menu.key === 3;
            }
        });

        this.setState({ selectList: updatedSelectList });
    }
    render() {

        return (
            <Navbar expand="lg" style={{ background: 'white' }}>
                <Container>
                    <Navbar.Brand href="/"><img src={logo} width={50} alt="Logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                        <Nav>
                            {this.state.selectList.map((menu) => (
                                <NavLink
                                    key={menu.key}
                                    to={menu.href}
                                    className="nav-link" >
                                    {menu.name}
                                </NavLink>
                            ))}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}