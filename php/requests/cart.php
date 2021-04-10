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
include_once(__DIR__.'/../pojos/Cart.php');

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
	
		if (isset($_SESSION['user'])) {
			
			$user = unserialize($_SESSION['user']);
			$userLogin = $user->getLogin();
		
			$method = $_SERVER['REQUEST_METHOD'];
			
			// Create a new cart if none eixsts in the curent session
			$cart=null;
			if (isset($_SESSION['cart'])){
				$cart=unserialize($_SESSION['cart']);
			} else {
				$cart= new Cart();
			}
		
			switch ($method) {
				case 'POST':
					// Ading products to curent cart
					// Get the posted informations
					$aRequest = json_decode(file_get_contents('php://input'));
					
					$error=false;
					foreach ($aRequest as &$aProduct){				
						$cartItem = new CartItem();
						$cartItem->setId($aProduct->{'productid'}."_".$aProduct->{'pictureid'});
						$cartItem->setProductId($aProduct->{'productid'});
						$cartItem->setPictureId($aProduct->{'pictureid'});
						$cartItem->setQuantity($aProduct->{'quantity'});
						
						// Get product price 
						$product = ProductControler::getProduct($aProduct->{'productid'});
						$price = $product->getPrice() * $aProduct->{'quantity'};
						$cartItem->setPrice($price);
						
						$aleardyInCart = false;
						
						// Check if the download product is aleady in cart. There can't be more than 1 product of the same type for download product in cart
						if ($product != null && $product->getType()=="download"){
							$itemInCart = $cart->getItem($cartItem->getId());
							if ($itemInCart != null){
								$aleardyInCart = true;
							}
							
							$deliveryDirectory = $product->getDeliveryDirectory();
							
							$itemFilePath=__DIR__.'/../../users/'.$userLogin.'/'.$deliveryDirectory;
							
							if (!file_exists($itemFilePath)){
								$error=true;
								$message = array ("error"=>"Download file does not exists");
								echo json_encode($message);
								http_response_code(404);
								break;
							}
						}
						
						if (!$aleardyInCart){
							$cart->addItem($cartItem);
						} else {
							$error=true;
							$message = array ("error"=>"Product aleady in cart");
							echo json_encode($message);
							http_response_code(406);
							break;
						}
					}
					
					if (!$error){
						$_SESSION['cart']=serialize($cart);
						echo $cart->toSummaryJSON();
					}
					break;
				case 'PUT':
					break;
				case 'GET':
					if (isset($_GET['sum'])){
						echo $cart->toSummaryJSON();
					} else {
						echo $cart->toJSON();
					}
					break;
				case 'DELETE':
					
					if (isset($_GET['productid']) && isset($_GET['pictureid'])){
						$cart->removeItem($_GET['productid']."_".$_GET['pictureid']);
					} else {
						$cart->removeAllItems();
					}
					
					$_SESSION['cart']=serialize($cart);
					
					echo $cart->toSummaryJSON();
					break;
				default :
					error_log("ERROR : cart.php, unknown method type ".$method);
					break;
			}
		} else {
			$error = array ("error"=>"No user authenticated, cart unavailable");
			echo json_encode($error);
			http_response_code(403);
		}	
	} catch (Exception $ex) {
		echo $ex->getMessage();
		http_response_code(500);
	}
}


?>