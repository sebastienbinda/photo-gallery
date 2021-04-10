<?php session_start();

/*
 *
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../controlers/ProductControler.php');
include_once(__DIR__.'/../../pojos/User.php');

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
			
				$products = ProductControler::getAllProducts(null);
				if (sizeof($products) > 0){
					echo ProductControler::getFullProductsToJson($products);
				} else {
					$arr = array();
					echo json_encode($arr);
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