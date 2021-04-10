<?php session_start();

/*
 *
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
* VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
* VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
* VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
* VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../controlers/ProductControler.php');
include_once(__DIR__.'/../../controlers/UserControler.php');

// Check session expiration
$conf=getConf();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $conf['session_duration']) && $conf['session_duration'] > 0) {
	// last request was more than 30 minutes ago
	session_unset();     // unset $_SESSION variable for the run-time
	session_destroy();   // destroy session data in storage
	http_response_code(401);
} else {
	$_SESSION['LAST_ACTIVITY'] = time();

	// Do treatments

	try {
		
		
		if (isset($_SESSION['user']) ) {
		
			$user = unserialize($_SESSION['user']);
			
			if ($user->getLogin()=="admin"){
			
				$result = Array();
				$db = new DataBase();
				$users = UserControler::getAllUsers($db);
				foreach ($users as &$user) {
					$userproducts = ProductControler::getUserProducts($user->getLogin(),$db);
					if ($userproducts != null){
						$productsJson = ProductControler::getProductsToArray($userproducts);
					} else {
						$productsJson = Array();
					}
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
					array_push($result,$userArray);
				}
				echo json_encode($result);
			
			} else {
				$error = array ("error"=>"Fonction d'administration non accessible");
				echo json_encode($error);
				http_response_code(403);
			}
		} else {
			$error = array ("error"=>"Fonction d'administration non accessible");
			echo json_encode($error);
			http_response_code(403);
		}
	} catch (Exception $ex) {
		echo $ex->getMessage();
		http_response_code(500);
	}
}
?>