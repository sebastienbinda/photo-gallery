<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

class Order {
	
	private $id = null;
	
	private $username = null;
	
	private $date = null;
	
	private $price = null;
	
	private $useremail = null;
	
	private $status = null;
	
	private $downloadfile = null;
	
	function getId(){
		return $this->id;
	}
	
	function setId($pId){
		$this->id = $pId;
	}
	
	function getUserName(){
		return $this->username;
	}
	
	function setUserName($pUserName){
		$this->username = $pUserName;
	}
	
	function getDate(){
		return $this->date;
	}
	
	function setDate($pDate){
		$this->date = $pDate;
	}
	
	function getPrice(){
		return $this->price;
	}
	
	function setPrice($pPrice){
		$this->price = $pPrice;
	}
	
	function getUserEmail(){
		return $this->useremail;
	}
	
	function setUserEmail($pUserEmail){
		$this->useremail = $pUserEmail;
	}
	
	function getStatus(){
		return $this->status;
	}
	
	function setStatus($pStatus){
		$this->status = $pStatus;
	}
	
	function getDownloadFile(){
		return $this->downloadfile;
	}
	
	function setDownloadFile($pDownloadFile){
		$this->downloadfile = $pDownloadFile;
	}
}

?>