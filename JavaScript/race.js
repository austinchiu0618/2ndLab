var userInfo = ''
$("#navLink").ready(function () {
    $.ajax({
        type: "GET",
        url: "/00_LAB/API/home/userInfo",
        dataType: "json",
        error: err => {
            console.log(err["responseText"])
        },
    }).then(function (e) {
        userInfo = e
        $("#userName").html(`${userInfo['userName']}`)
        $("#userMoney").html(`${userInfo['gameMoney']}`)
        TitleMoney = `${userInfo['gameMoney']}`
    })
});

var nowTitleMoney = 0
function changeMoney() {
    nowTitleMoney = TitleMoney 
    var minusUserMoney = {
        userName: `${userInfo['userName']}`,
        gameMoney: `${nowTitleMoney}`,
    };
    $.ajax({
        type: "POST",
        url: "/00_LAB/API/game/changeMoney",
        data: minusUserMoney
    }).then(function (e) {
        $("#userMoney").text(e);
    });
}


//Race Start

function playGame() {
    NOpush()
    changeMoney()
    racerToStart()
    setTimeout(() => {
        startLighJS[0].style.backgroundColor = '#bb2236';
        setTimeout(() => {
            startLighJS[1].style.backgroundColor = '#bb2236';
        }, 1000);
        setTimeout(() => {
            startLighJS[2].style.backgroundColor = '#bb2236';
        }, 2000);
        setTimeout(() => {
            for (let i of startLighJS) {
                i.style.backgroundColor = 'black';
            };
            racerOneAni();
            racerTwoAni();
            racerThreeAni();
        }, 3000);
    }, 3000);
}

startBtn.addEventListener('click', playGame)

//下注
var TitleMoney = 9999
var oneMoney = 0
var oneUpBtn = document.getElementsByClassName('upBtn')[0]
var oneDownBtn = document.getElementsByClassName('downBtn')[0]
oneUpBtn.addEventListener('click', () => {
    if (TitleMoney >= 100) {
        oneMoney += 100
        TitleMoney -= 100
    }
    racerOneMoney.innerText = oneMoney
});
oneDownBtn.addEventListener('click', () => {
    if (oneMoney >= 100) {
        oneMoney -= 100;
        TitleMoney += 100
    } else {
    }
    racerOneMoney.innerText = oneMoney
});

var twoMoney = 0
var twoUpBtn = document.getElementsByClassName('upBtn')[1]
var twoDownBtn = document.getElementsByClassName('downBtn')[1]
twoUpBtn.addEventListener('click', () => {
    if (TitleMoney >= 100) {
        twoMoney += 100
        TitleMoney -= 100
    }
    racerTwoMoney.innerText = twoMoney
});
twoDownBtn.addEventListener('click', () => {
    if (twoMoney >= 100) {
        twoMoney -= 100;
        TitleMoney += 100
    } else {
    }
    racerTwoMoney.innerText = twoMoney
});

var threeMoney = 0
var threeUpBtn = document.getElementsByClassName('upBtn')[2]
var threeDownBtn = document.getElementsByClassName('downBtn')[2]
threeUpBtn.addEventListener('click', () => {
    if (TitleMoney >= 100) {
        threeMoney += 100
        TitleMoney -= 100
    }
    racerThreeMoney.innerText = threeMoney
});
threeDownBtn.addEventListener('click', () => {
    if (threeMoney >= 100) {
        threeMoney -= 100;
        TitleMoney += 100
    } else {
    }
    racerThreeMoney.innerText = threeMoney
});


//比賽開始 按鈕失效
function NOpush() {
    var upbtnjs = document.getElementsByClassName('upBtn')
    var downbtnjs = document.getElementsByClassName('downBtn')
    document.getElementById('startBtn').disabled = true;
    for (let index = 0; index < upbtnjs.length; index++) {
        upbtnjs[index].disabled = true;
        upbtnjs[index].style.cursor = 'not-allowed';
        downbtnjs[index].disabled = true;
        downbtnjs[index].style.cursor = 'not-allowed';
        document.getElementById('startBtn').style.cursor = 'not-allowed';
    }
}

//比賽結束
var overRacer = [];
function gameIsFinal() {
    winer()
    switch (overRacer[0]) {
        case "racerOne":
            nowTitleMoney = parseInt(nowTitleMoney) + parseInt(oneMoney * 1.5);
            changeMoney()
            break;
        case "racerTwo":
            nowTitleMoney = parseInt(nowTitleMoney) + parseInt(twoMoney * 1.5);
            changeMoney()
            break;
        case "racerThree":
            nowTitleMoney = parseInt(nowTitleMoney) + parseInt(threeMoney * 1.5);
            changeMoney()
            break;
        default:
            break;
    }
}

$('.FinshBack').click(function () {
    $('.FinshBack').hide()
    location.reload();
})


// ---------------------------------------
//動畫

var racerBoxJS = document.getElementById('racerBox')
var runAnimeJS = document.querySelectorAll('#raceTrack img')
var LightBoxJS = document.getElementById('startLight')
var startLighJS = document.querySelectorAll('#startLight>div')
var winerJS = document.querySelectorAll('#raceFinsh>img')

function racerToStart() {
    racerBoxJS.style.transform = 'translateX(0px)';
    racerBoxJS.style.opacity = 1;
    LightBoxJS.style.opacity = 1;
};

function winer() {
    for (let index = 0; index < winerJS.length; index++) {
        winerJS[index].setAttribute('src', `./image/race/${overRacer[index]}.png`)
    }
    raceFinsh.style.opacity = 1;
    $('.FinshBack').show()
}


//------------------------------------------ 
// 跑者與跑道參數

// 跑道轉折
var layoutOne01 = 160
var layoutOne02 = -280
var layoutOne03 = 160
var layoutTwo01 = layoutOne01 + 130
var layoutTwo02 = layoutOne02 + 130
var layoutTwo03 = layoutOne03 + 130
var layoutThree01 = layoutTwo01 + 130
var layoutThree02 = layoutTwo02 + 130
var layoutThree03 = layoutTwo03 + 130
// 轉彎速度修正 
var racerOneTurn = 0.895
var racerTwoTurn = 1
var racerThreeTurn = 1.13

var GameSpeed = 20;
var lineSpeedUP = 3
var lineSpeedBase = 2
var cirSpeedUP = 5
// var cirSpeedBase = 1

// 1號跑者
var racerOneJS = document.getElementById('racerOne');
var racerOneRadius = -90;
var racerOneMoveX = 1;
var racerOneMoveY = 1;
var racerOneR = 190;
var racerOneRotateY = 0
var racerOneRotateZ = 0

// 2號跑者
var racerTwoJS = document.getElementById('racerTwo');
var racerTwoRadius = -90;
var racerTwoMoveX = 1;
var racerTwoMoveY = 1;
var racerTwoR = 140;
var racerTwoRotateY = 0
var racerTwoRotateZ = 0


// 3號跑者
var racerThreeJS = document.getElementById('racerThree');
var racerThreeRadius = -90;
var racerThreeMoveX = 1;
var racerThreeMoveY = 1;
var racerThreeR = 90;
var racerThreeRotateY = 0
var racerThreeRotateZ = 0



// ----------------------------

var racerOne_isStart = true;
var racerOne_isRound01 = false;
var racerOne_isRound02 = false;
var racerOne_isRound03 = false;
var racerOne_isRound04 = false;
var racerOne_isOver = false;

var racerOneSpeedStar = 0
var racerOneSpeed01 = 0
var racerOneSpeed02 = 0
var racerOneSpeed03 = 0
var racerOneSpeed04 = 0

function racerOneAni() {
    racerOneSpeedStar = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerOneSpeed01 = racerOneTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerOneSpeed02 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerOneSpeed03 = racerOneTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerOneSpeed04 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    var playAni = setInterval(racerOneGo, GameSpeed);
    function racerOneGo() {
        // racerOneGameSpeed = Math.floor(Math.random() * 10 + 10)
        runAnimeJS[0].style.animationPlayState = "running";
        if (racerOne_isStart == true && racerOneMoveX < layoutOne01) {
            racerOneJS.style.transform = `translate(${racerOneMoveX}px,${racerOneMoveY}px)`;
            racerOneMoveX += racerOneSpeedStar;
            racerOne_isRound01 = true;
        }
        if (racerOne_isRound01 == true && racerOneMoveX >= layoutOne01 && racerOneMoveY <= racerOneR * 2) {
            let x = racerOneR * Math.cos((racerOneRadius + racerOneSpeed01) * Math.PI / 180) - racerOneR * Math.cos(racerOneRadius * Math.PI / 180);
            let y = racerOneR * Math.sin((racerOneRadius + racerOneSpeed01) * Math.PI / 180) - racerOneR * Math.sin(racerOneRadius * Math.PI / 180);
            racerOneMoveX = racerOneMoveX + x;
            racerOneMoveY = racerOneMoveY + y;
            racerOneJS.style.transform = `translate(${racerOneMoveX}px,${racerOneMoveY + y}px) rotateY(${racerOneRotateY}deg) rotateZ(${(0 + racerOneRotateZ)}deg)`;
            racerOneRadius += racerOneSpeed01;
            racerOneMoveY <= racerOneR ? racerOneRotateY = 0 : racerOneRotateY = 180;
            racerOneMoveY <= racerOneR ? racerOneRotateZ += racerOneSpeed01 : racerOneRotateZ -= racerOneSpeed01;
            racerOne_isStart = false;
            racerOne_isRound02 = true;
        }
        if (racerOne_isRound02 == true && racerOneMoveX > layoutOne02 && racerOneMoveY > racerOneR * 2) {
            racerOneJS.style.transform = `translate(${racerOneMoveX}px,${racerOneMoveY}px) rotateY(180deg)`;
            racerOneMoveX -= racerOneSpeed02;
            racerOne_isRound01 = false;
            racerOne_isRound03 = true;
        }
        if (racerOne_isRound03 == true && racerOneMoveX <= layoutOne02 && racerOneMoveY > -1) {
            let x = racerOneR * Math.cos((racerOneRadius + racerOneSpeed03) * Math.PI / 180) - racerOneR * Math.cos(racerOneRadius * Math.PI / 180)
            let y = racerOneR * Math.sin((racerOneRadius + racerOneSpeed03) * Math.PI / 180) - racerOneR * Math.sin(racerOneRadius * Math.PI / 180)
            racerOneMoveX = racerOneMoveX + x
            racerOneMoveY = racerOneMoveY + y
            racerOneJS.style.transform = `translate(${racerOneMoveX}px,${racerOneMoveY + y}px) rotateY(${racerOneRotateY}deg) rotateZ(${(0 + racerOneRotateZ)}deg)`
            racerOneRadius += racerOneSpeed03
            racerOneMoveY <= racerOneR ? racerOneRotateY = 0 : racerOneRotateY = 180;
            racerOneMoveY <= racerOneR ? racerOneRotateZ += racerOneSpeed03 : racerOneRotateZ -= racerOneSpeed03;
            racerOne_isRound02 = false
            racerOne_isRound04 = true
        }
        if (racerOne_isRound04 == true && racerOneMoveX <= layoutOne03 && racerOneMoveY < 2) {
            racerOneJS.style.transform = `translate(${racerOneMoveX}px,${racerOneMoveY}px)`
            racerOneMoveX += racerOneSpeed04
            racerOne_isRound03 = false
            racerOne_isOver = true
        }
        if (racerOne_isOver == true && racerOneMoveX > layoutOne03) {
            runAnimeJS[0].style.animationPlayState = "paused";
            clearInterval(playAni)
            overRacer.push("racerOne")
            // let rd = new Date();
            // console.log(`racerOne: ${rd.getSeconds()}`)
            // console.log(overRacer)
            if (overRacer.length == 3) {
                gameIsFinal()
            }
        }
        // console.log(`OneR: ${racerOneRadius}`)
        // console.log(`OneX: ${racerOneMoveX}`)
        // console.log(`OneY: ${racerOneMoveY}`)
    }
}



var racerTwo_isStart = true;
var racerTwo_isRound01 = false;
var racerTwo_isRound02 = false;
var racerTwo_isRound03 = false;
var racerTwo_isRound04 = false;
var racerTwo_isOver = false;

var racerTwoSpeedStar = 0
var racerTwoSpeed01 = 0
var racerTwoSpeed02 = 0
var racerTwoSpeed03 = 0
var racerTwoSpeed04 = 0

function racerTwoAni() {
    racerTwoSpeedStar = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerTwoSpeed01 = racerTwoTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerTwoSpeed02 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerTwoSpeed03 = racerTwoTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerTwoSpeed04 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    var playAni = setInterval(racerTwoGo, GameSpeed)
    function racerTwoGo() {
        // racerTwoGameSpeed = Math.floor(Math.random() * 10 + 10)
        runAnimeJS[1].style.animationPlayState = "running";
        if (racerTwo_isStart == true && racerTwoMoveX < layoutTwo01) {
            racerTwoJS.style.transform = `translate(${racerTwoMoveX}px,${racerTwoMoveY}px)`;
            racerTwoMoveX += racerTwoSpeedStar;
            racerTwo_isRound01 = true;
        }
        if (racerTwo_isRound01 == true && racerTwoMoveX >= layoutTwo01 && racerTwoMoveY <= racerTwoR * 2) {
            let x = racerTwoR * Math.cos((racerTwoRadius + racerTwoSpeed01) * Math.PI / 180) - racerTwoR * Math.cos(racerTwoRadius * Math.PI / 180);
            let y = racerTwoR * Math.sin((racerTwoRadius + racerTwoSpeed01) * Math.PI / 180) - racerTwoR * Math.sin(racerTwoRadius * Math.PI / 180);
            racerTwoMoveX = racerTwoMoveX + x;
            racerTwoMoveY = racerTwoMoveY + y;
            racerTwoJS.style.transform = `translate(${racerTwoMoveX}px,${racerTwoMoveY + y}px) rotateY(${racerTwoRotateY}deg) rotateZ(${(0 + racerTwoRotateZ)}deg)`;
            racerTwoRadius += racerTwoSpeed01;
            racerTwoMoveY <= racerTwoR ? racerTwoRotateY = 0 : racerTwoRotateY = 180;
            racerTwoMoveY <= racerTwoR ? racerTwoRotateZ += racerTwoSpeed01 : racerTwoRotateZ -= racerTwoSpeed01;
            racerTwo_isStart = false;
            racerTwo_isRound02 = true;
        }
        if (racerTwo_isRound02 == true && racerTwoMoveX > layoutTwo02 && racerTwoMoveY > racerTwoR * 2) {
            racerTwoJS.style.transform = `translate(${racerTwoMoveX}px,${racerTwoMoveY}px) rotateY(180deg)`;
            racerTwoMoveX -= racerTwoSpeed02;
            racerTwo_isRound01 = false;
            racerTwo_isRound03 = true;
        }
        if (racerTwo_isRound03 == true && racerTwoMoveX <= layoutTwo02 && racerTwoMoveY > -1) {
            let x = racerTwoR * Math.cos((racerTwoRadius + racerTwoSpeed03) * Math.PI / 180) - racerTwoR * Math.cos(racerTwoRadius * Math.PI / 180)
            let y = racerTwoR * Math.sin((racerTwoRadius + racerTwoSpeed03) * Math.PI / 180) - racerTwoR * Math.sin(racerTwoRadius * Math.PI / 180)
            racerTwoMoveX = racerTwoMoveX + x
            racerTwoMoveY = racerTwoMoveY + y
            racerTwoJS.style.transform = `translate(${racerTwoMoveX}px,${racerTwoMoveY + y}px) rotateY(${racerTwoRotateY}deg) rotateZ(${(0 + racerTwoRotateZ)}deg)`
            racerTwoRadius += racerTwoSpeed03
            racerTwoMoveY <= racerTwoR ? racerTwoRotateY = 0 : racerTwoRotateY = 180;
            racerTwoMoveY <= racerTwoR ? racerTwoRotateZ += racerTwoSpeed03 : racerTwoRotateZ -= racerTwoSpeed03;
            racerTwo_isRound02 = false
            racerTwo_isRound04 = true
        }
        if (racerTwo_isRound04 == true && racerTwoMoveX <= layoutTwo03 && racerTwoMoveY < 2) {
            racerTwoJS.style.transform = `translate(${racerTwoMoveX}px,${racerTwoMoveY}px)`
            racerTwoMoveX += racerTwoSpeed04
            racerTwo_isRound03 = false
            racerTwo_isOver = true
        }
        if (racerTwo_isOver == true && racerTwoMoveX > layoutTwo03) {
            runAnimeJS[1].style.animationPlayState = "paused";
            clearInterval(playAni)
            overRacer.push("racerTwo")
            // let rd = new Date();
            // console.log(`racerTwo: ${rd.getSeconds()}`)
            // console.log(overRacer)
            if (overRacer.length == 3) {
                gameIsFinal()
            }
        }
        // console.log(`TwoR: ${racerTwoRadius}`)
        // console.log(`TwoX: ${racerTwoMoveX}`)
        // console.log(`TwoY: ${racerTwoMoveY}`)
    }
}



var racerThree_isStart = true;
var racerThree_isRound01 = false;
var racerThree_isRound02 = false;
var racerThree_isRound03 = false;
var racerThree_isRound04 = false;
var racerThree_isOver = false;

var racerThreeSpeedStar = 0
var racerThreeSpeed01 = 0
var racerThreeSpeed02 = 0
var racerThreeSpeed03 = 0
var racerThreeSpeed04 = 0

function racerThreeAni() {
    racerThreeSpeedStar = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerThreeSpeed01 = racerThreeTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerThreeSpeed02 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    racerThreeSpeed03 = racerThreeTurn * (1 + (Math.floor(Math.random() * cirSpeedUP) / 100));
    racerThreeSpeed04 = Math.floor(Math.random() * lineSpeedUP + lineSpeedBase);
    var playAni = setInterval(racerThreeGo, GameSpeed)
    function racerThreeGo() {
        // racerThreeGameSpeed = Math.floor(Math.random() * 10 + 10)
        runAnimeJS[2].style.animationPlayState = "running";
        if (racerThree_isStart == true && racerThreeMoveX < layoutThree01) {
            racerThreeJS.style.transform = `translate(${racerThreeMoveX}px,${racerThreeMoveY}px)`;
            racerThreeMoveX += racerThreeSpeedStar;
            racerThree_isRound01 = true;
        }
        if (racerThree_isRound01 == true && racerThreeMoveX >= layoutThree01 && racerThreeMoveY <= racerThreeR * 2) {
            let x = racerThreeR * Math.cos((racerThreeRadius + racerThreeSpeed01) * Math.PI / 180) - racerThreeR * Math.cos(racerThreeRadius * Math.PI / 180);
            let y = racerThreeR * Math.sin((racerThreeRadius + racerThreeSpeed01) * Math.PI / 180) - racerThreeR * Math.sin(racerThreeRadius * Math.PI / 180);
            racerThreeMoveX = racerThreeMoveX + x;
            racerThreeMoveY = racerThreeMoveY + y;
            racerThreeJS.style.transform = `translate(${racerThreeMoveX}px,${racerThreeMoveY + y}px) rotateY(${racerThreeRotateY}deg) rotateZ(${(0 + racerThreeRotateZ)}deg)`;
            racerThreeRadius += racerThreeSpeed01;
            racerThreeMoveY <= racerThreeR ? racerThreeRotateY = 0 : racerThreeRotateY = 180;
            racerThreeMoveY <= racerThreeR ? racerThreeRotateZ += racerThreeSpeed01 : racerThreeRotateZ -= racerThreeSpeed01;
            racerThree_isStart = false;
            racerThree_isRound02 = true;
        }
        if (racerThree_isRound02 == true && racerThreeMoveX > layoutThree02 && racerThreeMoveY > racerThreeR * 2) {
            racerThreeJS.style.transform = `translate(${racerThreeMoveX}px,${racerThreeMoveY}px) rotateY(180deg)`;
            racerThreeMoveX -= racerThreeSpeed02;
            racerThree_isRound01 = false;
            racerThree_isRound03 = true;
        }
        if (racerThree_isRound03 == true && racerThreeMoveX <= layoutThree02 && racerThreeMoveY > -1) {
            let x = racerThreeR * Math.cos((racerThreeRadius + racerThreeSpeed03) * Math.PI / 180) - racerThreeR * Math.cos(racerThreeRadius * Math.PI / 180)
            let y = racerThreeR * Math.sin((racerThreeRadius + racerThreeSpeed03) * Math.PI / 180) - racerThreeR * Math.sin(racerThreeRadius * Math.PI / 180)
            racerThreeMoveX = racerThreeMoveX + x
            racerThreeMoveY = racerThreeMoveY + y
            racerThreeJS.style.transform = `translate(${racerThreeMoveX}px,${racerThreeMoveY + y}px) rotateY(${racerThreeRotateY}deg) rotateZ(${(0 + racerThreeRotateZ)}deg)`
            racerThreeRadius += racerThreeSpeed03
            racerThreeMoveY <= racerThreeR ? racerThreeRotateY = 0 : racerThreeRotateY = 180;
            racerThreeMoveY <= racerThreeR ? racerThreeRotateZ += racerThreeSpeed03 : racerThreeRotateZ -= racerThreeSpeed03;
            racerThree_isRound02 = false
            racerThree_isRound04 = true
        }
        if (racerThree_isRound04 == true && racerThreeMoveX <= layoutThree03 && racerThreeMoveY < 2) {
            racerThreeJS.style.transform = `translate(${racerThreeMoveX}px,${racerThreeMoveY}px)`
            racerThreeMoveX += racerThreeSpeed04
            racerThree_isRound03 = false
            racerThree_isOver = true
        }
        if (racerThree_isOver == true && racerThreeMoveX > layoutThree03) {
            runAnimeJS[2].style.animationPlayState = "paused";
            clearInterval(playAni)
            overRacer.push("racerThree")
            // let rd = new Date();
            // console.log(`racerThree: ${rd.getSeconds()}`)
            // console.log(overRacer)
            if (overRacer.length == 3) {
                gameIsFinal()
            }
        }
        // console.log(`ThreeR: ${racerThreeRadius}`)
        // console.log(`ThreeX: ${racerThreeMoveX}`)
        // console.log(`ThreeY: ${racerThreeMoveY}`)
    }
}
