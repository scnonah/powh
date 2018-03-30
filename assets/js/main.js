var web3;
var isMetaMask = false;
var tokenContract = null;
var referedByAddr = '0xEc230b380D8Ba8059be2e77d29f5a12F9a8EB83b'; //if user does not have a masternode set, use ours as default
var contractAddr = '0xB3775fB83F7D12A36E0475aBdD1FCA35c091efBe';
var abi = [{ "constant": true, "inputs": [{ "name": "_customerAddress", "type": "address" }], "name": "dividendsOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_ethereumToSpend", "type": "uint256" }], "name": "calculateTokensReceived", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_tokensToSell", "type": "uint256" }], "name": "calculateEthereumReceived", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "onlyAmbassadors", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "bytes32" }], "name": "administrators", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "sellPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "stakingRequirement", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_includeReferralBonus", "type": "bool" }], "name": "myDividends", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalEthereumBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_customerAddress", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_amountOfTokens", "type": "uint256" }], "name": "setStakingRequirement", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "buyPrice", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_identifier", "type": "bytes32" }, { "name": "_status", "type": "bool" }], "name": "setAdministrator", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "myTokens", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "disableInitialStage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_toAddress", "type": "address" }, { "name": "_amountOfTokens", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_symbol", "type": "string" }], "name": "setSymbol", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "setName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_amountOfTokens", "type": "uint256" }], "name": "sell", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "exit", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_referredBy", "type": "address" }], "name": "buy", "outputs": [{ "name": "", "type": "uint256" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "reinvest", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "customerAddress", "type": "address" }, { "indexed": false, "name": "incomingEthereum", "type": "uint256" }, { "indexed": false, "name": "tokensMinted", "type": "uint256" }, { "indexed": true, "name": "referredBy", "type": "address" }], "name": "onTokenPurchase", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "customerAddress", "type": "address" }, { "indexed": false, "name": "tokensBurned", "type": "uint256" }, { "indexed": false, "name": "ethereumEarned", "type": "uint256" }], "name": "onTokenSell", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "customerAddress", "type": "address" }, { "indexed": false, "name": "ethereumReinvested", "type": "uint256" }, { "indexed": false, "name": "tokensMinted", "type": "uint256" }], "name": "onReinvestment", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "customerAddress", "type": "address" }, { "indexed": false, "name": "ethereumWithdrawn", "type": "uint256" }], "name": "onWithdraw", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "tokens", "type": "uint256" }], "name": "Transfer", "type": "event" }];


$(document).ready(function() {
    //init
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": true,
        // "onclick": function () {
        //     future use link to transaction on ethscan
        // },
        "showDuration": "9000",
        "hideDuration": "9000",
        "timeOut": "9000",
        "extendedTimeOut": "6666",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    if (typeof web3 !== 'undefined') {
        isMetaMask = web3.currentProvider.isMetaMask;
        tokenContract = web3.eth.contract(abi).at(contractAddr);
    }
    
    fnWatchers();
});


function fnWatchers() {
    // tokenContract.onReinvestment(function (error, result) {
    //     var invested = new BigNumber(result.args.ethereumReinvested);
    //     var minted = new BigNumber(result.args.tokensMinted);
    //     toastr.success('They reinvested dividends.');
    //     console.log('They reinvested dividends.');
    // });
    tokenContract.onTokenPurchase(function (error, result) {
        var inc = new BigNumber(result.args.incomingEthereum);
        var minted = new BigNumber(result.args.tokensMinted);
        toastr.success('Someone bought ' + minted.div(1e18).toFixed(6) + ' P3D for ' + inc.div(1e18).toFixed(6) + ' ETH');
        console.log('Someone bought ' + minted.div(1e18).toFixed(6) + ' P3D for ' + inc.div(1e18).toFixed(6) + ' ETH');
    });
    tokenContract.onTokenSell(function (error, result) {
        var burned = new BigNumber(result.args.tokensBurned);
        toastr.success('Someone sold ' + burned.div(1e18).toFixed(6) + ' P3D');
        console.log('Someone sold ' + burned.div(1e18).toFixed(6) + ' P3D');
    });
    tokenContract.onWithdraw(function (error, result) {
        var ethWith = new BigNumber(result.args.ethereumWithdrawn);
        toastr.success('Someone withdrew dividends: ' + ethWith.div(1e18).toFixed(6) + ' ETH.');
        console.log('Someone withdrew dividends: ' + ethWith.div(1e18).toFixed(6) + ' ETH.');
    });
}


$(document).on('click', '.span-theme-change', function() {
    $('#link-bootstrap').attr('href', '/assets/css/themes/' + $(this).data('folder') + '/bootstrap.min.css');
    localStorage.setItem('theme', $(this).data('folder'));
    document.getElementById('overlay').style.display = "inline";
    setTimeout(function() {
      $('#overlay').fadeOut();
    }, 500);
});

window.onload = function() {
    setTimeout(function() {
        $('#overlay').fadeOut();
    }, 500);
}
