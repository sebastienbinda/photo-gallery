<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

class OrderState {
	
	private $id = null;
	
	private $state = null;
	
	function getId(){
		return $this->id;
	}
	
	function setId($pId){
		$this->id = $pId;
	}
	
	function getState(){
		return $this->state;
	}
	
	function setState($pState){
		$this->state = $pState;
	}
}

?>