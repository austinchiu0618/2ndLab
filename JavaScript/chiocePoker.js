window.onload = () => {
    $(".chips").hide();
    $(".chipFont").hide();
    $("#exchangBox").hide();
    $(".rasieBox").hide();
    $("#whoWinBox").hide();
    // $("#finishImg").hide();
    $('.FinshBack').hide();
    rasieCheck.disabled = true;
    rasieCheck.style.cursor = 'not-allowed';
    upBtn.disabled = true;
    upBtn.style.cursor = 'not-allowed';
    downBtn.disabled = true;
    downBtn.style.cursor = 'not-allowed';
    rasieGiveup.disabled = true;
    rasieGiveup.style.cursor = 'not-allowed';
}

// 判斷登入
var userInfo = ''
$("#navLink").ready(function () {
    $.ajax({
        type: "GET",
        url: "/00_LAB/API/home/userInfo",
        dataType: "json",
        error: err => {
            // console.log(err["responseText"])
        },
    }).then(function (e) {
        userInfo = e
        $("#userName").html(`${userInfo['userName']}`)
        $("#userMoney").html(`${userInfo['gameMoney']}`)
        TitleMoney = `${userInfo['gameMoney']}`
        if (TitleMoney <= 0) {
            startBtn.disabled = true;
            startBtn.style.cursor = 'not-allowed';
        }
    })

});

// 改變玩家虛擬幣
function changeMoney() {
    var minusUserMoney = {
        userName: `${userInfo['userName']}`,
        gameMoney: `${TitleMoney}`,
    };
    $.ajax({
        type: "POST",
        url: "/00_LAB/API/game/changeMoney",
        data: minusUserMoney
    }).then(function (e) {
        $("#userMoney").text(e);
    });
}

// 手牌
var pokerCardArr = [];
var compHandCardArr = [];
var playerHandCardArr = [];

var computerHandCard_JS = document.getElementById('computerHandCard');
var playerHandCard_JS = document.getElementById('playerHandCard');

var compImgFrontJs = document.getElementsByClassName('compImgFront');
var playerImgFrontJs = document.getElementsByClassName('playerImgFront');

// 手牌分數
var compScore = '';
var playScore = '';

// 棄棄牌
var activeJS = document.getElementsByClassName('active')
var activeArr = []
var compDisArr = []

// 籌碼與錢
var compTitChip = Math.floor(Math.random() * 30 + 10)
var compChip = 1
var playerChip = 1
var raiseMoney = 0
var TitleMoney = 0


var isCompGiveup = false
var isPlayerGiveup = false
var isBigWin = false
var isSmallWin = false

// 遊戲開始
$("#startBtn").click(function () {
    // 產生放牌的div,產生52張牌,從52張發到手上
    TitleMoney = TitleMoney - 100
    changeMoney()
    $(".chips").slideDown('slow'); $(".chipFont").fadeIn(3000)
    compChipNumber.innerText = compChip
    playerChipNumber.innerText = playerChip

    cardToHand('compCard', computerHandCard_JS, 'compImgFront');
    cardToHand('playerCard', playerHandCard_JS, 'playerImgFront');
    poker52card()
    dealCard(compHandCardArr, compImgFrontJs);
    dealCard(playerHandCardArr, playerImgFrontJs);
    openShow()
    setTimeout(() => {
        $("#exchangBox").slideDown('slow'); choiceGiveupCard();
        $("#message").text("You Can change Cards")
        StraightFlush(playerHandCardArr)
        StraightFlush(compHandCardArr)
        showCardPoint()
        $('.playerCard').css(
            'cursor', "pointer"
        );
    }, 3500)
    startBtn.disabled = true;
    startBtn.style.cursor = 'not-allowed';

});

// 換牌
let playerChangeCard = false;
$("#exchangeYES").click(function () {
    playerChangeCard = true;
    $("#playrerCardType").text("")
    $("#message").text("")
    if (activeJS.length > 0) {
        $("#exchangBox").hide()
        $('.playerCard').css(
            'cursor', "default"
        );
        playerDiscard()
        compDiscard()
        disAni()
        setTimeout(() => {
            computerHandCard_JS.innerHTML = ''
            playerHandCard_JS.innerHTML = ''
            cardToHand('compCard', computerHandCard_JS, 'compImgFront');
            cardToHand('playerCard', playerHandCard_JS, 'playerImgFront');
            dealCard(compHandCardArr, compImgFrontJs);
            dealCard(playerHandCardArr, playerImgFrontJs)
            openShow()
            setTimeout(() => {
                whoFirstRaise()
            }, 2000);
        }, 7500);
    } else {
        $("#message").text("Please Chioce Card")
    }
});


// 不換牌
$("#exchangeNO").click(function () {

    $("#message").text("")
    $("#exchangBox").hide();
    $('.playerCard').css(
        'cursor', "default"
    );
    playerDiscard()
    compDiscard()
    disAni()
    setTimeout(() => {
        computerHandCard_JS.innerHTML = ''
        playerHandCard_JS.innerHTML = ''
        cardToHand('compCard', computerHandCard_JS, 'compImgFront');
        cardToHand('playerCard', playerHandCard_JS, 'playerImgFront');
        dealCard(compHandCardArr, compImgFrontJs);
        dealCard(playerHandCardArr, playerImgFrontJs)
        openShow()
        // $(".rasieBox").fadeIn();
        setTimeout(() => {
            // console.log(compHandCardArr)
            whoFirstRaise()
        }, 2000);
    }, 7500);

})

// 下注
$("#upBtn").click(() => {
    if (TitleMoney >= 100) {
        raiseMoney += 100;
        TitleMoney -= 100;
    }
    racerMoney.innerText = raiseMoney;
})

$("#downBtn").click(() => {
    if (raiseMoney >= 100) {
        raiseMoney -= 100;
        TitleMoney += 100;
    }
    racerMoney.innerText = raiseMoney;
})

$("#rasieCheck").click(() => {
    let temp = playerChip + (raiseMoney / 100);
    if (temp > compChip) {
        $("#message").text("")
        rasieCheck.disabled = true;
        rasieCheck.style.cursor = 'not-allowed';
        upBtn.disabled = true;
        upBtn.style.cursor = 'not-allowed';
        downBtn.disabled = true;
        downBtn.style.cursor = 'not-allowed';
        rasieGiveup.disabled = true;
        rasieGiveup.style.cursor = 'not-allowed';
        let i = raiseMoney / 100
        playerChip = temp;
        playerChipNumber.innerText = playerChip;
        raiseMoney = 0;
        racerMoney.innerText = 0;
        changeMoney()
        setTimeout(() => {
            compThinking();
        }, 1000);
    } else {
        $("#message").text("Please Rasie Chip")
    }
})

//放棄下注
$("#rasieGiveup").click(() => {
    $("#message").text(" ")
    $(".rasieBox").hide();
    isPlayerGiveup = true
    setTimeout(() => {
        compThinking()
    }, 1000);
})

// 選擇比大比小
$("#whoBig").click(function () {
    isBigWin = true;
    $("#message").text("強い順")
    whoWin();
})
$("#whoSmall").click(function () {
    isSmallWin = true;
    $("#message").text("弱い順")
    whoWin();
})

$('.FinshBack').click(function () {
    $('.FinshBack').hide()
    location.reload();
})
// ==============================================================
// 產生5張牌
function cardToHand(cardCName, cardWhere, cardImgName) {
    for (let index = 0; index < 5; index++) {
        var cardJS = document.createElement('div')
        var cardFrontJs = document.createElement('div')
        var imgFrontJs = document.createElement('img')
        var cardBackJs = document.createElement('div')
        var imgBackJs = document.createElement('img')
        cardJS.className = cardCName
        cardFrontJs.className = 'cardFront'
        cardBackJs.className = 'cardBack'
        imgFrontJs.className = cardImgName
        imgBackJs.setAttribute('src', './image/choicePoker/back.png')
        cardFrontJs.appendChild(imgFrontJs)
        cardBackJs.appendChild(imgBackJs)
        cardJS.appendChild(cardFrontJs)
        cardJS.appendChild(cardBackJs)
        cardWhere.appendChild(cardJS)
    }
}
// 產生撲克陣列
function poker52card() {
    for (let index = 0; index < 4; index++) {
        pokerCardArr[index] = `${index + 1}`;
    }
    var x = ""
    for (let j = 0; j < 4; j++) {
        pokerCardArr[j] = [];
        for (let i = 0; i < 13; i++) {
            if (i < 8) {
                pokerCardArr[j][i] = `0${i + 2}${j}`;
            } else {
                pokerCardArr[j][i] = `${i + 2}${j}`;
            }
        }
    };
}
// 從撲克陣列抽五張
function dealCard(handArr, ImgFront) {
    let temp = handArr.length
    for (let index = 0; index < (5 - temp); index++) {
        let rx = Math.floor(Math.random() * (pokerCardArr.length));
        let ry = Math.floor(Math.random() * (pokerCardArr[rx].length));
        let putArr = pokerCardArr[rx][ry]
        handArr.push(putArr)
        pokerCardArr[rx].splice(ry, 1,)
        pokerCardArr[rx].length == 0 ? pokerCardArr.splice(rx, 1,) : '';
    }
    handArr.sort()
    for (let index = 0; index < playerImgFrontJs.length; index++) {
        ImgFront[index].setAttribute('src', `./image/choicePoker/pokerCard/${handArr[index]}.png`);
    }
}

// 選擇棄牌
function choiceGiveupCard() {
    for (let changeIndex of playerImgFrontJs) {
        changeIndex.addEventListener('click', () => {
            changeIndex.classList.toggle("active")
        })
    }
}

// 重新抽牌
// function REdealCard(handArr, ImgFront) {
//     let temp = handArr.length
//     for (let index = 0; index < (5 - temp); index++) {
//         let rx = Math.floor(Math.random() * (pokerCardArr.length));
//         let ry = Math.floor(Math.random() * (pokerCardArr[rx].length));
//         let putArr = pokerCardArr[rx][ry]
//         handArr.push(putArr)
//         pokerCardArr[rx].splice(ry, 1,)
//         pokerCardArr[rx].length == 0 ? pokerCardArr.splice(rx, 1,) : '';
//     }
//     handArr.sort()
//     for (let index = 0; index < playerImgFrontJs.length; index++) {
//         ImgFront[index].setAttribute('src', `./image/choicePoker/pokerCard/${handArr[index]}.png`);
//     }
// }


// 手牌展開動畫
var compCardJS = document.getElementsByClassName('compCard')
var playerCardJS = document.getElementsByClassName('playerCard')

function getCardAni(whoGetCardAni) {
    whoGetCardAni[0].style.transform = 'translateX(80px) translateY(23px) rotateZ(-20deg)'
    whoGetCardAni[1].style.transform = 'translateX(40px) translateY(-5px) rotateZ(-10deg)'
    whoGetCardAni[2].style.transform = 'translateY(-15px)'
    whoGetCardAni[3].style.transform = 'translateX(-40px) translateY(-5px) rotateZ(10deg)'
    whoGetCardAni[4].style.transform = 'translateX(-80px) translateY(23px) rotateZ(20deg)'
}

function disCardAni(whoGetCardAni) {
    whoGetCardAni[0].style.transform = 'translateX(240px)'
    whoGetCardAni[1].style.transform = 'translateX(120px)'
    whoGetCardAni[2].style.transform = 'translateX(0px)'
    whoGetCardAni[3].style.transform = 'translateX(-120px)'
    whoGetCardAni[4].style.transform = 'translateX(-240px)'
}

function playerdisCardAni() {
    playerCardJS[0].style.transform = 'translateX(240px) rotateY(180deg)'
    playerCardJS[1].style.transform = 'translateX(120px) rotateY(180deg)'
    playerCardJS[2].style.transform = 'translateX(0px) rotateY(180deg)'
    playerCardJS[3].style.transform = 'translateX(-120px) rotateY(180deg)'
    playerCardJS[4].style.transform = 'translateX(-240px) rotateY(180deg)'
    setTimeout(() => {
        playerCardJS[0].style.transform = 'translateX(240px)'
        playerCardJS[1].style.transform = 'translateX(120px)'
        playerCardJS[2].style.transform = 'translateX(0px)'
        playerCardJS[3].style.transform = 'translateX(-120px)'
        playerCardJS[4].style.transform = 'translateX(-240px)'
    }, 2000)
}

function openCardAni(whoOpenCardAni) {
    whoOpenCardAni[0].style.transform += ' rotateY(180deg)'
    whoOpenCardAni[1].style.transform += ' rotateY(180deg)'
    whoOpenCardAni[2].style.transform += ' rotateY(180deg)'
    whoOpenCardAni[3].style.transform += ' rotateY(180deg)'
    whoOpenCardAni[4].style.transform += ' rotateY(180deg)'
    console.log(whoOpenCardAni[0].style.transform);
}

function openShow() {
    // 要時間間隔 是因為還沒有div
    setTimeout(() => {
        //展開牌
        getCardAni(compCardJS);
        getCardAni(playerCardJS);
        //開啟棄牌選擇
        //翻牌
        setTimeout(() => {
            openCardAni(playerCardJS)
        }, 1500);
    }, 500)
}

// 玩家換牌
function playerDiscard() {
    if (playerChangeCard) {
        for (let index = 0; index < activeJS.length; index++) {
            let temp = activeJS[index].src
            activeArr[index] = temp.substr(-7, 3)
        }
        for (let i = 0; i < activeArr.length; i++) {
            for (let j = 0; j < playerHandCardArr.length; j++) {
                if (activeArr[i] == playerHandCardArr[j]) {
                    playerHandCardArr.splice(j, 1)
                }
            }
        }
    }
}

// 電腦拋棄手牌
function compDiscard() {
    var comp = parseInt(compScore)
    let probability = Math.floor(Math.random() * 100 + 1);
    // 如果拿到鐵支
    if (isfourCase01 == true && comp > 15000000 && comp < 15000000) {
        console.log("four")
        if (probability < 95) {
            compDisArr.push(compHandCardArr[0])
            compHandCardArr.splice(0, 1,)
        }
    }
    if (isfourCase02 == true && comp > 15000000 && comp < 150000000) {
        console.log("four")
        if (probability < 95) {
            compDisArr.push(compHandCardArr[4])
            compHandCardArr.splice(4, 1,)
        }
    }
    // 如果拿到三條
    if (isThreeCase01 == true && comp > 15000 && comp < 150000) {
        console.log("three")
        if (probability < 50) {
            compDisArr.push(compHandCardArr[0])
            compHandCardArr.splice(0, 1)
        } else {
            for (let index = 0; index < 2; index++) {
                compDisArr.push(compHandCardArr[0])
                compHandCardArr.splice(0, 1)
            }
        }
    }
    if (isThreeCase02 == true && comp > 15000 && comp < 150000) {
        console.log("three")
        if (probability < 50) {
            compDisArr.push(compHandCardArr[0])
            compHandCardArr.splice(0, 1)
        } else {
            compDisArr.push(compHandCardArr[4])
            compHandCardArr.splice(4, 1)
            compDisArr.push(compHandCardArr[0])
            compHandCardArr.splice(0, 1)
        }
    }
    if (isThreeCase03 == true && comp > 15000 && comp < 150000) {
        console.log("three")
        if (probability < 50) {
            compDisArr.push(compHandCardArr[3])
            compHandCardArr.splice(3, 1)
        } else {
            compDisArr.push(compHandCardArr[4])
            compHandCardArr.splice(4, 1)
            compDisArr.push(compHandCardArr[3])
            compHandCardArr.splice(3, 1)
        }
    }

    // 如果拿到兩對
    if (isTwoCase01 == true && comp > 1500 && comp < 15000) {
        console.log("two")
        if (probability < 95) {
            compDisArr.push(compHandCardArr[4])
            compHandCardArr.splice(4, 1)
        }
    }
    if (isTwoCase02 == true && comp > 1500 && comp < 15000) {
        console.log("two")
        if (probability < 95) {
            compDisArr.push(compHandCardArr[0])
            compHandCardArr.splice(0, 1)
        }
    }
    if (isTwoCase03 == true && comp > 1500 && comp < 15000) {
        console.log("two")
        if (probability < 95) {
            compDisArr.push(compHandCardArr[2])
            compHandCardArr.splice(2, 1)
        }
    }

    // 1對
    if (isOnePair = true && comp > 150 && comp < 1500) {
        console.log("one")
        compDisArr.push(compHandCardArr[2])
        compHandCardArr.splice(2, 1)
        compDisArr.push(compHandCardArr[0])
        compHandCardArr.splice(0, 1)
    }

    // 單張
    if (comp < 150) {
        console.log("high")
        let temp = Math.floor(Math.random() * 3 + 1)
        for (let index = 0; index < temp; index++) {
            compDisArr.push(compHandCardArr[compHandCardArr.length - 1])
            compHandCardArr.pop()
        }
    }
    for (let index = 0; index < compDisArr.length; index++) {
        $("#computerDisard").append(`<img src="./image/choicePoker/pokerCard/${compDisArr[index]}.png">`);
    }
}

// 拋棄手牌動畫
function disAni() {
    if (playerChangeCard) {
        for (let disc of activeJS) {
            disc.style.transition = '2s';
            disc.style.transform = 'translateY(-50px)';
        }
    }
    computerDisard.style.transform = 'translateY(0px)';
    computerDisard.style.opacity = 1;
    setTimeout(() => {
        if (playerChangeCard) {
            for (let disc of activeJS) {
                disc.style.opacity = 0;;
            }
        }
        computerDisard.style.transform = 'translateY(50px)';
        computerDisard.style.opacity = 0;
        setTimeout(() => {
            disCardAni(compCardJS);
            playerdisCardAni();
            setTimeout(() => {
                disCardAni(playerCardJS);
            }, 2000);
        }, 2000);
    }, 1500);
}


function whoFirstRaise() {
    let probability = Math.floor(Math.random() * 100 + 1);
    StraightFlush(playerHandCardArr)
    StraightFlush(compHandCardArr)
    showCardPoint()
    // 玩家先
    if (probability < 50) {
        $("#message").text("You First Rasie")
        setTimeout(() => {
            $("#message").text("Please Rasie Chip")
            $(".rasieBox").fadeIn();
            rasieCheck.disabled = false;
            rasieCheck.style.cursor = 'pointer';
            upBtn.disabled = false;
            upBtn.style.cursor = 'pointer';
            downBtn.disabled = false;
            downBtn.style.cursor = 'pointer';
            rasieGiveup.disabled = false;
            rasieGiveup.style.cursor = 'pointer';
            StraightFlush(playerHandCardArr);
            StraightFlush(compHandCardArr);
            showCardPoint();
            // console.log(playScore)
            // console.log(compScore)
        }, 1500)
    } else {
        $("#message").text("Computer First Rasie")
        $(".rasieBox").fadeIn()
        StraightFlush(playerHandCardArr);
        StraightFlush(compHandCardArr);
        showCardPoint();
        setTimeout(() => {
            compThinking()
            isFirst = false
        }, 1500);
    }
}

// 電腦判斷
var isFirst = true
var parCompScore = parseInt(compScore)
function compThinking() {
    parCompScore = parseInt(compScore)
    let chipX = playerChip - compChip
    let probability = Math.floor(Math.random() * 100 + 1);
    if (isPlayerGiveup == false) {
        // 第一次加注
        if (isFirst == true) {
            if (parCompScore > 1600) {
                randomRaise(4);
                isFirst = false;
            }
            if (parCompScore > 160 && parCompScore < 1600) {
                randomRaise(3);
                isFirst = false;
            }
            if (parCompScore < 160) {
                randomRaise(4);
                isFirst = false;
            }
        } else {
            // 第二次加注
            if (parCompScore > 1600) {
                // console.log('big')
                randomRaise(8);
            }
            if (parCompScore > 160 && parCompScore < 1600) {
                if (parCompScore >= 1100) {
                    // console.log('2L')

                    if (chipX < 11) {
                        if (probability < 80) {
                            randomRaise(6);
                        } else {
                            compGiveup()
                        }
                    } else {
                        if (probability < 70) {
                            randomRaise(10);
                        } else {
                            compGiveup()
                        }
                    }

                }
                if (parCompScore >= 700) {
                    // console.log('2M')

                    if (chipX < 9) {
                        if (probability < 67) {
                            randomRaise(5);
                        } else {
                            compGiveup()
                        }
                    } else {
                        if (probability < 40) {
                            randomRaise(10);
                        } else {
                            compGiveup()
                        }
                    }

                } else {
                    // console.log('2S')

                    if (chipX < 7) {
                        if (probability < 55) {
                            randomRaise(5);
                        } else {
                            compGiveup()
                        }
                    } else {
                        if (probability < 10) {
                            randomRaise(10);
                        } else {
                            compGiveup()
                        }
                    }
                }
            }
            if (parCompScore < 160) {
                if (parCompScore >= 110) {
                    // console.log('L')
                    if (chipX < 9) {
                        if (probability < 67) {
                            randomRaise(4);
                        } else {
                            compGiveup()
                        }
                    } else {
                        if (probability < 40) {
                            randomRaise(10);
                        } else {
                            compGiveup()
                        }
                    }
                }
                if (parCompScore >= 80) {
                    // console.log('M')
                    if (chipX < 11) {
                        if (probability < 80) {
                            randomRaise(6);
                        } else {
                            compGiveup()
                        }
                    } else {
                        if (probability < 70) {
                            randomRaise(10);
                        } else {
                            compGiveup()
                        }
                    }
                } else {
                    // console.log('S')
                    randomRaise(6);
                }
            }
        }
    }
    // randomRaise(2);
    // console.log("question")

    //決定勝負
    if (isPlayerGiveup == true) {
        if (parCompScore > 1600) {
            compChioceBiG();
        }
        if (parCompScore > 160 && parCompScore < 1600) {
            if (parCompScore >= 1100) {
                if (probability < 85) {
                    compChioceBiG();
                } else {
                    compChioceSmall();
                }
            }
            if (parCompScore >= 700) {
                if (probability < 70) {
                    compChioceBiG();
                } else {
                    compChioceSmall();
                }
            } else {
                if (probability < 50) {
                    compChioceBiG();
                } else {
                    compChioceSmall();
                }
            }
        }
        if (parCompScore < 160) {
            if (parCompScore >= 110) {
                if (probability < 70) {
                    compChioceSmall();
                } else {
                    compChioceBiG();
                }
            }
            if (parCompScore >= 70) {
                if (probability < 85) {
                    compChioceSmall();
                } else {
                    compChioceBiG();
                }
            } else {
                compChioceBiG();
            }
        }
    }
}

function randomRaise(manyRaise) {
    let j = Math.floor(Math.random() * manyRaise + 2);
    let i = (playerChip - compChip) + j
    if (compTitChip >= i) {
        compTitChip -= i
        $("#message").text(`Computer Raise ${j}枚`)
        compChip = compChip + i
        compChipNumber.innerText = compChip;
        setTimeout(() => {
            $("#message").text(`YourTurn (more than ${compChip - playerChip}枚)`)
            rasieCheck.disabled = false;
            rasieCheck.style.cursor = 'pointer';
            upBtn.disabled = false;
            upBtn.style.cursor = 'pointer';
            downBtn.disabled = false;
            downBtn.style.cursor = 'pointer';
            rasieGiveup.disabled = false;
            rasieGiveup.style.cursor = 'pointer';
        }, 1500);
    } else {
        compGiveup()
    }
}

function compChioceBiG() {
    // console.log("000")
    isBigWin = true;
    $("#message").text("強い順")
    whoWin()
}
function compChioceSmall() {
    // console.log("...")
    isSmallWin = true;
    $("#message").text("弱い順")
    whoWin();
}


function compGiveup() {
    $("#message").text("Computer Giveup Raise")
    setTimeout(() => {
        $(".rasieBox").hide();
        $("#whoWinBox").fadeIn();
        $("#message").text("Chioce Which One Win")
    }, 2000);
}

let isOver = false;
function whoWin() {
    if (isOver) {

    } else {
        StraightFlush(playerHandCardArr);
        StraightFlush(compHandCardArr);
        openCardAni(compCardJS);
        isOver = true;
        setTimeout(() => { compshowCardPoint() }, 500)
        setTimeout(() => {
            if (isBigWin == true) {
                parseInt(compScore) > parseInt(playScore) ? compWiner() : playerWiner();
            }
            if (isSmallWin == true) {
                parseInt(compScore) < parseInt(playScore) ? compWiner() : playerWiner();
            }
        }, 3500);
    }

}

function playerWiner() {
    TitleMoney = TitleMoney + (compChip + playerChip) * 100
    changeMoney()
    finishImg.setAttribute('src', './image/choicePoker/win.png');
    $("#finishImg").slideDown('slow');
    $('.FinshBack').show()
}

function compWiner() {
    finishImg.setAttribute('src', './image/choicePoker/lose.png');
    $("#finishImg").slideDown('slow');
    $('.FinshBack').fadeIn('fast');
}

// ====================================================================
// 分數對照
// 同花順  Straight Flush  11= 00000000000  (ex: 黑桃10      "10" +"3" +00000000)
// 鐵支    Four of a Kind  10=  0000000000  (ex: 梅花10      "10" +"0" +0000000)
// 葫蘆    Full house       9=   000000000  (ex: 黑桃9       "09" +"3" +000000)
// 同花    Flush            8=    00000000  (ex: 黑桃10      "10" +"3" +00000)
// 順子    Straight         7=     0000000  (ex: 方塊6       "06" +"1" +0000)
// 三條    Three of a kind  6=      000000  (ex: 方塊2三條   "02" +"1" +000)
// 兩對    Two Pairs        5=       00000  (ex: 紅心11對    "11" +"2" +00 )
// 一對    One Pair         4=        0000  (ex: 紅心10對    "10" +"2" +0 )   
// 散牌    High card        3=         000  (ex: 黑桃A       "14" +"3")  

$("#testbig").click(() => {
    //     // var x = ["020", "041", "061", "062", "063"]
    //     // var x = ["020", "051", "052", "053", "063"]
    var x = ["020", "021", "042", "072", "093"]
    StraightFlush(x)
})

isfourCase01 = false
isfourCase02 = false
isFHCase01 = false
isFHCase02 = false
isThreeCase01 = false
isThreeCase02 = false
isThreeCase03 = false
isTwoCase01 = false
isTwoCase02 = false
isTwoCase03 = false

// 判斷牌型 & 手牌面值
function StraightFlush(arr) {
    let score = ''
    //判斷同花
    let isFlush = true;
    for (let index = 0; index < 4; index++) {
        if (`${arr[index + 1].substr(2, 1)}` != `${arr[index].substr(2, 1)}`) {
            isFlush = false;
            break
        }
    }

    let isStraight = true;
    //判斷順子
    if (`${arr[0].substr(0, 2)}` == '02' && `${arr[4].substr(0, 2)}` == '14') {
        for (let index = 0; index < 3; index++) {
            if (`${arr[index + 1].substr(0, 2) - arr[index].substr(0, 2)}` != 1) {
                isStraight = false;
                break
            }

        }
        arr.unshift(`${arr[4]}`);
        arr.pop()
    } else {
        for (let index = 0; index < 4; index++) {
            if (`${arr[index + 1].substr(0, 2) - arr[index].substr(0, 2)}` != 1) {
                isStraight = false;
                break
            }
        }
    }

    if (isFlush == true && isStraight == true) { score = arr[4].padEnd(11, 0) }
    if (isFlush == true && isStraight != true) { score = arr[4].padEnd(8, 0) }
    if (isStraight == true && isFlush != true) { score = arr[4].padEnd(7, 0) }

    //判斷鐵支
    let isFourOfaKind = true;
    for (let index = 0; index < 3; index++) {
        if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
            isFourOfaKind = false;
            break
        }
        if (isFourOfaKind == true) { score = arr[3].padEnd(10, 0); isfourCase01 = true }
    }

    if (isfourCase01 == false) {
        isFourOfaKind = true
        for (let index = 1; index < 4; index++) {
            if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
                isFourOfaKind = false;
                break
            }
            if (isFourOfaKind == true) { score = arr[4].padEnd(10, 0); isfourCase02 = true }
        }
    }

    //判斷葫蘆
    let isFullHouse = true;
    for (let index = 2; index < 4; index++) {
        if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
            isFullHouse = false;
            break
        }
        if (`${arr[0].substr(0, 2)}` != `${arr[1].substr(0, 2)}`) {
            isFullHouse = false;
            break
        }
        if (isFullHouse == true) { score = arr[4].padEnd(9, 0); isFHCase01 = true; }
    }
    if (isFHCase01 == false) {
        isFullHouse = true;
        for (let index = 0; index < 2; index++) {
            if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
                isFullHouse = false;
                break
            }
            if (`${arr[3].substr(0, 2)}` != `${arr[4].substr(0, 2)}`) {
                isFullHouse = false;
                break
            }
            if (isFullHouse == true) { score = arr[2].padEnd(9, 0); isFHCase02 = true; }
        }
    }


    //判斷三條 
    let isThreeOfaKind = false
    if (isFourOfaKind == false && isFullHouse == false) {
        isThreeOfaKind = true
        if (`${arr[0].substr(0, 2)}` != `${arr[2].substr(0, 2)}` && `${arr[2].substr(0, 2)}` == `${arr[4].substr(0, 2)}`) {
            for (let index = 2; index < 4; index++) {
                if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
                    isThreeOfaKind = false;
                    break
                }
            }
            if (isThreeOfaKind == true) { score = arr[4].padEnd(6, 0); isThreeCase01 = true }
        }
        if (`${arr[0].substr(0, 2)}` != `${arr[2].substr(0, 2)}` && `${arr[2].substr(0, 2)}` != `${arr[4].substr(0, 2)}`) {
            for (let index = 1; index < 3; index++) {
                if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
                    isThreeOfaKind = false;
                    break
                }
            }
            if (isThreeOfaKind == true) { score = arr[3].padEnd(6, 0); isThreeCase02 = true }
        }
        if (`${arr[0].substr(0, 2)}` == `${arr[2].substr(0, 2)}` && `${arr[2].substr(0, 2)}` != `${arr[4].substr(0, 2)}`) {
            for (let index = 0; index < 2; index++) {
                if (`${arr[index].substr(0, 2)}` != `${arr[index + 1].substr(0, 2)}`) {
                    // console.log(index)
                    isThreeOfaKind = false;
                    break
                }
            }
            if (isThreeOfaKind == true) { score = arr[2].padEnd(6, 0); isThreeCase03 = true }
        }
    }


    // 兩對    
    let isTwoPairs = false
    if (isFullHouse == false && isFourOfaKind == false && isThreeOfaKind == false) {
        if (`${arr[0].substr(0, 2)}` == `${arr[1].substr(0, 2)}` && `${arr[2].substr(0, 2)}` == `${arr[3].substr(0, 2)}`) {
            isTwoPairs = true;
            score = arr[3].padEnd(5, 0); isTwoCase01 = true;
        }
        if (`${arr[1].substr(0, 2)}` == `${arr[2].substr(0, 2)}` && `${arr[3].substr(0, 2)}` == `${arr[4].substr(0, 2)}`) {
            isTwoPairs = true;
            score = arr[4].padEnd(5, 0); isTwoCase02 = true;
        }
        if (`${arr[0].substr(0, 2)}` == `${arr[1].substr(0, 2)}` && `${arr[3].substr(0, 2)}` == `${arr[4].substr(0, 2)}`) {
            isTwoPairs = true;
            score = arr[4].padEnd(5, 0); isTwoCase03 = true;
        }
    }

    // 一對    
    let isOnePair = false
    if (isFourOfaKind == false && isFullHouse == false && isThreeOfaKind == false && isTwoPairs == false) {
        for (let index = 0; index < 4; index++) {
            if (`${arr[index].substr(0, 2)}` == `${arr[index + 1].substr(0, 2)}`) {
                isOnePair = true
                score = arr[index + 1].padEnd(4, 0);
                break
            };
        }
    }

    if (score == '') { score = arr[4] }
    if (score < 150 && isBigWin == true) { score = arr[4] }
    if (score < 150) { score = arr[0] }


    if (arr == playerHandCardArr) { playScore = score }
    if (arr == compHandCardArr) { compScore = score }
    // console.log("FourKind: " + isFourOfaKind)
    // console.log("FullHouse: " + isFullHouse)
    // console.log("Flush: " + isFlush)
    // console.log("Straight: " + isStraight)
    // console.log("ThreeKing: " + isThreeOfaKind)
    // console.log("TwoPairs: " + isTwoPairs)
    // console.log("OnePair: " + isOnePair)
    // console.log(arr)
    console.log(score)

};

function showCardPoint() {
    let temp = ''
    switch (playScore.length) {
        case 3:
            temp = 'High Card'
            break;
        case 4:
            temp = 'One Pair'
            break;
        case 5:
            temp = 'Two Pairs'
            break;
        case 6:
            temp = 'Three of Kind'
            break;
        case 7:
            temp = 'Straight'
            break;
        case 8:
            temp = 'Flush'
            break;
        case 9:
            temp = 'Full House'
            break;
        case 10:
            temp = 'Four of Kind'
            break;
        case 11:
            temp = 'Straight Flush'
            break;
        default:
            break;
    }
    $("#playrerCardType").text(temp)
}

function compshowCardPoint() {
    let temp = ''
    switch (compScore.length) {
        case 3:
            temp = 'High Card'
            break;
        case 4:
            temp = 'One Pair'
            break;
        case 5:
            temp = 'Two Pairs'
            break;
        case 6:
            temp = 'Three of Kind'
            break;
        case 7:
            temp = 'Straight'
            break;
        case 8:
            temp = 'Flush'
            break;
        case 9:
            temp = 'Full House'
            break;
        case 10:
            temp = 'Four of Kind'
            break;
        case 11:
            temp = 'Straight Flush'
            break;
        default:
            break;
    }
    $("#computerCardType").text(temp)
}

