<?php
session_start();
if (isset($_SESSION["userName"])) {
    $userName = $_SESSION["userName"];
};

echo $_SESSION["userName"];
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <input type=”text” value="<?= $userName ?>">
</body>

</html>