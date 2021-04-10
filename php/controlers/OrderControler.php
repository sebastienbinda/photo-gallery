<?php 

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../tools/DataBase.php');
include_once(__DIR__.'/../pojos/Order.php');
include_once(__DIR__.'/../pojos/OrderState.php');

class OrderControler {

	/**
	 * Return all database products
	 * @return List<Product>
	 */
	public static function getAllOrders(){
		
		$db = new DataBase();
		$orders = null;
		
		if ($db->connect()){
				
			$result = null;
		
			$result = $db->execute("SELECT id, username, date, price, useremail, status, downloadfile from t_order;");
			
			if ($result !== null){
				while($obj = $result->fetch_object()){
					$order = new Order();
					$order->setId($obj->id);
					$order->setUserName($obj->username);
					$order->setDate($obj->date);
					$order->setPrice($obj->price);
					$order->setUserEmail($obj->useremail);
					$order->setStatus($obj->status);
					$order->setDownloadFile($obj->downloadfile);
					$orders[] = $order;
				}
				$result->close();
			}
			$db->disconnect();
		}
		
		return $orders;
	}
	
	public static function getOrder($pId) {
		$db = new DataBase();
		$order = null;
		
		if ($db->connect()){
		
			$result = null;
		
			$result = $db->execute("SELECT id, username, date, price, useremail, status, downloadfile from t_order where id='".$pId."';");
				
			if ($result !== null){
				while($obj = $result->fetch_object()){
					$order = new Order();
					$order->setId($obj->id);
					$order->setUserName($obj->username);
					$order->setDate($obj->date);
					$order->setPrice($obj->price);
					$order->setUserEmail($obj->useremail);
					$order->setStatus($obj->status);
					$order->setDownloadFile($obj->downloadfile);
					$order = $order;
				}
				$result->close();
			}
			$db->disconnect();
		}
		
		return $order;
	}
	
	public static function addOrder($pOrder) {
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "INSERT INTO t_order (username,date,price,useremail,status,downloadfile) VALUES ('".$pOrder->getUserName()."','".$pOrder->getDate()."','".$pOrder->getPrice()."','".$pOrder->getUserEmail()."','".$pOrder->getStatus()."','".$pOrder->getDownloadFile()."');";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	/**
	 * Update the given Order in db
	 * Return true if db transaction is successful.
	 *
	 * @param Product $pProduct
	 * @return boolean
	 */
	public static function updateOrder($pOrder){
		$ret = false;
	
		$query = null;
		$query = "UPDATE t_order SET STATUS='".$pOrder->getStatus()."' WHERE id='".$pOrder->getId()."';";
	
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
	
	public static function deleteOrder($pId){
		$ret = false;
		$db = new DataBase();
		if ($db->connect()){
			$query = "DELETE FROM t_order WHERE id='".$pId."';";
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
	public static function getOrderStates(){
		$db = new DataBase();
		$states = null;
		
		if ($db->connect()){
		
			$result = null;
		
			$result = $db->execute("SELECT id, state from t_enum_order_state;");
				
			if ($result !== null){
				while($obj = $result->fetch_object()){
					$state = new OrderState();
					$state->setId($obj->id);
					$state->setState($obj->state);
					$states[] = $state;
				}
				$result->close();
			}
			$db->disconnect();
		}
		
		return $states;
	}
	
	public static function getOrdersToJson($pOrders){
		$arr = array();
		foreach ($pOrders as &$pOrder) {
			$curent = array ("id"=>$pOrder->getId(),"username"=>$pOrder->getUserName(),"date"=>$pOrder->getDate(),"price"=>$pOrder->getPrice(),"useremail"=>$pOrder->getUserEmail(),"status"=>$pOrder->getStatus(),"downloadfile"=>$pOrder->getDownloadFile());
			array_push($arr,$curent);
		}
		return json_encode($arr);
	}
	
	public static function getOrderToJson($pOrder){
		$curent = array ("id"=>$pOrder->getId(),"username"=>$pOrder->getUserName(),"date"=>$pOrder->getDate(),"price"=>$pOrder->getPrice(),"useremail"=>$pOrder->getUserEmail(),"status"=>$pOrder->getStatus(),"downloadfile"=>$pOrder->getDownloadFile());
		return json_encode($curent);
	}
	
	public static function getOrderStatesToJson($pStates){
		$arr = array();
		foreach ($pStates as &$pState) {
			$curent = array ("id"=>$pState->getId(),"state"=>$pState->getState());
			array_push($arr,$curent);
		}
		return json_encode($arr);
	}
}

?>