import React,{Component} from "react";

import Template from "../templates/home";
import Mypage from "../components/mypage/mypage";

export default class MypagePage extends Component{
   render(){
    return(
        <Template>
            <Mypage/>
        </Template>
    )
   }
}