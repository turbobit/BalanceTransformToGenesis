var fs = require('fs');

const jsonFile = fs.readFileSync('./Account.json', 'utf8');
const jsonData = JSON.parse(jsonFile.toString());
const Web3 = require('web3');


/**
 "alloc": {
    "c168062c9c958e01914c7e3885537541dbb9ed08": {
        "balance": "9190895.93630996"
    }
 }
 */

let balanceArrays = [];
let balanceArraysFalse = [];
for (const i in jsonData) {

    var balance = String(jsonData[i].balance);

    /*
    //6e-18 계정 제거
    //http://ethersocial.net/addr/0xa7f18783317c5534a33c9d7b5f2a235a73c2eea0  

    if(balance == '6e-18') continue;
    if(balance == '2.4e-17') continue;
    if(balance == '4e-18') continue;
    if(balance == '3e-18') continue;
    if(balance == '2e-17') continue;
    if(balance == '2e-18') continue;
    */
    //console.log(jsonData[i].balance, balance , jsonData[i].balance> 0);
    var balanceToWei;

    var isCorrect = false;


    //변환이 되는 수인지 체크
    try {
        balanceToWei = Web3.utils.toWei(balance, 'ether').toString();
        isCorrect = true;
    } catch (e) {
        isCorrect = false;
        console.log(jsonData[i].balance, balance, jsonData[i].balance >= 1);
    }

    //1e-18  === 0.000000000000000001
    //잔액이 얼마 이상 체크
    if (Number(jsonData[i].balance) < 1 ) isCorrect = false;

    //데이터 생성
    if (isCorrect) 
    {
        //[`"${Web3.utils.stripHexPrefix(jsonData[i].address)}"`]: balanceToWei
        let array = {
            [Web3.utils.stripHexPrefix(jsonData[i].address)]: balanceToWei

        };
        balanceArrays.push(array);

    } else {
        let array = {
            [Web3.utils.stripHexPrefix(jsonData[i].address)]: balance

        };
        balanceArraysFalse.push(array);
    }
}
let balanceArrayFormat = {
    "addloc": balanceArrays
};
//console.log(balanceArrayFormat)


//파일로 저장
var json1 = JSON.stringify(balanceArrays);
var json2 = JSON.stringify(balanceArraysFalse);

fs.writeFileSync('./AccountTrue.json', json1, 'utf8');
fs.writeFileSync('./AccountFalse.json', json2,'utf8');