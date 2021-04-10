<?php session_start();

/*
 *
 * VERSION 2.3 : 25/06/2015 : Ajout de l'indexation des photos.
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../controlers/PictureControler.php');
include_once(__DIR__.'/../../controlers/UserControler.php');
include_once(__DIR__.'/../../pojos/User.php');
include_once(__DIR__.'/../../tools/MyLogger.php');
// Create logger
$logger = new MyLogger();


// Check session expiration
$conf=getConf();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $conf['session_duration']) && $conf['session_duration'] > 0) {
	// last request was more than 30 minutes ago
	session_unset();     // unset $_SESSION variable for the run-time
	session_destroy();   // destroy session data in storage
	http_response_code(401);
} else {
	$_SESSION['LAST_ACTIVITY'] = time();

	// Do treatments

	try {
		
		
		if (isset($_SESSION['user']) ) {
		
			$user = unserialize($_SESSION['user']);
		
			if ($user->getLogin() == "admin") {
				
				if (isset($_GET['login']) && $_GET['login'] != ""){
					
					// Get the user to index
					$userToIndex = UserControler::getUser($_GET['login']);
					
					$csvFile = __DIR__."/../../../users/".$_GET['login']."/".$_GET['login'].".csv";
					$logger->info($csvFile);
					$csv = null;
					if (file_exists($csvFile)){
						$logger->info("exists");
						$csv = PictureControler::readCsvFile($csvFile);
					}
					
					$logger->info(print_r($csv,true));
					
					PictureControler::indexPictures($_GET['login'], $csv);
					
					// Update user
					$userToIndex->setIndexed(1);
					UserControler::updateUser($userToIndex);
				} else {
					$error = array ("error"=>"Login utilisateur invalide");
					echo json_encode($error);
					http_response_code(500);
				}
			}  else {
				$error = array ("error"=>"Fonction d'administration non accessible");
				echo json_encode($error);
				http_response_code(403);
			}
			
		} else {
			$error = array ("error"=>"Fonction d'administration non accessible");
			echo json_encode($error);
			http_response_code(403);
		}
	} catch (Exception $ex) {
		echo $ex->getMessage();
		http_response_code(500);
	}
}
?>