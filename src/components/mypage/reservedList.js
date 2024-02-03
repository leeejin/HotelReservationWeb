import { React, Component } from "react";
import { Form, Container, Card, Button } from 'react-bootstrap';
import Constant from "../../util/constant_variables";
import ModalCancel from "./modal_cancelroom";
import MyStorage from '../../util/store';
import Axios from "axios";
import dummy from "../../util/data";

export default class Reserved extends Component {
    constructor(props) {
        super(props);
        this.origin = [];
        this.state = {
            modalVisible: false,
            room: {},
            contents: [],
            userId: MyStorage.getState().userId
        }
    }

    componentDidMount() {
        this.callGetRoomMyListAPI().then((response) => {
            this.origin = response;
            this.setState({ contents: this.origin });
        })
    }

    modalListener = async (selectedRoom) => {
        this.setState({
            modalVisible: !this.state.modalVisible,
            room: selectedRoom
        });

    }
    async callGetRoomMyListAPI() {
        try {
            const response = await Axios.get(Constant.serviceURL + `/reservedlist/${this.state.userId}`);
            const dataArray = Array.isArray(response.data) ? response.data : [response.data];

            return dataArray;
        } catch (error) {
            console.error(error);
        }
    }


    render() {
        return (
            <>

                {
                    this.state.modalVisible && <ModalCancel modalListener={this.modalListener} room={this.state.room} />
                }

                <Card className="mt-3 p-3">
                    <Card.Body>
                        <h5 className="text-center">예약정보</h5>
                        {
                            this.state.contents.map((room, i) =>
                            
                                <ListItem room={room} key={i} modalListener={(room) => this.modalListener(room)} />
                            )
                        }
                    </Card.Body>

                </Card>
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
            <div className="list-item">
                <Card>
                    <Card.Img variant="top" src={room.roomImage} style={{ height: 200 }} />
                    <Card.Body>
                        <Card.Title>{room.roomName}</Card.Title>
                        <Card.Text className="content">{room.roomText}</Card.Text>
                        <button type="submit" className="btn color-btn" style={{ float: 'right' }} onClick={this.modalListener}>Cancel</button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}


