<?php 

/*
 *
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
* VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../tools/DataBase.php');
include_once(__DIR__.'/../pojos/Product.php');

class ProductControler {

	/**
	 * Return all database products
	 * @return List<Product>
	 */
	public static function getAllProducts($db){
				
		$dbSupplied=true;
		if ($db == null){
			$db = new DataBase();
			$dbSupplied=false;
		}
		
		if ($db->connect()){
			
			$result = null;
			$products = null;
		
			$result = $db->execute("SELECT id, name, price, product_type, description, weight, shipping_type, delivery_directory from t_product;");
			
			if ($result !== null){
				while($obj = $result->fetch_object()){
					if ($obj->name !== null && $obj->name != ""){
						$product = new Product();
						$product->setId($obj->id);
						$product->setName($obj->name);
						$product->setPrice($obj->price);
						$product->setType($obj->product_type);
						$product->setDescription($obj->description);
						$product->setWeight($obj->weight);
						$product->setShippingType($obj->shipping_type);
						$product->setDeliveryDirectory($obj->delivery_directory);
						
						$products[] = $product;
					}
				}
				$result->close();
			}
			
			if(!$dbSupplied){
				$db->disconnect();
			}
		}
		return $products;
		
	}
	
	/**
	 * Return all products of a given user.
	 * @param $pUserLogin
	 * @return List<Product>
	 */
	public static function getUserProducts($pUserLogin,$db){
		
		$dbSupplied=true;
		if ($db == null){
			$db = new DataBase();
			$dbSupplied=false;
		}
		
		if ($db->connect()){
				
			$result = null;
			$products = null;
		
			$result = $db->execute("SELECT p.id, p.name, p.price,p.product_type,p.description, p.weight, p.shipping_type, p.delivery_directory from t_product p, ta_user_product up where p.id = up.productid and up.username='".$pUserLogin."';");
				
			if ($result !== null){
				while($obj = $result->fetch_object()){
					if ($obj->name !== null && $obj->name != ""){
						$product = new Product();
						$product->setId($obj->id);
						$product->setName($obj->name);
						$product->setPrice($obj->price);
						$product->setType($obj->product_type);
						$product->setDescription($obj->description);
						$product->setWeight($obj->weight);
						$product->setShippingType($obj->shipping_type);
						$product->setDeliveryDirectory($obj->delivery_directory);
						
						$products[] = $product;
					}
				}
				$result->close();
			}
			
			if(!$dbSupplied){
				$db->disconnect();
			}
		}
		return $products;
		
	}
	
	public static function getProduct($pId){
		$product = null;
		$db = new DataBase();
		if ($db->connect()){
			$query = "SELECT id,name,price,product_type,description,weight,shipping_type, delivery_directory FROM t_product WHERE id='".$pId."';";
			$result = $db->execute($query);
			if ($result){
				while($obj = $result->fetch_object()){
					if ($obj->name !== null && $obj->price != ""){
						$product = new Product();
						$product->setId($obj->id);
						$product->setName($obj->name);
						$product->setPrice($obj->price);
						$product->setType($obj->product_type);
						$product->setDescription($obj->description);
						$product->setWeight($obj->weight);
						$product->setShippingType($obj->shipping_type);
						$product->setDeliveryDirectory($obj->delivery_directory);
					}
				}
			}
			$db->disconnect();
		}
		return $product;
	}
	
	/**
	 * Add a new product in db.
	 * Return true if db transaction is successful.
	 * 
	 * @param Product $pProduct
	 * @return boolean
	 */
	public static function addProduct($pProduct){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "INSERT INTO t_product (name,price,product_type,description,weight,shipping_type,delivery_directory) ";
			$query = $query."VALUES ('".$pProduct->getName()."','";
			$query = $query.$pProduct->getPrice()."','";
			$query = $query.$pProduct->getType()."','";
			$query = $query.$pProduct->getDescription()."','";
			$query = $query.$pProduct->getWeight()."','";
			$query = $query.$pProduct->getShippingType()."','";
			$query = $query.$pProduct->getDeliveryDirectory()."');";
			
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}				
			$db->disconnect();
		}
		return $ret;
	}
	
	/**
	 * Delete a product from db
	 * Return true if db transaction is successful.
	 * 
	 * @param Product $pProduct
	 * @return boolean
	 */
	public static function deleteProduct($pProduct){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "DELETE FROM t_product WHERE id='".$pProduct->getId()."';";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	/**
	 * Supprime les lien vers le produit dans la table ta_user_product 
	 * @param unknown $pId : Identifiant du produit
	 * @return boolean
	 */
	public static function deleteUserProduct($pId){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "DELETE FROM ta_user_product WHERE productid='".$pId."';";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	/**
	 * Update the given product in db
	 * Return true if db transaction is successful.
	 * 
	 * @param Product $pProduct
	 * @return boolean
	 */
	public static function updateProduct($pProduct){
		$ret = false;
		
		$query = null;
		if ($pProduct->getPrice() !== null && $pProduct->getName() !== null){
			$query = "UPDATE t_product SET NAME='".$pProduct->getName()."', ";
			$query = $query."PRICE='".$pProduct->getPrice()."', ";
			$query = $query."PRODUCT_TYPE='".$pProduct->getType()."', ";
			$query = $query."DESCRIPTION='".$pProduct->getDescription()."', ";
			$query = $query."SHIPPING_TYPE='".$pProduct->getShippingType()."', ";
			$query = $query."DELIVERY_DIRECTORY='".$pProduct->getDeliveryDirectory()."', ";
			$query = $query."WEIGHT='".$pProduct->getWeight()."' ";
			$query = $query."WHERE id='".$pProduct->getId()."';";
		}
		
		if ($query !== null){
			$db = new DataBase();
			if ($db->connect()){
				
				$result = $db->execute($query);
				if ($result){
					$ret = true;
				}
				$db->disconnect();
			}
		}
		return $ret;
	}
	
	public static function getFullProductToJSON($pProduct){
		$array = array ("id"=>$pProduct->getId(),
				"name"=>$pProduct->getName(),
				"price"=>$pProduct->getPrice(),
				"type"=>$pProduct->getType(),
				"description"=>$pProduct->getDescription(),
				"weight"=>$pProduct->getWeight(),
				"shipping_type"=>$pProduct->getShippingType(),
				"delivery_directory"=>$pProduct->getDeliveryDirectory());
		return json_encode($array);
	}
	
	public static function getProductToJSON($pProduct){
		$array = array ("id"=>$pProduct->getId(),
				"name"=>$pProduct->getName(),
				"price"=>$pProduct->getPrice(),
				"type"=>$pProduct->getType(),
				"description"=>$pProduct->getDescription(),
				"weight"=>$pProduct->getWeight(),
				"shipping_type"=>$pProduct->getShippingType());
		return json_encode($array);
	}
	
	public static function getFullProductsToArray($pProducts){
		$arr = array();
		foreach ($pProducts as &$product) {
			$curent = array ("id"=>$product->getId(),
					"name"=>$product->getName(),
					"price"=>$product->getPrice(),
					"type"=>$product->getType(),
					"description"=>$product->getDescription(),
					"weight"=>$product->getWeight(),
					"shipping_type"=>$product->getShippingType(),
					"delivery_directory"=>$product->getDeliveryDirectory());
			array_push($arr,$curent);
		}
		return $arr;
	}
	
	public static function getProductsToArray($pProducts){
		$arr = array();
		if (isset($pProducts) && sizeof($pProducts) > 0)
		foreach ($pProducts as &$product) {
			$curent = array ("id"=>$product->getId(),
					"name"=>$product->getName(),
					"price"=>$product->getPrice(),
					"type"=>$product->getType(),
					"description"=>$product->getDescription(),
					"weight"=>$product->getWeight(),
					"shipping_type"=>$product->getShippingType());
			array_push($arr,$curent);
		}
		return $arr;
	}
	
	public static function getProductsToJson($pProducts){
		$arr = self::getProductsToArray($pProducts);
		return json_encode($arr);
	}
	
	public static function getFullProductsToJson($pProducts){
		$arr = self::getFullProductsToArray($pProducts);
		return json_encode($arr);
	}
	
}
?>