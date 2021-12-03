import React, { Component } from 'react';
import BidEther from './contracts/BidEther.json';
import Web3 from 'web3';
import './App.css'
import Status from './reactComponents/status';
import ShowLoader from './reactComponents/Loader';
import Confirmation from './reactComponents/confirmation';
class App extends Component {

  state={
    account:"",
    accountBalance:"",
    auctionItem:"",
    Bid:"",
    HighestBidder:"",
    yourBid:"",
    showConfirmation:false,
    result:false,
    showloader:false,
    statusOfItem:false
  }

  
  async componentDidMount(){

    await this.loadBlockchainData(this.props.dispatch);
  }
  async loadBlockchainData(dispatch){
    if(typeof window.ethereum!=='undefined'){
      const web3= new Web3(window.ethereum);
      window.ethereum.enable().catch(error => {
        // User denied account access
       console.log(error)
       alert("Please Login with Metamask.")
        })
     
        try{
          this.setState({
            showloader:true,
          })
          const netId= await web3.eth.net.getId();
          const accounts= await web3.eth.getAccounts();
          const accountBalance= await web3.eth.getBalance(accounts[0]);
          const etherAmount= web3.utils.fromWei(accountBalance,'ether');
            this.setState({
              account:accounts[0],
              accountBalance:etherAmount
            })

          const Bid= new web3.eth.Contract(BidEther.abi,BidEther.networks[netId].address)
          const auctionItem= await Bid.methods.auctionItemfun().call();
          const auctionerAddress=await Bid.methods.auctionerAdd().call();
          var HighestBidder= await Bid.methods.checkHighestAmount().call();
          var statusofItem=await Bid.methods.statusofItem().call();
          var HighestBidderEther=web3.utils.fromWei(HighestBidder,'ether');
          var yourBid=await Bid.methods.YourBid(this.state.account).call();
          yourBid=web3.utils.fromWei(yourBid,'ether')
          this.setState({
            Bid:Bid,
            auctionItem:auctionItem,
            auctionerAddress:auctionerAddress,
            HighestBidder:HighestBidderEther,
            yourBid:yourBid,
            showloader:false,
            statusOfItem:statusofItem,
          })
          console.log(auctionItem);
        }catch(e){
          window.alert("Contracts went wrong",e);
          console.log(e)

        }

    }else{
      alert("please install metamask");
    }

  }

  yourBid=async()=>{
    const web3= new Web3(window.ethereum);
    const netId= await web3.eth.net.getId();
    const Bid= new web3.eth.Contract(BidEther.abi,BidEther.networks[netId].address)
    var yourBid=await Bid.methods.YourBid(this.state.account).call();
          yourBid=web3.utils.fromWei(yourBid,'ether')
          console.log("your bid amount",yourBid)
          this.setState({
           yourBid:yourBid
          })
  }

  refresh=()=>{
    this.loadBlockchainData();
    this.yourBid(this.state.account);
  }
  sell=()=>{
    console.log("sell")
    this.setState({
      showConfirmation:!this.state.showConfirmation,
    })
  }

  sellBid=async()=>{
    console.log("hi SelleBId")
    this.sell();
    this.setState({
      showloader:true,
    })
    await this.state.Bid.methods.sellBid().send({from:this.state.account}).then(()=>{
      this.setState({
        showloader:false,
        statusOfItem:true,
      })
    });

  }

  checkHighestAmount=async()=>{
    const web3= new Web3(window.ethereum);
    const netId= await web3.eth.net.getId();
    const Bid= new web3.eth.Contract(BidEther.abi,BidEther.networks[netId].address)
    var HighestBidder= await Bid.methods.checkHighestAmount().call();
    var HighestBidderEther=web3.utils.fromWei(HighestBidder,'ether')
    this.setState({
      HighestBidder:HighestBidderEther,
    })
  }
  paymentSubmit=async()=>{
    try{

      var amount= document.getElementById("amountID").value;
      var amountInEther=amount*10**18;
      this.setState({
        showloader:true,
      })
      var highestAmount=await this.state.Bid.methods.Bid().send({value:amountInEther.toString(),from:this.state.account}).then(()=>{
        console.log("payment then blck")
        this.setState({
          showloader:false,
        })
      });
      console.log(highestAmount)
     this.checkHighestAmount();
     this.yourBid(this.state.account);
      document.getElementById("amountID").value="";
    }catch(e){
      alert("Some went wrong while transacting Please try again later.")
    }

  }
   withDraw=async ()=>{
   try{
    this.setState({
      showloader:true,
    })
   var withdraw= await this.state.Bid.methods.withDraw(this.state.account).send({from:this.state.account}).then(()=>{
    this.setState({
      showloader:false,
    })
  });
    console.log(withdraw);
    this.checkHighestAmount();
    this.yourBid(this.state.account);
    
   }catch(e){
     alert("withdraw cannot be Done");

   }
  }
  render() {
    console.log("inside render",this.state.showConfirmation)
    return (
      <div className="parent">
        <Confirmation showConfirmation={this.state.showConfirmation} sellCall={this.sell} sellBidFun={this.sellBid}></Confirmation>
        <ShowLoader showLoader={this.state.showloader}></ShowLoader>
        <h2>Welcome To Ethereum Auctions</h2>
        <table>
          <tbody>
          <tr>
            <td>Current Auction Item:</td>
            <td><div className="auctionItem">{this.state.auctionItem}<Status status={this.state.statusOfItem}></Status></div></td>
          </tr>
          <tr>
            <td>
            Auctioneer Address:
            </td>
            <td>
            {this.state.auctionerAddress}
            </td>
          </tr>
          <tr>
            <td>Highest Bidder amount : </td>
            <td>{this.state.HighestBidder===""? "NA": this.state.HighestBidder} Ether</td>
          </tr>
          <tr>
            <td>
            Current Account:
            </td>
            <td>
            {this.state.account}
            </td>
          </tr>
          <tr>
            <td>
            Balance:
            </td>
            <td>
            {this.state.accountBalance} Ethers
            </td>
          </tr>
          <tr>
            <td>Your Bid Amount: </td>
            <td>{this.state.yourBid===""? "Not Participated": this.state.yourBid} Ether</td>
          </tr>
          
          <tr>
            <td>Bidding Amount:</td>
            <td> <input className="biddingField" id="amountID" type="number" placeholder="Enter the Ether here"></input></td>
          </tr>
          </tbody>
        </table>


         <br></br>  
       
     
        <button className="refreshBtn" onClick={this.refresh}>Refresh</button>
       
        {this.state.statusOfItem===false&&this.state.account===this.state.auctionerAddress?<button className="sellBtn" onClick={this.sell}>Sell</button>:<></>}
       
        <button className="bidBtn" disabled={this.state.statusOfItem?true:false} onClick={this.paymentSubmit}>BID</button>
        <button  className="withdrawBtn" disabled={this.state.statusOfItem?true:false} onClick={this.withDraw}>WithDraw</button>

        
      </div>
    );
  }
}

export default App;