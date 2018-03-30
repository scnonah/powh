
var ui = {
  transferToAddr : document.getElementById('input-transfer-to-address'),
  transferAmount : document.getElementById('input-transfer-amount'),
  balanceP3D: document.getElementById('span-balance-p3d'),
  noMetaMaskDetected: document.getElementById('div-alert'),
  masterNodeLink: document.getElementById('link-masternode'),
  dashTotalEth: document.getElementById('dash-total-eth'),
  dashCirculatingSupply: document.getElementById('dash-total-circulating'),
  dashWalletBalance: document.getElementById('dash-wallet-balance'),
  dashWalletDividends: document.getElementById('dash-wallet-dividends')
}, addr;


$(document).ready(function () {
    refreshData();
    setTimeout(function () { refreshData(); }, 60000); //refresh data
    //reload page if user logs into metamask
    var accountchanged = web3.eth.accounts[0];
    var accountInterval = setInterval(function() {
        if (web3.eth.accounts[0] !== accountchanged) {
            accountchanged = web3.eth.accounts[0];
            refreshData();
            //check logged out
            if (typeof web3.eth.accounts[0] === 'undefined') {
                window.location.reload();
            }
        }
    }, 100);

    //run these whether theyre signed in or not
    totalEthereumBalance();
    totalSupply();
});


$(document).on('click', '#span-balance-p3d', function () {
    ui.transferAmount.value = Number($(this).text()).toFixed(6);
});


$(document).on('click', '#btn-transfer', function () {
    if (confirm('Are you sure you want to transfer?')) {
        var toAddr = ui.transferToAddr.value;
        var amount = ui.transferAmount.value;
        if (parseFloat(amount) && web3.isAddress(toAddr)) {
            var serialized = web3.toBigNumber(amount * 1e18)
            tokenContract.transfer(toAddr, serialized, function (error, result) {
                if (!error) {
                    toastr.success('Transaction has been submitted to the blockchain.');
                }
                else {
                    toastr.error('Transaction was cancelled by user.');
                }
            });
        }
        else {
            toastr.error('Please type a valid number and address.');
        }
    }
});



function refreshData() {
    if (typeof web3.eth.accounts[0] != 'undefined') {
        addr = web3.eth.accounts[0];
        //rebuild masternode in case they login to another account
        ui.masterNodeLink.href = "/?masternode=" + web3.eth.accounts[0];
        ui.masterNodeLink.innerHTML = "http://powh.xyz/?masternode=" + web3.eth.accounts[0];
        console.log('MetaMask Account: ' + web3.eth.accounts[0]);
        if(isMetaMask){
            ui.noMetaMaskDetected.style.display = 'none';
            totalEthereumBalance();
            totalSupply();
            balanceOf();
            myDividends();

            $.ajax({
                url: "/includes/modules/previoustransactions/ajax/fetch_transactions.ajax.php", 
                data : { addr:web3.eth.accounts[0] },
                success: function(result){
                //$("#div1").html(result);
                $('html').append(result);
                }
            });
        }
    }
}


function totalEthereumBalance() {
    tokenContract.totalEthereumBalance(function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            var ethB = web3.fromWei(tokens, 'ether');
            ui.dashTotalEth.innerHTML = Number(ethB).toFixed(2) + " ETH";
        }
        else {
            ui.dashTotalEth.innerHTML = error;
        }
    });
}
function totalSupply() {
    tokenContract.totalSupply(function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            var supplyB = web3.fromWei(tokens, 'ether');
            ui.dashCirculatingSupply.innerHTML = Number(supplyB).toFixed(2) + " P3D";
        }
        else {
            ui.dashCirculatingSupply.innerHTML = error;
        }
    });
}
function balanceOf() {
    tokenContract.balanceOf(addr, function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            var p3dBal = web3.fromWei(tokens, 'ether');
            ui.balanceP3D.innerHTML = Number(p3dBal).toFixed(6); //p3d
            ui.dashWalletBalance.innerHTML = Number(p3dBal).toFixed(6) + " P3D";
        }
        else {
            ui.balanceP3D.html = error;
        }
    });
}
function myDividends() {
    tokenContract.myDividends(true, function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            var allDivs = web3.fromWei(tokens, 'ether');
            ui.dashWalletDividends.innerHTML = Number(allDivs).toFixed(8) + " ETH";
        }
        else {
            ui.dashWalletDividends.innerHTML = error;
        }
    });
}

