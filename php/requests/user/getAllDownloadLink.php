<?php session_start();

/*
 *
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
	
	if (isset($_SESSION['user']) ) {
		
		$user = unserialize($_SESSION['user']);
		
		$dir="users/".$user->getLogin()."/archive/franckrp-photos.zip";
		
		$alldownloadfile = "../../../".$dir;
		if (file_exists($alldownloadfile)){
			$link = array ("link"=>$dir);
			echo json_encode($link);
		} else {
			$link = array ("link"=>null);
			echo json_encode($link);
		}
	} else {
		echo $error = array ("error"=>"Non connecté");
		http_response_code(401);
	}
}
?>