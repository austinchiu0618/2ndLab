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
        $("#inOut").html('<a href="/00_LAB/API/home/logout">Logout</a>')
        $("#navLink").append('<p></p>')
        $("#navLink").append(`<div id="iamuser">${userInfo['userName']} <span id="userMoney">${userInfo['gameMoney']}</span></div>`)
        if (`${userInfo['gameMoney']}` > 30000){iamuser.style.color = "yellow"}
    })
});


window.onload = () => {

    // carousel
    // -----------------
    cloneDiv()
    transSlider(-sliderMoveWidth)
    mouseMoveBox()
    stopDragImg()
    stopDragLink()
    createDot()
    dotsTrans()
    autoPlay()
    //--------------------------
};

// carousel
//------------------------------
var sliderIndex = 0;
var sliderBoxJS = document.getElementById('sliderBox');
var sliderJS = document.getElementsByClassName('slider')
var sliderMoveWidth = sliderJS[1].offsetWidth;
var sliderLen = sliderJS.length;
var firstSlider = sliderJS[0];
var lastSlider = sliderJS[sliderLen - 1];
var cloneFirst = firstSlider.cloneNode(true);
var cloneLast = lastSlider.cloneNode(true);
var currentOffset = sliderMoveWidth;
var minsliderMoveWidth = sliderMoveWidth / 4;
var transTime = "500ms"
var mouseDownXis = 0;
var mouseMoveXis = 0;
var boxMouseDowning = false;
var boxMouseMoving = false;
var imgDraging = false;
var dotBoxJs = document.getElementById('dotBox');
var isAutoPlay = false;


// 網頁開啟時，在第一張前面增加一張尾巴，在最後一張後面增加一張頭
function cloneDiv() {
    sliderBoxJS.appendChild(cloneFirst);
    sliderBoxJS.insertBefore(cloneLast, firstSlider);
}

// sliderBox移動
function transSlider(moveWhere, moveTime = "0ms") {
    sliderBoxJS.style.transform = `translateX(${moveWhere}px)`
    sliderBoxJS.style.transitionDuration = moveTime
};

// 第一張前面是最後一張,最後一張後面是第一張 => 恢復正常輪值事件
function shiftBack() {
    switch (sliderIndex) {
        case -1:
            currentOffset = sliderMoveWidth * sliderLen;
            sliderIndex = sliderLen - 1;
            changeDotsStyle()
            break;
        case sliderLen:
            currentOffset = sliderMoveWidth;
            sliderIndex = 0;
            changeDotsStyle()
            break;
        default:
            break;
    }
    transSlider(-currentOffset)
}


sliderBoxJS.addEventListener('transitionend', shiftBack)
sliderBoxJS.addEventListener('mousedown', shiftBack)

// 滑鼠拖曳事件
function mouseMoveBox() {
    sliderBoxJS.addEventListener('mousedown', (nowDown) => {
        stopAutoPlay()
        mouseDownXis = nowDown.clientX;//滑鼠觸發down的位置
        boxMouseDowning = true; //確定滑鼠有down
        imgDraging = false;
        // console.log(`mouseDownXis=${mouseDownXis}`);
        // console.log(`currentOffset=${currentOffset}`);
    });
    sliderBoxJS.addEventListener('mousemove', (nowMove) => {
        if (boxMouseDowning) {
            mouseMoveXis = nowMove.clientX - mouseDownXis;//滑鼠拖曳的距離
            let moveOffset = mouseMoveXis - currentOffset;
            transSlider(moveOffset);//滑鼠拖曳即時變化
            boxMouseMoving = true;//確定滑鼠有move (不然沒有move 光up就會變化)
            imgDraging = true;
            // console.log(`mouseMoveXis=${mouseMoveXis}`);
        }
    });
    document.onmouseup = function () {
        if (boxMouseMoving) {
            boxMouseDowning = false;
            if (Math.abs(mouseMoveXis) > minsliderMoveWidth) {
                // mouseMoveXis大於0是BOX往右移動，index減少
                if (mouseMoveXis > 0) {
                    currentOffset = currentOffset - sliderMoveWidth;
                    sliderIndex--;
                    changeDotsStyle()
                } else {
                    // mouseMoveXis小於0是BOX往左移動，index增加
                    currentOffset = currentOffset + sliderMoveWidth;
                    sliderIndex++;
                    changeDotsStyle()
                }
            }
            transSlider(-currentOffset, transTime);
            boxMouseMoving = false;
            autoPlay()
        }
    }
}

//按左右slider移動
forRightIcon.addEventListener('click', () => {
    stopAutoPlay()
    if (sliderIndex < sliderLen) {
        currentOffset = currentOffset + sliderMoveWidth;
        sliderIndex++;
        // console.log(sliderIndex)
    }
    changeDotsStyle()
    transSlider(-currentOffset, transTime);
    autoPlay()
})

forLeftIcon.addEventListener('click', () => {
    stopAutoPlay()
    if (sliderIndex < sliderLen) {
        currentOffset = currentOffset - sliderMoveWidth;
        sliderIndex--;
        // console.log(sliderIndex)
    }
    changeDotsStyle()
    transSlider(-currentOffset, transTime);
    autoPlay()
})


// 防止滑鼠事件時拖曳到圖片
function stopDragImg() {
    var sliderImgs = document.getElementsByClassName('slider');
    for (imgNum of sliderImgs) {
        imgNum.ondragstart = () => {
            return false;
        }
    }
};

// 防止滑鼠事件時進入超連結
function stopDragLink() {
    var linkList = document.querySelectorAll('.slider > a');
    for (let i of linkList)
        i.addEventListener('click', (isLink) => {
            if (imgDraging) {
                isLink.preventDefault();
            }
        });
}


// dot小白點產生
dotJS = document.getElementsByClassName('dot')
function createDot() {
    for (let index = 0; index < sliderLen; index++) {
        var dotCreateJS = document.createElement('span')
        dotCreateJS.className = 'dot'
        dotCreateJS.setAttribute('dotsIndex', index)
        dotBoxJs.appendChild(dotCreateJS)
    }
    dotJS[0].className += ' active'
    // console.log(dotBoxJs)
    // console.log(dotJS)
}

// dot小白點切換
function changeDotsStyle() {
    if (sliderIndex >= 0 && sliderIndex < sliderLen) {
        var dotJS_active = document.querySelector('.dot.active')
        dotJS_active.classList.remove('active');
        if (sliderIndex == sliderLen) {
            dotJS[0].classList.add('active');
        } else {
            dotJS[sliderIndex].classList.add('active');
        }
        // console.log(sliderIndex)
    }

}

// dot跟autoplay變化用
function carousel() {
    sliderIndex++;
    sliderIndex > sliderLen ? sliderIndex = 0 : '';
    currentOffset = sliderMoveWidth * (sliderIndex + 1);
    changeDotsStyle();
    transSlider(-currentOffset, transTime);
    // console.log(sliderIndex)
}

function dotsTrans() {
    for (dot of dotJS) {
        dot.addEventListener("click", (e) => {
            stopAutoPlay();
            sliderIndex = e.target.getAttribute('dotsIndex') - 1;
            carousel();
            autoPlay();
        });
    }
}

function stopAutoPlay() {
    if (!isAutoPlay) { return; }
    isAutoPlay = false;
    clearInterval(transSliderAnimate);
}
function autoPlay() {
    //only auto play stop then setInterval in case extra action
    if (isAutoPlay) { return; }
    isAutoPlay = true;
    transSliderAnimate = setInterval(carousel, 3000);
}

//------------------------------

/* Game Rules Tab */
function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();