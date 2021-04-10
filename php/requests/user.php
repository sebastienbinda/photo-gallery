<?php session_start();

/*
 *
* VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
* VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
* VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
* VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../controlers/ProductControler.php');
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
				if ($user != null && $user->getLogin()=="admin") {
					saveUser();
					
				} else {
					$error = array ("error"=>"Fonction d'administration non accessible");
					echo json_encode($error);
					http_response_code(403);
				}
				break;
			// Get a user or the curent one
			case 'GET':
				// renvoi le user connecte
				if ($user != null) {
					if (isset($_GET['login']) && $user->getLogin() == "admin"){
						getUser($_GET['login'],true);
					} else if ( !isset($_GET['login'])) {
						getUser($user->getLogin(), false);
					} else {
						getPublicUser($_GET['login'], false);
					} 
				}	
				else {
					if (!isset($_GET['login'])){
						$user = array('login'=>null);
						echo json_encode($user);
					} else {
						getPublicUser($_GET['login']);
					}
				}
				break;
			// Delete a user
			case 'DELETE':
				if ($user != null && $user->getLogin()=="admin") {
					deleteUser($_GET['login']);
				} else {
					$error = array ("error"=>"Fonction d'administration non accessible");
					echo json_encode($error);
					http_response_code(403);
				}
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
	function getUser($pLogin, $pForAdmin){
		$user = null;
		$user = UserControler::getUser($pLogin);
		
		if ($user != null){
			$userproducts = ProductControler::getUserProducts($user->getLogin(),null);
			if ($userproducts != null){
				$productsJson = ProductControler::getProductsToArray($userproducts);
			} else {
				$productsJson = Array();
			}
			
			if ($pForAdmin == true){
				$userArray = array ("public"=>$user->isPublic(),
						"login"=>$user->getLogin(),
						"password"=>$user->getPassword(),
						"description"=>$user->getDescription(),
						"long_description"=>$user->getLongDescription(),
						"allowdownload"=>$user->isAllowDownload(),
						"nb_pictures_by_page"=>$user->getNbPicturesByPage(),
						"nb_products_min"=>$user->getNbProductsMin(),
						"section_display_mode"=>$user->getSectionDisplayMode(),
						"section_info_description"=>$user->getSectionInfoDescription(),
						"display_picture_names"=>$user->getDisplayPictureNames(),
						"free_download_dir"=>$user->getFreeDownloadDir(),
						"display_search_view"=>$user->getDisplaySearchView(),
						"search_infos_description"=>$user->getSearchInfosDescription(),
						"search_placeholder"=>$user->getSearchPlaceHolder(),
						"default_search_tags"=>$user->getDefaultSearchTags(),
						"products"=>$productsJson);
			} else {
				$userArray = array ("public"=>$user->isPublic(),
						"login"=>$user->getLogin(),
						"description"=>$user->getDescription(),
						"long_description"=>$user->getLongDescription(),
						"allowdownload"=>$user->isAllowDownload(),
						"nb_pictures_by_page"=>$user->getNbPicturesByPage(),
						"nb_products_min"=>$user->getNbProductsMin(),
						"section_display_mode"=>$user->getSectionDisplayMode(),
						"section_info_description"=>$user->getSectionInfoDescription(),
						"display_picture_names"=>$user->getDisplayPictureNames(),
						"display_search_view"=>$user->getDisplaySearchView(),
						"search_infos_description"=>$user->getSearchInfosDescription(),
						"search_placeholder"=>$user->getSearchPlaceHolder(),
						"default_search_tags"=>$user->getDefaultSearchTags(),
						"products"=>$productsJson);
			}
		} else {
			$userArray = array();
		}
		echo json_encode($userArray);
	}
	
	function getPublicUser($pLogin){
		
		$user = null;
		$user = UserControler::getUser($pLogin);
		
		if ($user != null && $user->isPublic() == 1){
		
			$userproducts = ProductControler::getUserProducts($user->getLogin(),null);
			if ($userproducts != null){
				$productsJson = ProductControler::getProductsToArray($userproducts);
			} else {
				$productsJson = Array();
			}
			
			$userArray = array ("public"=>$user->isPublic(),
					"login"=>$user->getLogin(),
					"description"=>$user->getDescription(),
					"long_description"=>$user->getLongDescription(),
					"allowdownload"=>$user->isAllowDownload(),
					"nb_pictures_by_page"=>$user->getNbPicturesByPage(),
					"nb_products_min"=>$user->getNbProductsMin(),
					"section_display_mode"=>$user->getSectionDisplayMode(),
					"section_info_description"=>$user->getSectionInfoDescription(),
					"display_picture_names"=>$user->getDisplayPictureNames(),
					"display_search_view"=>$user->getDisplaySearchView(),
					"search_infos_description"=>$user->getSearchInfosDescription(),
					"search_placeholder"=>$user->getSearchPlaceHolder(),
					"default_search_tags"=>$user->getDefaultSearchTags(),
					"products"=>$productsJson);
			echo json_encode($userArray);
		} else {
			echo "Private user not accessible";
			http_response_code(500);
		}
		
	}
	
	function getCurrentUser(){
		
	}
	
	/**
	 * Save a user given in post parameters
	 */
	function saveUser(){
		$aRequest = json_decode(file_get_contents('php://input'));
			
		$public = $aRequest->{'public'};
		$login = $aRequest->{'login'};
		$password = $aRequest->{'password'};
		$description = $aRequest->{'description'};
		$long_description = $aRequest->{'long_description'};
		$allowdownload = $aRequest->{'allowdownload'};
		$nbPicturesByPage = $aRequest->{'nb_pictures_by_page'};
		$nbProductsMin = $aRequest->{'nb_products_min'};
		$userproducts = $aRequest->{'products'};
		$sectionDisplayMode = $aRequest->{'section_display_mode'};
		$sectionInfoDescription = $aRequest->{'section_info_description'};
		$displayPictureNames = $aRequest->{'display_picture_names'};
		$free_download_dir = $aRequest->{'free_download_dir'};
		$display_search_view = $aRequest->{'display_search_view'};
		$search_infos_description = $aRequest->{'search_infos_description'};
		$search_placeholder = $aRequest->{'search_placeholder'};
		$default_search_tags = $aRequest->{'default_search_tags'};
			
		// retreive post informations
		$user = new User();
		$user->setLogin($login);
			
		$user_bd = UserControler::getUser($login);
			
		if ($user_bd != null){
			$user_bd->setPublic($public);
			$user_bd->setPassword($password);
			$user_bd->setDescription($description);
			$user_bd->setLongDescription($long_description);
			$user_bd->setAllowDownload($allowdownload);
			$user_bd->setNbPicturesByPage($nbPicturesByPage);
			$user_bd->setNbProductsMin($nbProductsMin);
			$user_bd->setSectionDisplayMode($sectionDisplayMode);
			$user_bd->setSectionInfoDescription($sectionInfoDescription);
			$user_bd->setDisplayPictureNames($displayPictureNames);
			$user_bd->setFreeDownloadDir($free_download_dir);
			$user_bd->setDisplaySearchView($display_search_view);
			$user_bd->setSearchInfosDescription($search_infos_description);
			$user_bd->setSearchPlaceHolder($search_placeholder);
			$user_bd->setDefaultSearchTags($default_search_tags);
			// Update existing user
			$result = UserControler::updateUser($user_bd);
		
			// Delete existing user products
			UserControler::deleteUserProducts($user->getLogin());
		
			// Add the new ones
			if ($userproducts != null){
				$result = UserControler::setProductsToUser($user->getLogin(),$userproducts);
			}
		
			// return user
			echo UserControler::getJson($user_bd);
		} else {
			$user->setPublic($public);
			$user->setPassword($password);
			$user->setDescription($description);
			$user->setLongDescription($long_description);
			$user->setAllowDownload($allowdownload);
			$user->setNbPicturesByPage($nbPicturesByPage);
			$user->setNbProductsMin($nbProductsMin);
			$user->setSectionDisplayMode($sectionDisplayMode);
			$user->setSectionInfoDescription($sectionInfoDescription);
			$user->setDisplayPictureNames($displayPictureNames);
			$user->setFreeDownloadDir($free_download_dir);
			$user->setDisplaySearchView($display_search_view);
			$user->setSearchInfosDescription($search_infos_description);
			$user->setSearchPlaceHolder($search_placeholder);
			$user->setDefaultSearchTags($default_search_tags);
			// Create a new one
			$result = UserControler::addUser($user);
			if ($userproducts != null){
				$result = UserControler::setProductsToUser($user->getLogin(),$userproducts);
			}
			// Create user space
			$userworkspace=__DIR__.'/../../users/';
			if (!file_exists($userworkspace.$user->getLogin())) {
				error_log("Creating directories in".$userworkspace.$user->getLogin());
				mkdir($userworkspace.$user->getLogin(), 0775, true);
				mkdir($userworkspace.$user->getLogin().'/thumbmails', 0775, true);
				mkdir($userworkspace.$user->getLogin().'/fullsize', 0775, true);
				mkdir($userworkspace.$user->getLogin().'/archive', 0775, true);
				mkdir($userworkspace.$user->getLogin().'/downloads', 0775, true);
				if ($free_download_dir != "fullsize" && $free_download_dir != "" && $free_download_dir != null){
					mkdir($userworkspace.$user->getLogin().'/'.$free_download_dir, 0775, true);
				}
				
			}
			echo UserControler::getJson($user);
		}
	}
	
	/**
	 * Delete the user with the given login
	 * 
	 * @param unknown $pLogin
	 */
	function deleteUser ($pLogin){
		$user = UserControler::getUser($pLogin);
		if ($user != null){
			UserControler::deleteUserProducts($pLogin);
			UserControler::deleteUser($user);
			$response = array ("ok"=>"User ".$pLogin." deleted");
			echo json_encode($response);
		} else {
			$error = array ("error"=>"User ".$pLogin." doesn't exists");
			echo json_encode($error);
			http_response_code(500);
		}
	}
?>