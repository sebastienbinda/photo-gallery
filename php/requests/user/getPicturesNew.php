<?php session_start();

/*
 *
* VERSION 2.3 : 15/06/2015 : Création.
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../pojos/User.php');
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
		if ($section != "_root"){
			$thumbdir = $thumbdir.'/'.$section;
			$fulldir = $fulldir.'/'.$section;
		} else {
			$section = "";
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
		
		// Return picture list
		$pictures = array();
		// Return default picture list where research via meta does not give results.
		$defaultPictures = array();
		$nbValidFiles=0;
		$nbDefaultValidFiles=0;
		
		// Full directory to thumbmail
		$dirname = $workspaces.$thumbdir;
		// Read directory to get picture files
		$dir = @opendir($dirname);
		if ($dir !== false){
			$files = array();
			while($file = readdir($dir)) {
				$files[] = $file;
			}
			// Sort by alphabetic order
			natcasesort($files);
		
			// Check files
			foreach ($files as &$file){
				
				$status = isValidFile($dirname,$file,$meta,$default_meta);
				
				if ($status != -1){
					// Increment valid files and defaultFiles number.
					if ($status == 1){
						$nbValidFiles++;
					} else {
						$nbDefaultValidFiles++;
					}
					
					// If valid file and pagination ok then add file to result files.
					if ($nbValidFiles > ($page-1)*$nbByPage && $nbValidFiles <= ($page*$nbByPage) && $status==1){
						$validFile = createFile($section, $dirname, $file, $isAllowDownload, $downloadDir);
						array_push($pictures,$validFile);
					}
					
					// If there is no valid file and it is a default valid file, and pagination ok then add file to result files.
					if ($nbValidFiles==0 && $nbDefaultValidFiles > ($page-1)*$nbByPage && $nbDefaultValidFiles <= ($page*$nbByPage) && $status==0){
						$validFile = createFile($section, $dirname, $file, $isAllowDownload, $downloadDir);
						array_push($defaultPictures,$validFile);
					}
				}
			}
		}
		
		$totalFiles = 0;
		$tagResult = 1;
		if ($nbValidFiles >0){
			$totalFiles=$nbValidFiles;
		} else {
			$totalFiles = $nbDefaultValidFiles;
			$tagResult=0;
			$pictures=$defaultPictures;
		}
		
		$nbPages = $totalFiles/$nbByPage;
		$nbPages=ceil($nbPages);
		
		$firstindex=(($page-1)*$nbByPage)+1;
		$result = array("nbpictures"=>$totalFiles,"nbpages"=>$nbPages,"firstindex"=>$firstindex,"pictures"=>$pictures,"tagResult"=>$tagResult);
		
		echo json_encode($result);
	}
}

/**
 * Check if file is valid regarding to keyword search if any
 * 
 * @param unknown $dirname
 * @param unknown $file
 * @param unknown $keyword
 * @param unknown $defaultKeyWords
 * @return number
 */
function isValidFile($dirname, $file, $keyword, $defaultKeyWords){
	
	$logger = new MyLogger();
	
	// Init return value
	$valid = -1;
	
	// Check filename
	if($file != '.' && $file != '..' && !is_dir($dirname.'/'.$file)){
		
		// If a keyword is given, check if file contains it.
		if ($keyword != null){
			
			// Read from XMP
			$xmp = XMPReader::read($dirname.'/'.$file);
			
			// Check result is valid
			if (!isset($xmp) || !isset($xmp['Keywords'])){
				$logger->error("No keyword information in file ".$dirname.'/'.$file);
				return -1;
			}
			
			// Get keywords from XMP
			$fileKeywords=$xmp['Keywords'];
			
			// Check result format
			if (!is_array($fileKeywords)){
				$fileKeywords = array([$fileKeywords]);
			}
			
			// Check if keyword is in file or if any default keyword is in file
			if (in_array($keyword, $fileKeywords)){
				// Valid file. Keyword match.
				return 1;
			} else if ($defaultKeyWords != null){
				foreach ($defaultKeyWords as &$default){
					if (in_array($default,$fileKeywords)){
						// Default valid file. Default Keyword match.
						$valid = 0;
						break;
					}
				}
			}
			
			
		} else {
			$valid = 1;
		}
	}
	
	return $valid;
}

/**
 * 
 * Create a file JSON format for result files.
 * 
 * @param unknown $section
 * @param unknown $dirname
 * @param unknown $file
 * @param unknown $isAllowDownload
 * @param unknown $downloadDir
 * @return Ambigous <multitype:string unknown , multitype:string number unknown >
 */
function createFile($section, $dirname, $file, $isAllowDownload, $downloadDir){
	// Calculate thumbmails size
	$fp = getimagesize($dirname.'/'.$file);
	$maxsize=200;
	$ratio=1;
	if ($fp[0] > $fp[1]){
		$ratio=($fp[0]/$maxsize);
	} else {
		$ratio=($fp[1]/$maxsize);
	}
	$width=$fp[0]/$ratio;
	$height=$fp[1]/$ratio;
	
	// get filename without extension
	$fileWithoutExt = strstr($file,'.',true);
		
	// Create download link if user is allowed to download free
	if ($isAllowDownload){
		$url_access = $downloadDir.'/'.$file;
		$fileJson = array("name"=>$fileWithoutExt,"thumb_width"=>$width,"thumb_height"=>$height,"fullname"=>$section.'/'.$file,"url_access"=>$url_access);
	} else {
		$fileJson = array("name"=>$fileWithoutExt,"thumb_width"=>$width,"thumb_height"=>$height,"fullname"=>$section.'/'.$file);
	}
	
	return $fileJson;
}