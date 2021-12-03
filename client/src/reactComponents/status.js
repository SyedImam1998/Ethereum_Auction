import React, { Component } from 'react';
import './style.css';
class status extends Component {

    render() {
        console.log(this.props.status)
        return (
            <div class="parent1" style={{background:this.props.status?"red":"green"}}>
                <div class="circle">
                </div>
                <div class="text">
                   {this.props.status?"Sold":"Available"}
                </div>


            </div>
        );
    }
}

export default status;