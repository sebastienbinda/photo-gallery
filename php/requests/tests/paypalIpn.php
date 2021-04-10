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

	$res="VERIFIED";

	$logger->info("PAYPAL-IPN : START");

	if (strcmp ($res, "VERIFIED") == 0) {
		// The IPN is verified, process it
		error_log("PAYPAL : paiement verifié par paypal");
	
		$today = date("Y-m-d H:i:s");
		$today_str = date("YmdHis");
	
		// Order status 
		$status=0;
	
		$item_names=["2 - /petits chiens/petit-chien2.jpg","2 - /petits chats/example_image3.png","1 - /petits chats/example_image9.png"];
		$quantities = [1,1,1];
		$item_prices = [1,2,3];
		$item_shippings = [1,1,1];
	
	
		// assign posted variables to local variables
		$num_cart_items = 3;
		$receiver_email = "sebastienbinda@hotmail.com";
		$payer_email = "sebastienbinda@hotmail.com";
		$payment_amount = 20;
		$payment_status = "OK";
		$shipping_fee = 5;
		$adress_street = "10 rue du bosquet";
		$adress_zip = "31140";
		$adress_country = "France";
		$adress_city= "Aucamville";
		$address = $adress_street.', '.$adress_zip.' '.$adress_city.' '.$adress_country;
		$buyer_name = "binda".' '."sebastien";
	
		$user = "seb";
	
		if (isset($user ) && $user != null && $user != ""){
		
			$toZipFiles = Array();
			$items = Array();

			for ($i=0; $i < $num_cart_items; $i++){
	 		
	 			$item_name = $item_names[$i];
		 		$quantity = $quantities[$i];
		 		$item_price = $item_prices[$i];
		 		$item_shipping = $item_shippings[$i];
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
		 		$logger->info($zipfilename);
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