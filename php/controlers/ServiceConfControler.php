<?php 
/*
 *
*  VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../tools/DataBase.php');
include_once(__DIR__.'/../pojos/ServiceConf.php');

class ServiceConfControler {

	public static function getServiceConf($db){
		
		$dbSupplied=true;
		if ($db == null){
			$db = new DataBase();
			$dbSupplied=false;
		}
		
		if ($db->connect()){
				
			$result = null;
			$conf = null;
		
			$result = $db->execute("SELECT password_enable from t_conf;");
				
			if ($result !== null){
				while($obj = $result->fetch_object()){
					if ($obj->password_enable !== null && $obj->password_enable != ""){
						$conf = new ServiceConf();
						$conf->setPasswordEnable($obj->password_enable);
					}
				}
				$result->close();
			}
				
			if(!$dbSupplied){
				$db->disconnect();
			}
		}
		return $conf;
		
	}
	
	public static function getServiceConfToJSON($pServiceConf){
		$array = array ("password_enable"=>$pServiceConf->getPasswordEnable());
		return json_encode($array);
	}
	
	public static function updateServiceConf($pconf,$db){
		$ret = false;
		
		$query = "UPDATE t_conf SET password_enable='".$pconf->getPasswordEnable()."';";
	
		$dbSupplied=true;
		if ($db == null){
			$db = new DataBase();
			$dbSupplied=false;
		}
		
		if ($db->connect()){
	
			$result = $db->execute($query);
			if ($result){
				$ret = true;
			}
			$db->disconnect();
		}
		return $ret;
	}
	
}

?>