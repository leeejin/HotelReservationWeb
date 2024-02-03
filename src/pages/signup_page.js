import React,{Component} from "react";

import Template from "../templates/home";
import Signup from "../components/login/signup";

export default class SignupPage extends Component{
   render(){
    return(
        <Template>
            <Signup/>
        </Template>
    )
   }
}