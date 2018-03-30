
var ui = {
    buypriceETH: document.getElementById('input-buy-price'),
    buyAmountP3D: document.getElementById('input-buy-amount'),
    buyTotalETH: document.getElementById('input-buy-total'),

    sellpriceETH: document.getElementById('input-sell-price'),
    sellAmountP3D: document.getElementById('input-sell-amount'),
    sellTotalETH: document.getElementById('input-sell-total'),

    balanceP3D: document.getElementById('span-balance-p3d'),
    noMetaMaskDetected: document.getElementById('div-alert'),
    masterNodeLink: document.getElementById('link-masternode'),
    dashTotalEth: document.getElementById('dash-total-eth'),
    dashCirculatingSupply: document.getElementById('dash-total-circulating'),
    dashWalletBalance: document.getElementById('dash-wallet-balance'),
    dashWalletDividends: document.getElementById('dash-wallet-dividends'),
    btnReinvest: document.getElementById('btn-reinvest'),
    btnWithdraw: document.getElementById('btn-withdraw')
}, addr;


$(document).ready(function () {
    refreshData();
    setTimeout(function () { refreshData(); }, 60000); //refresh data
    //reload page if user logs into
    var accountchanged = web3.eth.accounts[0];
    var accountInterval = setInterval(function () {
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
    ui.sellAmountP3D.value = Number($(this).text()).toFixed(6);
    ui.sellTotalETH.value = Number($(this).text() * ui.sellpriceETH.value).toFixed(6);
});

$(document).on('keyup', '#input-buy-total', function () {
    ui.buyAmountP3D.value = Number(ui.buyTotalETH.value / ui.buypriceETH.value).toFixed(6);
});

$(document).on('keyup', '#input-sell-amount', function () {
    ui.sellTotalETH.value = Number(ui.sellAmountP3D.value * ui.sellpriceETH.value).toFixed(6);
});

$(document).on('click', '#btn-buy', function () {
    var masternode = (localStorage.getItem("masternode") && web3.isAddress(localStorage.getItem("masternode")) ? localStorage.getItem("masternode") : referedByAddr);
    var input = ui.buyTotalETH.value;
    if (parseFloat(input)) {
        tokenContract.buy(masternode, { value: web3.toWei(input, "ether") }, function (error, result) {
            if (!error) {
                toastr.success('Transaction has been submitted to the blockchain.');
            }
            else {
                toastr.error('Transaction was cancelled by user.');
            }
        });
    }
    else {
        toastr.error('Please enter a valid number.');
    }
});

$(document).on('click', '#btn-sell', function () {
    if (confirm('Are you sure you want to sell?')) {
        var input = ui.sellAmountP3D.value;
        if (parseFloat(input)) {
            var serialized = web3.toBigNumber(input * 1e18)
            tokenContract.sell(serialized, function (error, result) {
                if (!error) {
                    toastr.success('Transaction has been submitted to the blockchain.');
                }
                else {
                    toastr.error('Transaction was cancelled by user.');
                }
            });
        }
        else {
            toastr.error('Please enter a valid number.');
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
        if (isMetaMask) {
            ui.noMetaMaskDetected.style.display = 'none';
            totalEthereumBalance();
            totalSupply();
            balanceOf();
            myDividends();
            sellPrice();
            buyPrice();

            $.ajax({
                url: "/includes/modules/previoustransactions/ajax/fetch_transactions.ajax.php",
                data: { addr: web3.eth.accounts[0] },
                success: function (result) {
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
            ui.sellAmountP3D.value = Number(p3dBal).toFixed(6);
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
            if (allDivs < 0.0001) {
                ui.btnReinvest.style.display = "none";
                ui.btnWithdraw.style.display = "none";
            }
            ui.dashWalletDividends.innerHTML = Number(allDivs).toFixed(8) + " ETH";
        }
        else {
            ui.dashWalletDividends.innerHTML = error;
        }
    });
}


function sellPrice() {
    tokenContract.sellPrice(function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            var sellP = web3.fromWei(tokens, 'ether');
            ui.sellpriceETH.value = Number(sellP).toFixed(6);
            setTimeout(function () { //have to wait for buy price to be set to calculate
                ui.sellTotalETH.value = Number(ui.sellpriceETH.value * ui.sellAmountP3D.value).toFixed(6);
            }, 200);
        }
        else {
            ui.sellpriceETH.value = error;
        }
    });
}

function buyPrice() {
    tokenContract.buyPrice(function (error, result) {
        if (!error) {
            var tokens = web3.toDecimal(result).toString();
            buyP = web3.fromWei(tokens, 'ether');
            ui.buypriceETH.value = Number(buyP).toFixed(6);
            ui.buyTotalETH.value = Number(1).toFixed(6);
            setTimeout(function () { //have to wait for buy price to be set to calculate
                ui.buyAmountP3D.value = Number(ui.buyTotalETH.value / ui.buypriceETH.value).toFixed(6);
            }, 200);
        }
        else {
            ui.buypriceETH.value = error;
        }
    });
}

function reinvest() {
    if (!isMetaMask) {
        toastr.error("Please Install Metamask!");
        return;
    }
    else {
        tokenContract.reinvest(function (error, result) {
            if (!error) {
                toastr.success("Transaction have been submitted to the blockchain!");
            }
            else {
                toastr.error('Transaction was cancelled by user.');
            }
        });
    }
}

function withdraw() {
    if (!isMetaMask) {
        toastr.error("Please Install Metamask!");
        return false;
    }
    else {
        tokenContract.withdraw(function (error, result) {
            if (!error) {
                toastr.success("Transaction have been submitted to the blockchain!");
            }
            else {
                toastr.error('Transaction was cancelled by user.');
            }
        });
    }
}