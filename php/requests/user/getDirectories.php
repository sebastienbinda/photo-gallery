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
include_once(__DIR__.'/../../controlers/PictureControler.php');

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
		
		// Read parameters
		$section=$_GET['section'];
		
		//Read configuration file
		$conf = parse_ini_file(__DIR__."/../../conf/app.conf");
		
		$workspaces = __DIR__."/../../../";
		
		$thumbdir = "users/".$user->getLogin()."/thumbmails";
		$fulldir = "users/".$user->getLogin()."/fullsize";
		
		$dirname = $workspaces.$thumbdir.'/'.$section;
		$fulldirname = $workspaces.$fulldir.'/'.$section;
		
		$subsections = [];
		
		if ($user->getIndexed() == 0){
			$subsections = PictureControler::getSubSectionsFromDisk($user->getLogin(),$section);
		} else {
			$subsections = PictureControler::getSubSectionsFromDb($user->getLogin(),$section);
		}
		
		$result = [];
		
		if (sizeof($subsections) > 0) {
			foreach ($subsections as &$subsec){
			
				if ($subsec != null && file_exists($dirname.'/'.$subsec)){
							
					if (file_exists($dirname.'/'.$subsec.'/'.$subsec.".jpg") ) {
						$directoryJson = array("name"=>utf8_encode($subsec),"image"=>utf8_encode($dirname.'/'.$subsec.'/'.$subsec.".jpg"));
					}
					else {
						$directoryJson = array("name"=>utf8_encode($subsec),"image"=>null);
					}
					array_push($result,$directoryJson);
				}
	
			}
		}
		
		echo json_encode($result);
	}
}