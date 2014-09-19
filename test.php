<?php

$result['result'] = false;
//See if the code has sent a new score
if ($_POST['name'] && !empty($_POST['name']) 
	&& 
	$_POST['score'] && !empty($_POST['score'])) {

		//Get the json file with the highscores(They are sorted from highest to lowest score)
		$file = file_get_contents("timen.txt");

		$object = json_decode($file);
		$newScores = array();
		$counter = 1;

		foreach ($object->player as $player) {
		
			//Only allow 10 records in the array(top 10)
			if ($counter <= 10) {
				//If the score of the posted player is higher than the score of the current highscore player push the player infront of it
				//Therefore claiming it's rightful place in the scoreboards. Reset his score so it won't be pushed a second time and higher the counter(It's a record added to the top 10)
				
				if ($_POST['score'] >= $player->score) {
					$newScores['player'][] = array('name' => $_POST['name'], 'score' => $_POST['score']);
					$_POST['score'] = false;
					$counter++;
				}

				//Push the scoreboard player in the new scores array
				$newScores['player'][] = array('name' => $player->name, 'score' => $player->score);
			}
			$counter++;
		}

		//if the counter isn't 10 yet and the score isn't reset. It's save to assume that the playerscore is the lowest ranking but still should be in the top 10.
		//Add it here
		if ($counter < 10 && $_POST['score'] != false) {
			$newScores['player'][] = array('name' => $_POST['name'], 'score' => $_POST['score']);
			$_POST['score'] = false;
		}


		//Save the new scores

		file_put_contents('timen.txt', json_encode($newScores));
		$result['result'] = true;
		$result['highscores'] = $newScores;
}
header('Content-Type: application/json');
echo json_encode($result);
?>