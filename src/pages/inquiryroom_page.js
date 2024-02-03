import React,{Component} from "react";

import Template from "../templates/home";
import Inquiryroom from "../components/inquiryroom/inquiryroom";

export default class InquiryPage extends Component{
   render(){
    return(
        <Template>
            <Inquiryroom/>
        </Template>
    )
   }
}