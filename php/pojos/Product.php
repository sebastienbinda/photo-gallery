<?php

/*
 *
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

class Product {
	
	private $id = null;
	
	private $name="";
	
	private $price="";
	
	private $type=null;
	
	private $description=null;
	
	private $weight=null;
	
	private $shippingType=null;
	
	private $deliveryDirectory=null;
	
	function getName(){
		return $this->name;
	}
	
	function setName($pName){
		$this->name = $pName;
	}
	
	function getPrice(){
		return $this->price;
	}
	
	function setPrice($price){
		$this->price = $price;
	}
	
	function setId($pId){
		$this->id = $pId;
	}
	
	function getId(){
		return $this->id;
	}
	
	function getType(){
		return $this->type;
	}
	
	function setType($pType){
		$this->type=$pType;
	}
	
	function getDescription(){
		return $this->description;
	}
	
	function setDescription($pDescription){
		$this->description=$pDescription;
	}
	
	function getWeight(){
		return $this->weight;
	}
	
	function setWeight($pWeight){
		$this->weight = $pWeight;
	}
	
	function getShippingType(){
		return $this->shippingType;
	}
	
	function setShippingType($pType){
		$this->shippingType = $pType;
	}
	
	function getDeliveryDirectory(){
		return $this->deliveryDirectory;
	}
	
	function setDeliveryDirectory($pDeliveryDirectory){
		$this->deliveryDirectory = $pDeliveryDirectory;
	}
	
}


?>
