<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

class CartItem {
	
	private $id=null;
	
	private $productId=null;
	
	private $pictureId=null;
	
	private $quantity=null;
	
	private $price=null;
	
	function getId(){
		return $this->id;
	}
	
	function setId($pId){
		$this->id = $pId;
	}
	
	function getPictureId(){
		return $this->pictureId;
	}
	
	function setPictureId($pPicture){
		$this->pictureId = $pPicture;
	}
	
	function getProductId(){
		return $this->productId;
	}
	
	function setProductId($productId){
		$this->productId = $productId;
	}
	
	function getQuantity(){
		return $this->quantity;
	}
	
	function setQuantity($quantity){
		$this->quantity = $quantity;
	}
	
	function getPrice(){
		return $this->price;
	}
	
	function setPrice($pPrice){
		$this->price = $pPrice;
	}
	
}


?>
