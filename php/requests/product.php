<?php session_start();

/*
 *
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../controlers/ProductControler.php');
include_once(__DIR__.'/../pojos/User.php');

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
		
		$method = $_SERVER['REQUEST_METHOD'];
		
		if (isset($_SESSION['user'])){
			
			$user = unserialize($_SESSION['user']);
		
		
			switch ($method) {
				// Save a new product or modify an existing one
				case 'POST':
					if ($user->getLogin()=="admin") {
						saveProduct();
					} else {
						$error = array ("error"=>"Fonction d'administration non accessible");
						echo json_encode($error);
						http_response_code(403);
					}
					break;
				case 'PUT':
					if ($user->getLogin()=="admin") {
						saveProduct();
					} else {
						$error = array ("error"=>"Fonction d'administration non accessible");
						echo json_encode($error);
						http_response_code(403);
					}
					break;
				// Get a product
				case 'GET':
					// renvoi le produit demande
					if (isset($_GET['id']) && $user->getLogin()=="admin" ) {
						getFullProduct($_GET['id']);
					}	
					else {
						$user = array('login'=>null);
						echo json_encode($user);
					}
					break;
				// Delete a product
				case 'DELETE':
					if (isset($_GET['id']) &&  $user->getLogin() == "admin"){
						deleteProduct($_GET['id']);
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


	/**
	 * Get a product with the given login
	 * 
	 * @param unknown $pLogin
	 */
	function getProduct($pId){
		$product = ProductControler::getProduct($pId);
		echo ProductControler::getProductToJson($product);
	}
	
	/**
	 * Get a user with the given login
	 *
	 * @param unknown $pLogin
	 */
	function getFullProduct($pId){
		$product = ProductControler::getProduct($pId);
		echo ProductControler::getFullProductToJson($product);
	}
	
	/**
	 * Save a product given in post parameters
	 */
	function saveProduct(){
		$aRequest = json_decode(file_get_contents('php://input'));
			
		$id = $aRequest->{'id'};
		$name = $aRequest->{'name'};
		$price = $aRequest->{'price'};
		$type = $aRequest->{'type'};
		$description = $aRequest->{'description'};
		$weight = $aRequest->{'weight'};
		$shipping_type = $aRequest->{'shipping_type'};
		$delivery_directory = $aRequest->{'delivery_directory'};
		
		// Create user with the request informations
		$product = new Product();
		$product->setName($name);
		$product->setPrice($price);
		$product->setType($type);
		$product->setDescription($description);
		$product->setWeight($weight);
		$product->setShippingType($shipping_type);
		$product->setDeliveryDirectory($delivery_directory);
		
		if (isset($id) && $id != null){
			//Update product
			$product->setId($id);
			$result = ProductControler::updateProduct($product);
			if ($result == true){
				$response = array ("ok"=>"Product ".$id." updated");
				echo json_encode($response);
			} else {
				$error = array ("error"=>"Error updating product ".$id);
				echo json_encode($error);
				http_response_code(500);
			}
		} else {
			// Create a new product
			$result = ProductControler::addProduct($product);
			if ($result == true){
				$response = array ("ok"=>"Product ".$id." created");
				echo json_encode($response);
			} else {
				$error = array ("error"=>"Error creating product ".$id);
				echo json_encode($error);
				http_response_code(500);
			}
		}
			
		
	}
	
	/**
	 * Delete the product with the given id
	 * 
	 * @param unknown $pLogin
	 */
	function deleteProduct ($pId){
		$product = ProductControler::getProduct($pId);
		if ($product != null){
			
			// First delete all reference to the product to delete
			ProductControler::deleteUserProduct($product->getId());
			
			$result = ProductControler::deleteProduct($product);
			if ($result == true){
				$response = array ("ok"=>"Product ".$pId." deleted");
				echo json_encode($response);
			} else {
				$error = array ("error"=>"Error deleting product ".$pId);
				echo json_encode($error);
				http_response_code(500);
			}
		} else {
			$error = array ("error"=>"Product ".$pId." doesn't exists");
			echo json_encode($error);
			http_response_code(500);
		}
	}
?>