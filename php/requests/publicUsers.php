<?php session_start();

/*
 *
* VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../controlers/UserControler.php');

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
				// Nothing todo
				break;
			// Get a user or the curent one
			case 'GET':
				// renvoi la liste des users public
				getPublicUsers();
				break;
			// Delete a user
			case 'DELETE':
				// Nothing to do
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
	 * Get a user with the given login
	 * 
	 * @param unknown $pLogin
	 */
	function getPublicUsers(){
		$user = null;
		$result = Array();
		$users = UserControler::getPublicUsers();
		
		if ($users != null){
			foreach ($users as &$user) {
				$userArray = array ("public"=>$user->isPublic(),
								"login"=>$user->getLogin(),
								"description"=>$user->getDescription());
				
				array_push($result,$userArray);
			}
		}
		echo json_encode($result);
	}
?>