import React,{Component} from "react";

import Template from "../templates/home";
import Login from "../components/login/login";

export default class LoginPage extends Component{
   render(){
    return(
        <Template>
            <Login/>
        </Template>
    )
   }
}