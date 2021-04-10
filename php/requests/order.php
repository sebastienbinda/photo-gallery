<?php session_start();

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../pojos/User.php');
include_once(__DIR__.'/../controlers/OrderControler.php');

// Check session expiration
$conf=getConf();
if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $conf['session_duration']) && $conf['session_duration'] > 0) {
	// last request was more than 30 minutes ago
	session_unset();     // unset $_SESSION variable for the run-time
	session_destroy();   // destroy session data in storage
	http_response_code(401);
} else {
	
	$_SESSION['LAST_ACTIVITY'] = time();

	// 	Do treatments

	try {
		
		$method = $_SERVER['REQUEST_METHOD'];
		
		$user=null;
		if (isset($_SESSION['user']) ) {
			$user = unserialize($_SESSION['user']);
		}
		
		switch ($method) {
			// Save a new user
			case 'POST':
				if ($user->getLogin()=="admin") {
					updateOrder();
				} else {
					$error = array ("error"=>"Fonction d'administration non accessible");
					echo json_encode($error);
					http_response_code(403);
				}
				break;
				case 'PUT':
					if ($user->getLogin()=="admin") {
						updateOrder();
					} else {
						$error = array ("error"=>"Fonction d'administration non accessible");
						echo json_encode($error);
						http_response_code(403);
					}
					break;
			// Get a user or the curent one
			case 'GET':
				// renvoi le user connecte
				if (isset($_GET['id']) &&  $user->getLogin() == "admin"){
					getOrder($_GET['id']);
				} else {
					$error = array ("error"=>"Fonction d'administration non accessible");
					echo json_encode($error);
					http_response_code(403);
				}
				break;
			// Delete a user
			case 'DELETE':
				if (isset($_GET['id']) &&  $user->getLogin() == "admin"){
					deleteOrder($_GET['id']);
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
}
	
	
	function getOrder($pOrderId){
		$order = OrderControler::getOrder($pOrderId);
		if ($order != null){
			echo OrderControler::getOrderToJson($order);
		} else {
			$error = array ("error"=>"Order ".$pOrderId." doesn't exists");
			echo json_encode($error);
			http_response_code(500);
		}
	}
	
	/**
	 * Update an order
	 */
	function updateOrder(){
		$aRequest = json_decode(file_get_contents('php://input'));
			
		$id = $aRequest->{'id'};
		$status = $aRequest->{'status'};
	
		if (isset($id) && $id != null){
			
			$order = OrderControler::getOrder($id);
			if ($order != null){
				
				$order->setStatus($status);
				$resp = OrderControler::updateOrder($order);
				
				if ($resp == true){
					$response = array ("ok"=>"Order ".$id." updated");
					echo json_encode($response);
				} else {
					$error = array ("error"=>"Error updating order ".$id);
					echo json_encode($error);
					http_response_code(500);
				}
			} else {
				$error = array ("error"=>"Error updating order ".$id.". It doesn't exists.");
				echo json_encode($error);
				http_response_code(500);
			}
		} else {
			$error = array ("error"=>"Error updating order");
			echo json_encode($error);
			http_response_code(500);
		}
	}
	
	/**
	 * Delete the user with the given login
	 *
	 * @param unknown $pLogin
	 */
	function deleteOrder ($pOrderId){
		$order = OrderControler::getOrder($pOrderId);
		if ($order != null){
			// Dete download file if any
			if ($order->getDownloadFile() != null){
				$fileNameIndex = strrpos($order->getDownloadFile(),"/");
				$fileName = substr($order->getDownloadFile(),$fileNameIndex);
				$file = (__DIR__)."/../../users/".$order->getUserName()."/downloads/".$fileName;
				if (is_file($file)){
					unlink($file);
				}
			}
			
			
			OrderControler::deleteOrder($pOrderId);
			$response = array ("ok"=>"Order ".$pOrderId." deleted, file is ".$file);
			echo json_encode($response);
		} else {
			$error = array ("error"=>"Order ".$pOrderId." doesn't exists");
			echo json_encode($error);
			http_response_code(500);
		}
	}