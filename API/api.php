<?php
// 一個簡單但可以運作的 REST API，
// 物件導向與MVC課程時，再來寫進化版

// RewriteRule ^(.*)$ api.php?url=$1 [QSA,L]
// 傳回網址後面的 QUERY STRING。就是 ?a=xxx&b=xxx&c=xxx 這一段。
// api/0912345/abc 傳回 0912345/abc

$method = $_SERVER['REQUEST_METHOD'];
$url = explode("/", rtrim($_GET["url"], "/"));
// $_SERVER['REQUEST_METHOD'] #訪問頁面時的請求方法。例如：「GET」、「HEAD」，「POST」，「PUT」
// 將 $_GET["url"] 解析成陣列 xxx/yyy/zzz 變成 [xxx,yyy,zzz]

$dbLink = mysqli_connect("localhost", "root", "", "meffproject2", 3306) or die(mysqli_connect_error());
mysqli_query($dbLink, "set names utf8");

switch ($method . " " . $url[0] . " " . $url[1]) {
    case "POST register nameCheck":
        checkName($url[0]);
        break;
    case "POST register sent":
        registerUserInfo();
        break;
    case "POST login nameCheck":
        checkName($url[0]);
        break;
    case "POST login sent":
        userLogin();
        break;
    case "GET home userInfo":
        showUser();
        break;
    case "GET home logout":
        userLogout();
        break;
    case "POST game changeMoney":
        changeMoney();
        break;
    case "GET shop charge":
        shopCharge();
        break;
    default:
        echo "Thank you";
}
mysqli_close($dbLink);

// 註冊用
function registerUserInfo()
{
    global $dbLink;
    parse_str(file_get_contents('php://input'), $putData);
    $userName  = $_POST["userName"];
    $password  = $_POST["userPwd"];
    $eMail     = $_POST["useremail"];
    $commandText =
        "insert into userinfo "
        . "set userName = '{$userName}'"
        . "  , password = '{$password}'"
        . "  , eMail    = '{$eMail}'"
        . "  , gameMoney    = 3000";
    $result = mysqli_query($dbLink, $commandText);

    echo "true";
};


// 確認註冊名字 & 登陸時名字
function checkName($forwhat)
{
    global $dbLink;
    parse_str(file_get_contents('php://input'), $putNameData);
    // 將前端轉成PHP可閱讀

    $userName =  $putNameData["userName"];
    $commandText = "select userName FROM userinfo where userName = '{$userName}'";
    $result = mysqli_query($dbLink, $commandText);

    $datalist = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $datalist[] = $row;
    };

    // echo  $putNameData[["userName"]];
    if ($forwhat == "register") {
        if (!empty($datalist)) {
            echo  "<i class='fas fa-exclamation'>" . "</i>" . "ユーザー名を使用されています。";
        };
    }
    if ($forwhat == "login") {
        if (empty($datalist)) {
            echo  "<i class='fas fa-exclamation'>" . "</i>" . "ユーザーが存在しない。";
        };
    };
};

// 會員登錄
function userLogin()
{
    global $dbLink;
    parse_str(file_get_contents('php://input'), $putData);
    $userName  = $putData["userName"];
    $password  = $putData["userPwd"];

    $commandText =
        "select userName,password,gameMoney FROM userinfo where "
        . "userName = '{$userName}'"
        . " and "
        . "password = '{$password}'";
    $result = mysqli_query($dbLink, $commandText);

    $datalist = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $datalist[] = $row;
    };
    if (empty($datalist)) {
        echo "false";
    } else {
        if ($datalist[0]["userName"] != $_POST["userName"] || $datalist[0]["password"] != $_POST["userPwd"]) {
            echo "false";
        } else {
            echo "true";
        }
    };
    session_id();
    session_start();
    $_SESSION["userName"] = $datalist[0]["userName"];
    $_SESSION["gameMoney"] = $datalist[0]["gameMoney"];
};

// 登入後顯示會員名字
function showUser()
{
    session_start();
    if (isset($_SESSION["userName"])) {
        global $dbLink;
        $userName  = $_SESSION["userName"];
        $commandText =
            "select userName,gameMoney FROM userinfo where "
            . "userName = '{$userName}'";
        $result = mysqli_query($dbLink, $commandText);

        $datalist = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $datalist[] = $row;
        };
        echo json_encode($datalist[0]);
    } else {
        echo "guset";
    };
}

// 會員登出
function userLogout()
{
    session_start();
    if (isset($_SESSION["userName"])) {
        session_destroy();
        header("location: /00_LAB/project2/");
    };
}

// 遊戲時改變money
function changeMoney()
{
    global $dbLink;
    parse_str(file_get_contents('php://input'), $putData);
    $userName  = $putData["userName"];
    $gameMoney = $putData["gameMoney"];
    $commandText =
        "update userinfo "
        . "set gameMoney = '{$gameMoney}'"
        . " where userName = '{$userName}' ";
    mysqli_query($dbLink, $commandText);

    // session_start();
    // $_SESSION["gameMoney"] = $putData["gameMoney"];

    echo  $putData["gameMoney"];
}

function shopCharge()
{
    // echo "OK";

    global $dbLink;
    $commandText =
        "select productID, productName, productTitle,"
        . " price from products ";
    $result = mysqli_query($dbLink, $commandText);

    $datalist = array();
    while ($row = mysqli_fetch_assoc($result)) {
        $datalist[] = $row;
    };
    echo json_encode($datalist);
}
