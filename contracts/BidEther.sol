pragma solidity >= 0.6.0 < 0.9.0;

contract BidEther{
    mapping(address=>uint) public bidders;
    address public  auctioner;
    string public auctionItem;
    uint public highestBidAmount;
    mapping(address=>bool) public bidderAccountFlag;
    
    address[] public bidderAccounts;

    bool public statusOfItem=false;
    constructor(){
        auctioner=msg.sender;
        auctionItem="Kunal's DSA Course";
    }
    function statusofItem() public view returns(bool){
        return statusOfItem;
    
    }
    modifier onlyowner(){
      require(msg.sender==auctioner,"Only Auctioneer can Sell this Item");
      _;
    }
    
    function sellBid()public onlyowner {
         uint  HA=0;
         address Bidder;
         for(uint i=0;i<bidderAccounts.length;i++){
             if(HA<bidders[bidderAccounts[i]]){
                 HA=bidders[bidderAccounts[i]];
                 Bidder=bidderAccounts[i];
             }
         }
        //  msg.sender.transfer(bidders[Bidder]);
        if(HA>0){
        //  payable(auctioner).transfer(bidders[Bidder]);
        //  payable(auctioner).call{2 ether};
        // payable(auctioner).call.value(bidders[Bidder]);
        (bool sent,) = auctioner.call{value:bidders[Bidder]}("");
        require(sent, "Failed to send Ether");
        // payable(auctioner).call{value: bidders[Bidder] };
        // msg.sender.call.value(_amount)("");
         bidders[Bidder]=0;
          statusOfItem=true;
        }


       
    }
    function Bid() public payable{
        if(bidderAccountFlag[msg.sender]==true){
            bidders[msg.sender]=bidders[msg.sender]+msg.value;
        }else{
            bidderAccountFlag[msg.sender]=true;
            bidders[msg.sender]=msg.value;
            bidderAccounts.push(msg.sender);
        }
        
     }
     
     function auctionerAdd() public view returns(address){
         return auctioner;
     }
     
     function YourBid(address receiverAdd) view public returns(uint){
         return bidders[receiverAdd]; 
     }
     
     function auctionItemfun() public view returns(string memory){
         return auctionItem;
     }
     
     function checkHighestAmount()public view returns(uint) {
         uint  HA=0;
         for(uint i=0;i<bidderAccounts.length;i++){
             if(HA<bidders[bidderAccounts[i]]){
                 HA=bidders[bidderAccounts[i]];
             }
         }
         return HA;
         }
         
         function withDraw(address payable receiver)public{
            require(bidders[msg.sender]>0, "You have not participated in Auction ");
            // payable(msg.sender).transfer(bidders[msg.sender]);
             (bool sent,) = receiver.call{value:bidders[receiver]}("");
             require(sent, "Failed to send Ether");
            bidders[msg.sender]=0;
         }    
         
}