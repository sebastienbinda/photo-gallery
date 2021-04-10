<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../../tools/OrderMail.php');

$items = array();
$item1 = array("picture"=>"image_1.jpg","product"=>"10x15","price"=>"10","unit_price"=>"1","quantity"=>"10");
array_push($items,$item1);
$item2 = array("picture"=>"image_2.jpg","product"=>"A4","price"=>"20","unit_price"=>"10","quantity"=>"2");
array_push($items,$item2);

$name = "Dupont Henri";
$address = "33 rue du chateau, 31000 Toulouse France";

$result = OrderMail::sendMail("sebastienbinda@hotmail.com",$name,$address,"Link",$items,"2.50","32.50");

if ($result == true){
	echo "mail sent !";
} else {
	echo "Error sending mail !";
}

?>