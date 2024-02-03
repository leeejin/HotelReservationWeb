import React,{Component} from "react";

import Template from "../templates/home";
import MainPage from "../components/home/mainpage";

export default class MainpagePage extends Component{
   render(){
    return(
        <Template>
            <MainPage/>
        </Template>
    )
   }
}