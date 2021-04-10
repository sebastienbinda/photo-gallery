<?php 

/*
 *
* VERSION 2.3 : 20/06/2015 : Création
*
* @author: S.Binda
* 
*/
include_once(__DIR__.'/../tools/DataBase.php');
include_once(__DIR__.'/../pojos/Picture.php');
include_once(__DIR__.'/../tools/XMPReader.php');
include_once(__DIR__.'/../tools/MyLogger.php');

class PictureControler {
	
	public static function indexPictures($pUserLogin){
		
		// Create logger
		$logger = new MyLogger();
		
		$logger->info("Start indexing pictures for user ".$pUserLogin);

		$logger->info("Deleting old index for user ".$pUserLogin);
		self::deleteIndex($pUserLogin);
		$logger->info("Deleting old index for user ".$pUserLogin." OK !");
		
		// Workspace directory
		$workspaces = __DIR__."/../../";
		// Directory for thumbails images
		$thumbdir = "users/".$pUserLogin."/thumbmails";
		// Directory for fullsize image with copyrights
		$fulldir = "users/".$pUserLogin."/fullsize";
		
		// Full directory to thumbmail
		$dirname = $workspaces.$thumbdir;
		
		$db = new DataBase();
		if ($db->connect()){
			try {
				self::indexPictureDirectory($pUserLogin, $dirname,"/", $db);
				$db->disconnect();
			} catch (Exception $e){
				$db->disconnect();
			}
		}
		$total = self::countPictures($pUserLogin,null,null);
		$logger->info("End indexing pictures for user ".$pUserLogin." OK ! . Nb pictures indexed : ".$total);
		
	}
	
	private static function indexPictureDirectory($pUserLogin, $pDirectory, $pSection,$pDb){
		
		$dirname = $pDirectory.$pSection;
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
		
				if($file != '.' && $file != '..'){
					if (is_dir($dirname.'/'.$file)) {
						if (mb_substr($pSection,-1) == "/"){
							self::indexPictureDirectory($pUserLogin,$pDirectory,$pSection.$file,$pDb);
						} else {
							self::indexPictureDirectory($pUserLogin,$pDirectory,$pSection.'/'.$file,$pDb);
						}
					} else {
						
						// Read XMP
						$xmp = XMPReader::read($dirname.'/'.$file);
						
						if (isset($xmp) && isset($xmp['Keywords'])){
							$fileKeywords=$xmp['Keywords'];
						} else {
							$fileKeywords = null;
						}
						
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
						
						$picture = new Picture();
						$picture->setUserLogin($pUserLogin);
						$picture->setName($file);
						$picture->setSection($pSection);
						$picture->setThumbWidth($width);
						$picture->setThumbHeight($height);
						if ($fileKeywords != null){
							foreach ($fileKeywords as &$keyword){
								$picture->setKeyword($keyword);
								self::addPicture($picture,$pDb);
								
								// Check if there is another keyword associated to this one in the equivalence csv file
								
							}
						} else {
							self::addPicture($picture,$pDb);
						}
					}
				}
		
			}
				
		}
	}
	
	public static function readCsvFile($pFile){
		return array_map('str_getcsv', file($pFile));
	}
	
	private static function addPicture($pPicture,$pDb){
		
		$ret = false;
		$query = "INSERT INTO t_picture (user_login, name, section, thumb_width, thumb_height, keyword)";
		$query = $query."VALUES ('".$pPicture->getUserLogin()."','";
		$query = $query.$pPicture->getName()."','";
		$query = $query.$pPicture->getSection()."','";
		$query = $query.$pPicture->getThumbWidth()."','";
		$query = $query.$pPicture->getThumbHeight()."','";
		$query = $query.$pPicture->getKeyword()."');";
			
		$result = $pDb->execute($query);
		$pPicture->setId($pDb->getLastId());
		
		if ($result){
			$ret = true;
		}
		return $ret;
		
	}
	
	public static function searchPicture($pUserLogin,$keywords,$pSection,$startIndex,$pNbByPage){
		
		$pictures = null;
		
		$db = new DataBase();
		$user = null;
		
		try {
			if ($db->connect()){
					
				$result = null;
				
				$keywordsString = null;
				if ($keywords != null){
					foreach ($keywords as &$keyword){
						if ($keywordsString != null){
							$keywordsString = $keywordsString.",'".$keyword."'";
						} else {
							$keywordsString ="'".$keyword."'";
						}
					}
				}
				$offset =" LIMIT ".$pNbByPage. " OFFSET ".$startIndex;
				
				$whereString = " WHERE BINARY user_login='".$pUserLogin."'";
				if ($keywordsString != null){
					$whereString = $whereString." AND keyword in (".$keywordsString.")";
				}
				
				if ($pSection != null){
					$whereString = $whereString." AND section='".$pSection."'";
				}
				
				$result = $db->execute("SELECT distinct user_login,name,section,thumb_width,thumb_height from t_picture ".$whereString.$offset.";");
				
				if ($result !== null){
					while($obj = $result->fetch_object()){
						if ($obj->name !== null && $obj->name != ""){
							$picture = new Picture();
							$picture->setUserLogin($obj->user_login);
							$picture->setName($obj->name);
							$picture->setSection($obj->section);
							$picture->setThumbWidth($obj->thumb_width);
							$picture->setThumbHeight($obj->thumb_height);
				
							$pictures[] = $picture;
						}
					}
					$result->close();
				}
				
				$db->disconnect();
			}
		} catch (Exception $e){
			$db->disconnect();
		}
		return $pictures;
	}
	
	public static function countPictures($pUserLogin,$keywords,$pSection){

		$db = new DataBase();
		$user = null;
		
		$total=0;
		
		try {
			if ($db->connect()){
					
				$result = null;
		
				$keywordsString = null;
				if ($keywords != null){
					foreach ($keywords as &$keyword){
						if ($keywordsString != null){
							$keywordsString = $keywordsString.",'".$keyword."'";
						} else {
							$keywordsString ="'".$keyword."'";
						}
					}
				}
		
				$whereString = " WHERE BINARY user_login='".$pUserLogin."'";
				if ($keywordsString != null){
					$whereString = $whereString." AND keyword in (".$keywordsString.")";
				}
		
				if ($pSection != null){
					$whereString = $whereString." AND section='".$pSection."'";
				}
		
				$result = $db->execute("SELECT distinct user_login,name,section,thumb_width,thumb_height from t_picture ".$whereString.";");
				
				if ($result != null){
					// Calculate total nb results
					$result = $db->execute("SELECT count(distinct user_login, name, section) from t_picture".$whereString);
					$row = $result->fetch_row();
					$total=$row[0];
					$result->close();
				}
		
				$db->disconnect();
			}
		} catch (Exception $e){
			$db->disconnect();
		}
		return $total;
	}
	
	
	private static function deleteIndex($pUserLogin){
		
		$db = new DataBase();
		$user = null;
		
		try {
			if ($db->connect()){
				
				$query = "DELETE FROM t_picture WHERE user_login='".$pUserLogin."';";
				$result = $db->execute($query);
				if ($result){
					$ret = true;
				}
				
				$db->disconnect();
			}
		} catch (Exception $e){
			$db->disconnect();
		}
		
	}
	
	public static function searchPictureFromDb($user,$downloadDir, $section, $meta, $allMeta, $default_meta, $page, $nbByPage){
		$tagResult = 1;
		$start=$nbByPage*($page-1);
		
		$keywords=null;
		if ($meta != null && $meta != ""){
			$keywords = Array();
			array_push($keywords,$meta);
			if ($allMeta != null && $allMeta != ""){
				array_push($keywords,$allMeta);
			}
		}
		
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
		
		$isAllowDownload=$user->isAllowDownload() == 1 ? true : false;
		
		$result = array();
		if ($pictures != null){
			foreach ($pictures as &$picture){
				
				$sectionStr = $picture->getSection();
				if (strrpos($sectionStr,'/') == (strlen($sectionStr)-1)) {
					$sectionStr = substr($sectionStr, 0, -1);
				}
				
				if ($isAllowDownload){
					$url_access = $downloadDir.'/'.$sectionStr.'/'.$picture->getName();
					$fileJson = array("name"=>$picture->getName(),"thumb_width"=>$picture->getThumbWidth(),"thumb_height"=>$picture->getThumbHeight(),"fullname"=>$sectionStr.'/'.$picture->getName(),"url_access"=>$url_access);
				} else {
					$fileJson = array("name"=>$picture->getName(),"thumb_width"=>$picture->getThumbWidth(),"thumb_height"=>$picture->getThumbHeight(),"fullname"=>$sectionStr.'/'.$picture->getName());
				}
		
				array_push($result,$fileJson);
			}
		}
		
		$nbPages = $total/$nbByPage;
		$nbPages=ceil($nbPages);
		$resultJson = array("nbpictures"=>$total,"nbpages"=>$nbPages,"firstindex"=>$start+1,"pictures"=>$result,"tagResult"=>$tagResult);
		
		return $resultJson;
	}
	
	
	public static function searchPicturesFromDisk($dirname, $section, $isAllowDownload, $downloadDir, $meta, $allMeta, $default_meta, $page, $nbByPage){
		// Return picture list
		$pictures = array();
		// Return default picture list where research via meta does not give results.
		$defaultPictures = array();
		$nbValidFiles=0;
		$nbDefaultValidFiles=0;
		
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
		
				$status = self::isValidFile($dirname,$file,$meta,$allMeta,$default_meta);
		
				if ($status != -1){
					// Increment valid files and defaultFiles number.
					if ($status == 1){
						$nbValidFiles++;
					} else {
						$nbDefaultValidFiles++;
					}
						
					// If valid file and pagination ok then add file to result files.
					if ($nbValidFiles > ($page-1)*$nbByPage && $nbValidFiles <= ($page*$nbByPage) && $status==1){
						$validFile = self::createFile($section, $dirname, $file, $isAllowDownload, $downloadDir);
						array_push($pictures,$validFile);
					}
						
					// If there is no valid file and it is a default valid file, and pagination ok then add file to result files.
					if ($nbValidFiles==0 && $nbDefaultValidFiles > ($page-1)*$nbByPage && $nbDefaultValidFiles <= ($page*$nbByPage) && $status==0){
						$validFile = self::createFile($section, $dirname, $file, $isAllowDownload, $downloadDir);
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
		
		return $result;
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
	private static function isValidFile($dirname, $file, $keyword,$allKeyword, $defaultKeyWords){
	
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
				foreach ($fileKeywords as &$key){
					if (is_string($key)){
						if (strcasecmp($key,$keyword) == 0 || strcasecmp($key,$allKeyword) == 0){
							return 1;
						}
					}
				}
				
				foreach ($fileKeywords as &$key){
					if (is_string($key)){
						foreach ($defaultKeyWords as &$default){
							if (strcasecmp($key,$default) == 0){
								// Default valid file. Default Keyword match.
								$valid = 0;
								break;
							}
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
	private static function createFile($section, $dirname, $file, $isAllowDownload, $downloadDir){
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
	
		$downloadDirStr = $downloadDir;
		if (strrpos($downloadDirStr,'/') == (strlen($downloadDirStr)-1)) {
			$downloadDirStr = substr($downloadDirStr, 0, -1);
		}
			
		$sectionStr = $section;
		if (strrpos($sectionStr,'/') == (strlen($sectionStr)-1)) {
			$sectionStr = substr($sectionStr, 0, -1);
		}
		
		// Create download link if user is allowed to download free
		if ($isAllowDownload){
			$url_access = $downloadDirStr.'/'.$file;
			$fileJson = array("name"=>$fileWithoutExt,"thumb_width"=>$width,"thumb_height"=>$height,"fullname"=>$sectionStr.'/'.$file,"url_access"=>$url_access);
		} else {
			$fileJson = array("name"=>$fileWithoutExt,"thumb_width"=>$width,"thumb_height"=>$height,"fullname"=>$sectionStr.'/'.$file);
		}
	
		return $fileJson;
	}
	
	public static function getSubSectionsFromDisk($userLogin,$section){
		$arr = [];
		
		$workspaces = __DIR__."/../../";
		
		$thumbdir = "users/".$userLogin."/thumbmails";
		$fulldir = "users/".$userLogin."/fullsize";
		
		$dirname = $workspaces.$thumbdir.'/'.$section;
		$fulldirname = $workspaces.$fulldir.'/'.$section;
		
		$dir = @opendir($dirname);
		if ($dir !== false){
			$files = array();
			while($file = readdir($dir)) {
				$files[] = $file;
			}
			natcasesort($files);
		
			foreach ($files as &$directory){
				if($directory != '.' && $directory != '..' && is_dir($dirname.'/'.$directory))
				{
					if (file_exists($fulldirname.'/'.$directory)){
						array_push($arr,$directory);
					}
				}
			}
			
			closedir($dir);
		}
		return $arr;
	}
	
	
	public static function getSubSectionsFromDb($userLogin,$section){

		$db = new DataBase();
		$user = null;
		
		$total=0;
		
		$subsections = Array();
		
		try {
			if ($db->connect()){
					
				$result = null;
		
				$sectionToSearch = $section;
				if (strrpos($section,'/') == (strlen($section)-1)){
					$sectionToSearch = $section.'%';
				} else {
					$sectionToSearch = $section.'/%';
				}
				$whereString = " WHERE user_login='".$userLogin."' AND SECTION like'".$sectionToSearch."'";
						
				$result = $db->execute("SELECT distinct section from t_picture ".$whereString.";");
		
				if ($result !== null){
					while($obj = $result->fetch_object()){
						if ($obj->section !== null){
							$subsec=$obj->section;
							if (strrpos($subsec,'/') == strrpos($sectionToSearch,'/')){
								$subsecResult = $subsec;
								if (strrpos($subsec,'/') == (strlen($subsec)-1)) {
									$subsec = substr($subsec, 0, -1);
								} 
								
								if (strrpos($subsec,'/') != 0){
									$subsec = substr($subsec,strrpos($subsec,'/'),strlen($subsec));
								}
								
								if (strpos($subsec,'/') == 0){
									$subsec = substr($subsec,1,strlen($subsec));
								}
								$subsections[] = $subsec;
							}
						}
					}
					$result->close();
				}
		
				$db->disconnect();
			}
		} catch (Exception $e){
			$db->disconnect();
		}
		return $subsections;
		
	}
	
}

?>