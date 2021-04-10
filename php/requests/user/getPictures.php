<?php session_start();

/*
 *
* VERSION 2.3 : 25/06/2015 : Ajout de l'indexation des photos.
* VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../pojos/User.php');
include_once(__DIR__.'/../../controlers/PictureControler.php');
include_once(__DIR__.'/../../tools/MyLogger.php');
include_once(__DIR__.'/../../tools/XMPReader.php');

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

	if (isset($_SESSION['user']) ) {
		$user = unserialize($_SESSION['user']);
		
		//Read configuration file
		$conf = parse_ini_file(__DIR__."/../../conf/app.conf");
		
		// Workspace directory
		$workspaces = __DIR__."/../../../";
		// Directory for thumbails images
		$thumbdir = "users/".$user->getLogin()."/thumbmails";
		// Directory for fullsize image with copyrights
		$fulldir = "users/".$user->getLogin()."/fullsize";
		
		// Read parameters
		$page=$_GET['page'];
		$section=$_GET['section'];
		// Section (sub-directories)
		if ($section == '_root' || $section == null){
			$section="/";
		} else {
			$thumbdir = $thumbdir.'/'.$section;
			$fulldir = $fulldir.'/'.$section;
		}
		
		// Free download allowed ?
		$isAllowDownload = $user->isAllowDownload() == 1 ? true : false;
		$downloadDir = "users/".$user->getLogin()."/".$user->getFreeDownloadDir();
		
		$meta=null;
		// Read meta value to search if any
		if (isset($_GET['meta'])){
			if ($_GET['meta'] != ""){
				$meta = $_GET['meta'];
			}
		}
		
		// Meta for all search
		$allMeta = null;
		if (isset($conf['allMeta'])){
			$allMeta = $conf['allMeta'];
		}
		
		// get nb pictures by page
		$nbByPage=$user->getNbPicturesByPage();
		if ($nbByPage == 0){
			$nbByPage = 50;
		}
		
		// Get default metas
		$tags=$user->getDefaultSearchTags();
		$default_meta = null;
		if (isset($tags) && $tags != null){
			// Split with ';' caracters
			$default_meta=split(';',$tags);
		}
		
		// Full directory to thumbmail
		$dirname = $workspaces.$thumbdir;
		
		$pictures = Array();
		// Is the user indexed
		if ($user->getIndexed() == 0){
			$logger->info("Recherche des photos sur disk");
			$pictures = PictureControler::searchPicturesFromDisk($dirname, $section, $isAllowDownload, $downloadDir, $meta, $allMeta, $default_meta, $page, $nbByPage);
			$logger->info("Fin Recherche des photos sur disk");
		} else {
			$logger->info("Recherche des photos en BD");
			$pictures = PictureControler::searchPictureFromDb($user,$downloadDir, $section, $meta,$allMeta ,$default_meta, $page, $nbByPage);
			$logger->info("Fin Recherche des photos en BD");
		}
		
		echo json_encode($pictures);
	}
	
}

?>