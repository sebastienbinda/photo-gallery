<?php session_start();

/*
 *
 * VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../controlers/ServiceConfControler.php');
include_once(__DIR__.'/../pojos/User.php');

// Check session expiration
$conf=getConf();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $conf['session_duration']) && $conf['session_duration'] > 0) {
	// last request was more than 30 minutes ago
	session_unset();     // unset $_SESSION variable for the run-time
	session_destroy();   // destroy session data in storage
}

$_SESSION['LAST_ACTIVITY'] = time();

// Do treatments

try {

	$method = $_SERVER['REQUEST_METHOD'];

	$user=null;
	if (isset($_SESSION['user']) ) {
		$user = unserialize($_SESSION['user']);
	}

	switch ($method) {
		// Save a new user
		case 'POST':
			if ($user != null && $user->getLogin()=="admin") {
				saveServiceConf();
					
			} else {
				$error = array ("error"=>"Fonction d'administration non accessible");
				echo json_encode($error);
				http_response_code(403);
			}
			break;
			// Get a user or the curent one
		case 'GET':
			getServiceConf();
			break;
		default:
			error_log("unknown method");
			break;
	}
} catch (Exception $ex) {
	echo $ex->getMessage();
	http_response_code(500);
}

/**
 * Get the service configuration
 *
 */
function getServiceConf(){
	$conf = null;
	$conf = ServiceConfControler::getServiceConf(null);
	if ($conf != null){
		echo ServiceConfControler::getServiceConfToJSON($conf);
	} else {
		error_log("No service configuration found !");
		$error = array ("error"=>"No service configuration found !");
		echo json_encode($error);
		http_response_code(500);
	}
}

function saveServiceConf(){
	$aRequest = json_decode(file_get_contents('php://input'));
		
	$passwordEnable = $aRequest->{'password_enable'};
	
	$conf = new ServiceConf();
	$conf->setPasswordEnable($passwordEnable);
	
	$ret = ServiceConfControler::updateServiceConf($conf, null);
	
	if ($ret = true){
		$response = array ("message"=>"success");
		echo json_encode($response);
	} else {
		$error = array ("error"=>"Service configuration update error !");
		echo json_encode($error);
		http_response_code(500);
	}
}

?>