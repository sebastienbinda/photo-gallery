<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../controlers/CartControler.php');
include_once(__DIR__.'/CartItem.php');
class Cart {
	
	private $items = Array();
	
	private $shippingFee = 0;
	
	function getItems(){
		return $this->items;
	}
	
	function setItems($pItems){
		$this->items = $pItems;
	}
	
	function addItem($pItem){
		if (isset($this->items[$pItem->getId()])){
			$quantity = $this->items[$pItem->getId()]->getQuantity();
			$price = $this->items[$pItem->getId()]->getPrice();
        	$this->items[$pItem->getId()]->setQuantity($quantity+$pItem->getQuantity());
        	$this->items[$pItem->getId()]->setPrice($price+$pItem->getPrice());
    	} else {
    		$this->items[$pItem->getId()] = $pItem;
    	}
    	
    	CartControler::calculateShippingFee($this);
	}
	
	function removeItem($pItemId) {
		if (isset($this->items[$pItemId])){
			unset($this->items[$pItemId]);
		}
		CartControler::calculateShippingFee($this);
	}
	
	function removeAllItems() {
		foreach ($this->items as &$item){
			unset($item);
		}
		$this->items = Array();
		CartControler::calculateShippingFee($this);
	}
	
	// retourne le $num du type $artnr du panier
	function getItem($pItemId){
		if (isset($this->items[$pItemId])){
			return $this->items[$pItemId];
		} else {
			return null;
		}
	}
	
	function getShippingFee(){
		return $this->shippingFee;
	}
	
	function setShippingFee($pShippingFee){
		$this->shippingFee = $pShippingFee;
	}
	
	function toSummaryJSON(){
		$nbitems = sizeof($this->getItems());
		$cart = array ("nb_items"=>$nbitems,"shipping_fee"=>$this->getShippingFee());
		return json_encode($cart);
	}
	
	function toJSON(){
		$cart = array ();
 		foreach ($this->items as &$item){
 			$jsonItem = Array("id"=>$item->getId(),"productid"=>$item->getProductId(),"quantity"=>$item->getQuantity(),"pictureid"=>$item->getPictureId(),"price"=>$item->getPrice());
 			array_push($cart,$jsonItem);
 		}
		return json_encode($cart);
	}
 
}