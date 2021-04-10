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

	if (isset($_SESSION['user']) && isset($_GET['id']) && isset($_GET['type'])) {
	
	 	$user = unserialize($_SESSION['user']);
		
	 	$login=$user->getLogin();
		
		$type = htmlspecialchars($_GET['type']);
		$image = htmlspecialchars($_GET['id']);
		if ($type =="full"){
			$fileToGet = __DIR__.'/../../../users/'.$login.'/fullsize/'.$image;
			echo file_get_contents($fileToGet);
		}else if ($type=="thumb"){
			echo file_get_contents(__DIR__.'/../../../users/'.$login.'/thumbmails/'.$image);
		} else if ($type=="download"){
			
			$downloadDir = $user->getFreeDownloadDir();
			if ($downloadDir == null || $downloadDir == ""){
				$downloadDir = "fullsize";
			}
			
			if (strpos($image, '/') == FALSE){
				header("Cache-Control: public");
				header("Content-Description: File Transfer");
				header("Content-Disposition: attachment; filename=$image");
				header("Content-Type: application/octet-stream");
				header("Content-Transfer-Encoding: binary");
				header("Content-Length: ".filesize(__DIR__.'/../../../users/'.$login.'/fullsize/'.$image));
				$fileToGet = __DIR__.'/../../../users/'.$login.'/'.$downloadDir.'/'.$image;
				if (!file_exists($fileToGet)){
					$fileToGet = __DIR__.'/../../../users/'.$login.'/fullsize/'.$image;
				}
				readfile($fileToGet);
			} else {
				http_response_code(403);
			}
		}
	} else {
		http_response_code(401);
	}
}
?>  