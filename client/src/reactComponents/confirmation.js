import React, { Component } from 'react';
import './style.css';
class Confirmation extends Component {
    
        cancel=()=>{
            this.props.sellCall();
        }
        sell=()=>{
            console.log("sell from child compo")
            this.props.sellBidFun();
        }
        render(){
        
            return (this.props.showConfirmation? (<div id="myModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <span class="close">&times;</span>
                    <h3>Are you Sure?</h3>
                </div>
                <div class="modal-body">
                    <p>Do you want to Sell this Item to the Highest Bid?</p>
    
                </div>
                <div class="modal-footer">
                    <button class="btnSell" onClick={this.sell}>YES,SELL</button>
                    <button class="cancelbtn" onClick={this.cancel}>CANCEL</button>
                </div>
            </div>
    
        </div>):<div></div>)

        }
       
    }


export default Confirmation;