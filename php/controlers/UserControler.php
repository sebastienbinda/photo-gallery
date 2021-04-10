<?php 

/*
 *
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 1.0 : 08/07/2014 : Création
 *
 * @author: S.Binda
 * 
*/

include_once(__DIR__.'/../tools/DataBase.php');
include_once(__DIR__.'/../pojos/User.php');

class UserControler {

	public static function getAllUsers($db){
		
		$dbSupplied=true;
		if ($db == null){
			$dbSupplied=false;
			$db = new DataBase();
		}
		
		if ($db->connect()){
			
			$result = null;
			$users = null;
		
			$result = $db->execute("SELECT public,login,password,description,long_description,
					allow_download,nb_pictures_by_page,nb_products_min,section_display_mode,
					 section_info_description, display_picture_names, free_download_dir,
					 display_search_view, search_infos_description,search_placeholder, default_search_tags, indexed from t_user;");
			
			if ($result !== null){
				while($obj = $result->fetch_object()){
					$user = new User();
					$user->setPublic($obj->public);
					$user->setLogin($obj->login);
					$user->setPassword($obj->password);
					$user->setDescription($obj->description);
					$user->setLongDescription($obj->long_description);
					$user->setAllowDownload($obj->allow_download);
					$user->setNbPicturesByPage($obj->nb_pictures_by_page);
					$user->setNbProductsMin($obj->nb_products_min);
					$user->setSectionDisplayMode($obj->section_display_mode);
					$user->setSectionInfoDescription($obj->section_info_description);
					$user->setDisplayPictureNames($obj->display_picture_names);
					$user->setFreeDownloadDir($obj->free_download_dir);
					$user->setDisplaySearchView($obj->display_search_view);
					$user->setSearchInfosDescription($obj->search_infos_description);
					$user->setSearchPlaceHolder($obj->search_placeholder);
					$user->setDefaultSearchTags($obj->default_search_tags);
					$user->setIndexed($obj->indexed);
					$users[] = $user;
				}
				$result->close();
			}
			if (!$dbSupplied){
				$db->disconnect();
			}
		}
		return $users;
		
	}
	
	public static function addUser($pUser){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$description = str_replace("'","''",$pUser->getDescription());
			$longDescription = str_replace("'","''",$pUser->getLongDescription());
			$sectionInfoDescription = str_replace("'","''",$pUser->getSectionInfoDescription());
			$query = "INSERT INTO t_user (public, login,password,description,long_description,allow_download,
					nb_pictures_by_page,nb_products_min,section_display_mode,
					section_info_description, display_picture_names, free_download_dir, display_search_view,
					search_infos_description, search_placeholder, default_search_tags)";
			$query = $query."VALUES ('".$pUser->isPublic()."','";
			$query = $query.$pUser->getLogin()."','";
			$query = $query.$pUser->getPassword()."','";
			$query = $query.$description."','";
			$query = $query.$longDescription."','";
			$query = $query.$pUser->isAllowDownload()."','";
			$query = $query.$pUser->getNbPicturesByPage()."','";
			$query = $query.$pUser->getNbProductsMin()."','";
			$query = $query.$pUser->getSectionDisplayMode()."','";
			$query = $query.$sectionInfoDescription."','";
			$query = $query.$pUser->getDisplayPictureNames()."','";
			$query = $query.$pUser->getFreeDownloadDir()."','";
			$query = $query.$pUser->getDisplaySearchView()."','";
			$query = $query.$pUser->getSearchInfosDescription()."','";
			$query = $query.$pUser->getSearchPlaceHolder()."','";
			$query = $query.$pUser->getDefaultSearchTags()."');";
			
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}				
			$db->disconnect();
		}
		return $ret;
	}
	
	public static function deleteUser($pUser){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "DELETE FROM t_user WHERE LOGIN='".$pUser->getLogin()."';";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	public static function updateUser($pUser){
		$ret = false;
		$description = str_replace("'","''",$pUser->getDescription());
		$longDescription = str_replace("'","''",$pUser->getLongDescription());
		$sectionInfoDescription = str_replace("'","''",$pUser->getSectionInfoDescription());
		$query = "UPDATE t_user SET PASSWORD='".$pUser->getPassword();
		$query = $query."', PUBLIC='".$pUser->isPublic();
		$query = $query."', DESCRIPTION='".$description;
		$query = $query."', LONG_DESCRIPTION='".$longDescription;
		$query = $query."', ALLOW_DOWNLOAD='".$pUser->isAllowDownload();
		$query = $query."', NB_PICTURES_BY_PAGE='".$pUser->getNbPicturesByPage();
		$query = $query."', NB_PRODUCTS_MIN='".$pUser->getNbProductsMin();
		$query = $query."', SECTION_DISPLAY_MODE='".$pUser->getSectionDisplayMode();
		$query = $query."', SECTION_INFO_DESCRIPTION='".$sectionInfoDescription;
		$query = $query."', DISPLAY_PICTURE_NAMES='".$pUser->getDisplayPictureNames();
		$query = $query."', FREE_DOWNLOAD_DIR='".$pUser->getFreeDownloadDir();
		$query = $query."', DISPLAY_SEARCH_VIEW='".$pUser->getDisplaySearchView();
		$query = $query."', SEARCH_INFOS_DESCRIPTION='".$pUser->getSearchInfosDescription();
		$query = $query."', SEARCH_PLACEHOLDER='".$pUser->getSearchPlaceHolder();
		$query = $query."', DEFAULT_SEARCH_TAGS='".$pUser->getDefaultSearchTags();
		$query = $query."', INDEXED='".$pUser->getIndexed();
		$query = $query."' WHERE LOGIN='".$pUser->getLogin()."';";
		
		$db = new DataBase();
		if ($db->connect()){
				
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	public static function deleteUserProducts($pUserLogin){
		
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "DELETE FROM ta_user_product WHERE username='".$pUserLogin."';";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
		
	}
	
	public static function getUser($pUserLogin){

		$db = new DataBase();
		$user = null;

		try {
			if ($db->connect()){
					
				$result = null;
			
				$result = $db->execute("SELECT public, login,password,description,long_description,
						allow_download,nb_pictures_by_page,nb_products_min,
						section_display_mode,section_info_description, display_picture_names, free_download_dir,
						display_search_view, search_infos_description,search_placeholder, default_search_tags, indexed 
						from t_user WHERE BINARY login='".$pUserLogin."';");
					
				if ($result !== null){
					while($obj = $result->fetch_object()){
						$user = new User();
						$user->setPublic($obj->public);
						$user->setLogin($pUserLogin);
						$user->setPassword($obj->password);
						$user->setDescription($obj->description);
						$user->setLongDescription($obj->long_description);
						$user->setAllowDownload($obj->allow_download);
						$user->setNbPicturesByPage($obj->nb_pictures_by_page);
						$user->setNbProductsMin($obj->nb_products_min);
						$user->setSectionDisplayMode($obj->section_display_mode);
						$user->setSectionInfoDescription($obj->section_info_description);
						$user->setDisplayPictureNames($obj->display_picture_names);
						$user->setFreeDownloadDir($obj->free_download_dir);
						$user->setDisplaySearchView($obj->display_search_view);
						$user->setSearchInfosDescription($obj->search_infos_description);
						$user->setSearchPlaceHolder($obj->search_placeholder);
						$user->setDefaultSearchTags($obj->default_search_tags);
						$user->setIndexed($obj->indexed);
					}
					$result->close();
				}
			
				$db->disconnect();
			}
		} catch (Exception $e){
			$user = null;
		}
		return $user;
	}
	
	public static function setProductsToUser($pUserLogin,$products){
		
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			if(is_array($products) && count($products) > 0) {
				// First delete all products associated to the given user.
				if (self::deleteUserProducts($pUserLogin)){
					foreach ($products as &$product) {
						$query = "INSERT INTO ta_user_product (productid,username) VALUES('".$product->id."','".$pUserLogin."');";
						$result = $db->execute($query);
					}
					$ret=true;
				}
			}
			
			if (!$ret){
				$db->rollback();
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	public static  function getPublicUsers(){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$result = null;
			$users = null;
			
			$result = $db->execute("SELECT public,login,description from t_user where public=1 order by login;");
				
			if ($result !== null){
				while($obj = $result->fetch_object()){
					$user = new User();
					$user->setPublic($obj->public);
					$user->setLogin($obj->login);
					$user->setDescription($obj->description);
					$users[] = $user;
				}
				$result->close();
			}
			$db->disconnect();
			return $users;
		}
		
	}
	
	public static function getJsonWithPassword($pUser){
		$array = array ("public"=>$pUser->isPublic(),
				"login"=>$pUser->getLogin(),
				"description"=>$pUser->getDescription(),
				"long_description"=>$pUser->getLongDescription(),
				"password"=>$pUser->getPassword(),
				"allowdownload"=>$pUser->isAllowDownload(),
				"nb_pictures_by_page"=>$pUser->getNbPicturesByPage(),
				"nb_products_min"=>$pUser->getNbProductsMin(),
				"section_display_mode"=>$pUser->getSectionDisplayMode(),
				"section_info_description"=>$pUser->getSectionInfoDescription(),
				"display_picture_names"=>$pUser->getDisplayPictureNames(),
				"free_download_dir"=>$pUser->getFreeDownloadDir(),
				"display_search_view"=>$pUser->getDisplaySearchView(),
				"search_infos_description"=>$pUser->getSearchInfosDescription(),
				"search_placeholder"=>$pUser->getSearchPlaceHolder(),
				"default_search_tags"=>$pUser->getDefaultSearchTags());
		return json_encode($array);
	}
	
	public static function getJson($pUser){
		$array = array ("public"=>$pUser->isPublic(),
				"login"=>$pUser->getLogin(),
				"description"=>$pUser->getDescription(),
				"long_description"=>$pUser->getLongDescription(),
				"allowdownload"=>$pUser->isAllowDownload(),
				"nb_pictures_by_page"=>$pUser->getNbPicturesByPage(),
				"nb_products_min"=>$pUser->getNbProductsMin(),
				"section_display_mode"=>$pUser->getSectionDisplayMode(),
				"section_info_description"=>$pUser->getSectionInfoDescription(),
				"display_picture_names"=>$pUser->getDisplayPictureNames(),
				"display_search_view"=>$pUser->getDisplaySearchView(),
				"search_infos_description"=>$pUser->getSearchInfosDescription(),
				"search_placeholder"=>$pUser->getSearchPlaceHolder(),
				"default_search_tags"=>$pUser->getDefaultSearchTags());
		return json_encode($array);
	}
	
}
?>