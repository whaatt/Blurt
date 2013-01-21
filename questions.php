<?php

$connection = mysqli_connect("localhost", '', '', '') or die('MYSQL Connection Error'); //Connect
$question = mysqli_query($connection, "SELECT * FROM questions WHERE question != 'undefined' ORDER BY RAND() LIMIT 1") or die(mysqli_error($connection));
$json = (object) array();

while ($row = mysqli_fetch_assoc($question)){
	foreach ($row as $key => $value){
		$json->$key = $value;
	}
}

echo json_encode($json);
mysqli_close($connection);

?>

