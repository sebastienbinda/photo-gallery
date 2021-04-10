<?php session_start();

/*
 * VERSION 2.3 : 25/06/2015 : Ajout de l'indexation des photos.
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../pojos/User.php');
include_once(__DIR__.'/../../tools/MyLogger.php');
include_once(__DIR__.'/../../controlers/PictureControler.php');

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
		
		$tagResult = 1;
		
		$user = unserialize($_SESSION['user']);
		
		// Get default metas
		$tags=$user->getDefaultSearchTags();
		$default_meta = null;
		if (isset($tags) && $tags != null){
			// Split with ';' caracters
			$default_meta=split(';',$tags);
		}
		
		// Read parameters
		$page=$_GET['page'];
		$section=$_GET['section'];
		
		if ($section == '_root' || $section == null){
			$section="/";
		}
		$keywords = null;
		if (isset($_GET['meta'])){
			if ($_GET['meta'] != ""){
				$meta = $_GET['meta'];
				$keywords = array();
				array_push($keywords,$meta);
			}
		}
		
		// get nb pictures by page
		$nbByPage=$user->getNbPicturesByPage();
		if ($nbByPage == 0){
			$nbByPage = 50;
		}
		
		$start=$nbByPage*($page-1);
		
		$isAllowDownload = $user->isAllowDownload() == 1 ? true : false;
		$downloadDir = "users/".$user->getLogin()."/".$user->getFreeDownloadDir();
		
		$tagResult = 1;
		$total=PictureControler::countPictures($user->getLogin(),$keywords,$section);
		$pictures = null;
		if ($total > 0){
			$pictures = PictureControler::searchPicture($user->getLogin(),$keywords,$section,$start,$nbByPage);
		} else if ($default_meta != null){
			$total=PictureControler::countPictures($user->getLogin(),$default_meta,$section);
			if ($total > 0){
				$pictures = PictureControler::searchPicture($user->getLogin(),$default_meta,$section,$start,$nbByPage);
				$tagResult = 0;
			}
		}
		
		$result = array();
		if ($pictures != null){
			foreach ($pictures as &$picture){
				if ($isAllowDownload){
					$url_access = $downloadDir.'/'.$picture->getSection().'/'.$picture->getName();
					$fileJson = array("name"=>$picture->getName(),"thumb_width"=>$picture->getThumbWidth(),"thumb_height"=>$picture->getThumbHeight(),"fullname"=>$picture->getSection().'/'.$picture->getName(),"url_access"=>$url_access);
				} else {
					$fileJson = array("name"=>$picture->getName(),"thumb_width"=>$picture->getThumbWidth(),"thumb_height"=>$picture->getThumbHeight(),"fullname"=>$picture->getSection().'/'.$picture->getName());
				}
				
				array_push($result,$fileJson);
			}
		}
		
		$nbPages = $total/$nbByPage;
		$nbPages=ceil($nbPages);
		$resultJson = array("nbpictures"=>$total,"nbpages"=>$nbPages,"firstindex"=>$start+1,"pictures"=>$result,"tagResult"=>$tagResult);
		
		echo json_encode($resultJson);
		
	}
}
		