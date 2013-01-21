<?php

$file = 'questions.json';
$handle = fopen($file, 'r');

$connection = mysqli_connect("localhost", '', '', '') or die('MYSQL Connection Error'); //Connect

$json = fread($handle, filesize($file));
$result = json_decode($json);

foreach ($result as $key => $item) {
	foreach($item as $parameter => $value) {
		$result[$key]->$parameter = mysqli_real_escape_string($connection, $value);
    }
}

foreach($result as $key => $value) {
	//uncomment for this to work
    //mysqli_query($connection, "INSERT INTO questions (id, author, uploader, mode, difficulty, subject, type, question, W, X, Y, Z, letter, answer) VALUES 
	//	('$value->id', '$value->author', '$value->uploader', '$value->mode', '$value->difficulty', '$value->subject', '$value->type', '$value->question', '$value->W', '$value->X', '$value->Y', '$value->Z', '$value->letter', '$value->answer')") or die(mysqli_error($connection));
}

mysqli_close($connection);

?>