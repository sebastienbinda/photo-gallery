
<?php

/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */

include_once(__DIR__.'/../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../pojos/Cart.php');
include_once(__DIR__.'/../controlers/ProductControler.php');

class CartControler {

	/**
	 * Return Cart total price
	 */
	public static function getTotalPrice($pCart){
		$total = 0;
		$items = $pCart->getItems();
		foreach ($items as &$item){
			$total += $item->getPrice();
		}
		return $total;
	}
	
	public static function getItemsToDownload($pCart){
		
		$results=null;
		
		$items = $pCart->getItems();
		foreach ($items as &$item){
			$productId = $item->getProductId();
			$product = ProductControler::getProduct($productId);
			if ($product->getType()=='download'){
				$results[]=$item;
			}
		}
		return $results;
		
	}
	
	public static function calculateShippingFee($pCart){
		
		$shippingFee=null;
		$totalWeight = 0;
		$shippingtype = null;
		$conf = getConf();
		$items = $pCart->getItems();
		// Calculate total weight
		foreach ($items as &$item){
			$productId = $item->getProductId();
			$product = ProductControler::getProduct($productId);
			if ($shippingtype == null || $shippingtype < $product->getShippingType() && $product->getType() != 'download'){
				$shippingtype = $product->getShippingType();
			}
			$totalWeight += $product->getWeight() * $item->getQuantity();
		}
		
		if ($totalWeight > 0){
			// Calculate price
			$letter=$conf['shipping-type'][$shippingtype];
			$mawWeight = 0;
			$value =0;
			foreach ($letter as $key => $value){
				$mawWeight = $key;
				if ($totalWeight <= $mawWeight){
					$shippingFee = $value;
					break;
				}
			}
			// If total weight is over the last configured weight thne get the last price.
			if ($shippingFee == 0 && $totalWeight > 0){
				$shippingFee = $value;
			}
		}
		 
		$pCart->setShippingFee($shippingFee);
		
		return $shippingFee;
	}
	
	public static function getShippingTypes(){
		
		$result = Array();
		
		$conf = getConf();
		$shippingtypes = $conf['shipping-type'];
		foreach ($shippingtypes as $type => $value){
			$ftype = Array();
			$ftype['name']=$type;
			array_push($result,$ftype);
		}
		
		return $result;
		
	}
}