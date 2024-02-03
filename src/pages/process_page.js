import React,{Component} from "react";

import Template from "../templates/home";
import Develop from "../components/home/develop_process";

export default class ProcessPage extends Component{
   render(){
    return(
        <Template>
            <Develop />
        </Template>
    )
   }
}