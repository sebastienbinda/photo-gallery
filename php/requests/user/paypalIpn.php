<?php 

/*
 *
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../../controlers/ProductControler.php');
include_once(__DIR__.'/../../controlers/OrderControler.php');
include_once(__DIR__.'/../../vendors/phplib/template.inc');
include_once(__DIR__.'/../../tools/OrderMail.php');
include_once(__DIR__.'/../../tools/MyLogger.php');

try {
	// Create logger
	$logger = new MyLogger();
	
	// Get configuration parameters
	$conf = parse_ini_file(__DIR__."/../../conf/app.conf");
	$paypal_addr=$conf['paypal_addr'];
	$copy_email=$conf['mail_sender'];
	$host=$conf['host'];
	
	$logger->info("PAYPAL-IPN : START");
	
	// STEP 1: read POST data
	 
	// Reading POSTed data directly from $_POST causes serialization issues with array data in the POST.
	// Instead, read raw POST data from the input stream. 
	$raw_post_data = file_get_contents('php://input');
	$raw_post_array = explode('&', $raw_post_data);
	$myPost = array();
	foreach ($raw_post_array as $keyval) {
	  $keyval = explode ('=', $keyval);
	  if (count($keyval) == 2)
	     $myPost[$keyval[0]] = urldecode($keyval[1]);
	}
	// read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
	$req = 'cmd=_notify-validate';
	if(function_exists('get_magic_quotes_gpc')) {
	   $get_magic_quotes_exists = true;
	} 
	foreach ($myPost as $key => $value) {        
	   if($get_magic_quotes_exists == true && get_magic_quotes_gpc() == 1) { 
	        $value = urlencode(stripslashes($value)); 
	   } else {
	        $value = urlencode($value);
	   }
	   $req .= "&$key=$value";
	}
	 
	// Step 2: POST IPN data back to PayPal to validate
	 
	$ch = curl_init($paypal_addr);
	curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
	curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: Close'));
	curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/../../../certificate/cacert.pem');
	 
	// In wamp-like environments that do not come bundled with root authority certificates,
	// please download 'cacert.pem' from "http://curl.haxx.se/docs/caextract.html" and set 
	// the directory path of the certificate as shown below:
	// curl_setopt($ch, CURLOPT_CAINFO, dirname(__FILE__) . '/cacert.pem');
	if( !($res = curl_exec($ch)) ) {
	    error_log("PAYPAL ERROR : Got " . curl_error($ch) . " when processing IPN data");
	    $logger->error("PAYPAL-IPN : Got curl error : " . curl_error($ch) . ". When processing IPN data");
	    curl_close($ch);
	    exit;
	}
	
	curl_close($ch);
	
	if (strcmp ($res, "VERIFIED") == 0) {
		// The IPN is verified, process it
		error_log("PAYPAL : paiement verifié par paypal");
		$logger->info("PAYPAL-IPN : paiement verifié par paypal");
		
		$today = date("Y-m-d H:i:s");
		$today_str = date("YmdHis");
		
		// Order status 
		$status=0;
		
		// assign posted variables to local variables
		$num_cart_items = $_POST["num_cart_items"];
		$receiver_email = $_POST['receiver_email'];
		$payer_email = $_POST['payer_email'];
		$payment_amount = $_POST['mc_gross'];
		$payment_status = $_POST['payment_status'];
		$shipping_fee = $_POST['mc_shipping'];
		$adress_street = $_POST['address_street'];
		$adress_zip = $_POST['address_zip'];
		$adress_country = $_POST['address_country'];
		$adress_city= $_POST['address_city'];
		$address = $adress_street.', '.$adress_zip.' '.$adress_city.' '.$adress_country;
		$buyer_name = $_POST['first_name'].' '.$_POST['last_name'];
		
		$user = $_POST['custom'];
		
		if (isset($user ) && $user != null && $user != ""){
		
			$toZipFiles = Array();
			$items = Array();
			
		 	for ($i=1; $i <= $num_cart_items; $i++){
		 		
		 		$item_name = $_POST['item_name'.$i];
		 		$quantity = $_POST['quantity'.$i];
		 		$item_price = $_POST['mc_gross_'.$i];
		 		$item_shipping = $_POST['mc_shipping'.$i];
		 		$item_price = floatval($item_price) - floatval($item_shipping);
		 		$unit_price = floatval($item_price)/floatval($quantity);
		 		
		 		$pattern = '/(?<productId>.+) - (?<pictureId>.+)/';
		 		preg_match($pattern, $item_name, $matches);
		 		
		 		if (isset($matches['productId']) && isset($matches['pictureId'])){
		 			$productId = $matches['productId'];
		 			$pictureId = $matches['pictureId'];
		 			$product = ProductControler::getProduct($productId);
		 			$productDeliveryDir = $product->getDeliveryDirectory();
		 			if ($productDeliveryDir != null && $productDeliveryDir != ""){
		 				$picturePath = $productDeliveryDir.'/'.$pictureId;
		 			} else {
		 				$picturePath = 'fullsize/'.$pictureId;
		 			}
		 			if ($product->getType()=='download'){
		 				array_push($toZipFiles,$picturePath);
		 			}

		 			$productLabel = $product->getName();
		 			$item = array("picture"=>$pictureId,"product"=>$productLabel,"price"=>$item_price,"unit_price"=>$unit_price,"quantity"=>$quantity);
		 			array_push($items,$item);
		 		}
		 	}
		 	
		 	$zipfilename = null;
		 	if (sizeof($toZipFiles) > 0){
		 		$logger->info("PAYPAL-IPN : There is file to zip in the order");
		 		$workspace=__DIR__.'/../../../users/'.$user.'/';
		 		$downloaddir=__DIR__.'/../../../users/'.$user.'/downloads/';
		 		
		 		// Create a zip file with all files to download
		 		$zipfilename = $user.'-'.$today_str.'.zip';
		 		$logger->info("ZIP file name : ".$zipfilename);
		 		$zip = new ZipArchive();
		 		if($zip->open($downloaddir.$zipfilename, ZipArchive::CREATE) == TRUE) {
		 			foreach ($toZipFiles as &$file){
		 				// Ajout d’un fichier.
		 				if (is_file($workspace.$file)){
		 					$fileToZip=$workspace.$file;
		 					$zip->addFile($fileToZip,$file);
		 				}
		 			}
		 			// Et on referme l'archive.
		 			$zip->close();
		 		} else {
		 			error_log("Erreur de création du zip");
		 			$logger->error("PAYPAL-IPN : Erreur de création du zip");
		 		}
		 		$zipfilename = $host.'/users/'.$user.'/downloads/'.$zipfilename;
		 	}
		 	
		 	// If only downlod files no delivery so change order status
		 	if ($num_cart_items == sizeof($toZipFiles)){
		 		$status=1;
		 	}
			
			$order = new Order();
			$order->setUserName($user);
			$order->setUserEmail($payer_email);
			$order->setDate($today);
			$order->setPrice($payment_amount);
			$order->setStatus($status);
			$order->setDownloadFile($zipfilename);
			OrderControler::addOrder($order);
			
			OrderMail::sendMail($payer_email,$buyer_name,$address,$zipfilename,$items,$shipping_fee,$payment_amount);
			OrderMail::sendMail($copy_email,$buyer_name,$address,$zipfilename,$items,$shipping_fee,$payment_amount);
		}
		
	} else if (strcmp ($res, "INVALID") == 0) {
		// IPN invalid, log for manual investigation
		$logger->error("PAYPAL-IPN : paiement non verifié par paypal");
	} else {
		$logger->error("PAYPAL-IPN : Erreur IPN");
	}
	
	$logger->info("PAYPAL-IPN : STOP");
} catch (Exception $ex) {
	$logger->error("PAYPAL-IPN : Exeception : ".$ex->getMessage());
}


?>