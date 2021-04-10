<?php session_start();

/*
 *
* VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../controlers/UserControler.php');
include_once(__DIR__.'/../controlers/ServiceConfControler.php');
include_once(__DIR__.'/../tools/MyLogger.php');


// First destroy current session
session_destroy();
session_start();

// Create logger
$logger = new MyLogger();

// Check session expiration
$conf=getConf();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $conf['session_duration']) && $conf['session_duration'] > 0) {
	// last request was more than 30 minutes ago
	session_unset();     // unset $_SESSION variable for the run-time
	session_destroy();   // destroy session data in storage
}
$_SESSION['LAST_ACTIVITY'] = time();

// Do treatments
$aRequest = json_decode(file_get_contents('php://input'));

$login = $aRequest->{'login'};
$password = "";

// Check service configuration if password is enable
$passwordEnable = true;
$conf=ServiceConfControler::getServiceConf(null);
if ($conf->getPasswordEnable() == 0 && $login !="admin"){
	$passwordEnable = false;
} else {
	$password = $aRequest->{'password'};
}

if ($login != "" || $passwordEnable == false ) {
	
	// First check login pattern to avoid sql injection.
	$pattern='/^([^.\/\- ]*)$/';
	if (preg_match($pattern, $login, $matches) == 1){
			
		$user = UserControler::getUser($login);
	
		// Check if password is valid.
		if (($user->isPublic() == 1) || ($user != null && (($user->getPassword() == $password) || ($passwordEnable == false)))) {
			$_SESSION['user'] = serialize($user);
			unset($_SESSION['cart']);
			$logger->info("Logged in as ".$login);
			echo UserControler::getJson($user);
		}
		else {
			echo "Login ou mot de passe de connexion invalide";
			http_response_code(400);
		}
	}
	else {
		echo "Login ou mot de passe de connexion invalide";
		http_response_code(401);
	}
	
}

?>