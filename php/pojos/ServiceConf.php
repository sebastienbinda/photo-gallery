<?php

/*
 *
*  VERSION 2.2 : 15/04/2015 : Gestion de la connexion sans mot de passe.
*
* @author: S.Binda
*
*/

class ServiceConf {

	private $password_enable=1;
	
	function getPasswordEnable(){
		return $this->password_enable;
	}
	
	function setPasswordEnable($pPasswordEnable){
		$this->password_enable = $pPasswordEnable;
	}
	
}

?>