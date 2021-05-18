$(document).ready(function () { 
    $('.regFinsh').hide() 
})

var isName = false
var isPwd = false
var isPwdCheck = false
var isEmail = false

// 表單送出
$("#btnIsOk").click(function () {
    nameCheck();
    passwordCheck();
    passwordDoubleCheck();
    mailCheck();
    if (isName == true && isPwd == true && isPwdCheck == true && isEmail == true) {
        var userData = {
            userName: `${userName.value}`,
            userPwd: `${userPwdCheck.value}`,
            useremail: `${useremail.value}`,
        };
        $.ajax({
            type: "POST",
            url: "/00_LAB/API/register/sent",
            data: userData
        }).then(function (e) {
            if (e) {
                $('.regFinsh').fadeIn("slow");
            }
        });
    }
});

$('#isfinish').click(function () {
    window.location.href = "/00_LAB/project2/login.html"
});

// 監聽input(說明輸入限制,檢查格式是否正確&帳號是否重複,Labal文字動畫) 
// ---------------------
$("#userName").focus(function () {
    userName.placeholder = "6 ~ 16 文字";
});

$("#userPwd").focus(function () {
    userPwd.placeholder = "6 ~ 16 文字";
});

$("#userName").focusout(function () {
    nameCheck()
    if (isName == true) {
        var userNameData = {
            userName: `${userName.value}`,
        };
        $.ajax({
            type: "POST",
            url: "/00_LAB/API/register/nameCheck",
            data: userNameData
        }).then(function (e) {
            $("p:nth-of-type(1)").html(e);
        });
    }
    if (userName.value) {
        // userName.classList.toggle('active');
        userName.className += ' active';
        userName.placeholder = " ";
    } else {
        userName.classList.remove('active');
        userName.placeholder = " "
    }
}
);


$("#userPwd").focusout(function () {
    passwordCheck();
    if (userPwd.value) {
        userPwd.className += ' active';
        userPwd.placeholder = " ";
    } else {
        userPwd.classList.remove('active');
        userPwd.placeholder = " "
    }
}
);

$("#userPwdCheck").focusout(function () {
    passwordDoubleCheck();
    if (userPwdCheck.value) {
        userPwdCheck.className += ' active';
    } else {
        userPwdCheck.classList.remove('active');
    }
}
);

$("#useremail").focusout(function () {
    mailCheck();
    if (useremail.value) {
        useremail.className += ' active';
    } else {
        useremail.classList.remove('active');
    }
}
);
// ---------------------


// 表單格式確認
// ---------------------
var wrongText = document.getElementsByClassName('haveWrong')
function nameCheck() {
    if (userName.value == '') {
        wrongText[0].innerHTML = '<i class="fas fa-exclamation"></i>  ユーザー名を入力してください';
        isName = false;
    } else if (userName.value.length < 6 || userName.value.length > 16) {
        wrongText[0].innerHTML = '<i class="fas fa-exclamation"></i>  長さは6 ~ 16 文字';
        isName = false;
    }
    else {
        wrongText[0].innerHTML = '';
        isName = true
    }
}

function passwordCheck() {
    if (userPwd.value == '') {
        wrongText[1].innerHTML = '<i class="fas fa-exclamation"></i>  パスワードを入力してください';
        isPwd = false;
    } else if (userPwd.value.length < 6 || userPwd.value.length > 16) {
        wrongText[1].innerHTML = '<i class="fas fa-exclamation"></i>  長さは6 ~ 16 文字';
        isPwd = false;
    }
    else {
        wrongText[1].innerHTML = '';
        isPwd = true;
    }
}

function passwordDoubleCheck() {
    if (userPwdCheck.value == '') {
        wrongText[2].innerHTML = '<i class="fas fa-exclamation"></i>  パスワードを再度入力してください';
        isPwdCheck = false;
    } else if (userPwdCheck.value != userPwd.value) {
        wrongText[2].innerHTML = '<i class="fas fa-exclamation"></i>  パスワードが一致しません';
        isPwdCheck = false;
    }
    else {
        wrongText[2].innerHTML = '';
        isPwdCheck = true;
    }
}

function mailCheck() {
    index = useremail.value.indexOf('@', 0); // 尋找 @ 的位置，0 代表開始尋找的起始位置
    if (useremail.value == '') { wrongText[3].innerHTML = '<i class="fas fa-exclamation"></i> E メールアドレスを入力してください'; }
    else if (index == -1 || index == 0 || index == useremail.value.length - 1) {
        wrongText[3].innerHTML = '<i class="fas fa-exclamation"></i> 有効な E メールアドレスを入力してください';
        isEmail = false;
    } else { wrongText[3].innerHTML = ''; isEmail = true }
}
        // ---------------------
