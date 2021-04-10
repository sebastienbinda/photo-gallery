<?php

/*
 *
* VERSION 2.3 : 20/06/2015 : Création
*
* @author: S.Binda
* 
*/

class Picture {
	
	// Unique identifier
	private $id = null;
	
	// Associated user
	private $userLogin="";
	
	// Picture name (file name)
	private $name="";
	
	// Section where is the file
	private $section="";
	
	// Keyword associated
	private $keyword="";
	
	// Width for the tumbnail
	private $thumb_width=0;
	
	// Height for the tumbnail
	private $thumb_height=0;
	
	// Download url direct access
	private $downloadUrlAccess="";
		
	// GETTERS / SETTERS
	
	function getId(){
		return $this->id;
	}
	
	function setId($pId){
		$this->id = $pId;
	}
	
	function getUserLogin(){
		return $this->userLogin;
	}
	
	function setUserLogin($pUserLogin){
		$this->userLogin = $pUserLogin;
	}
	
	function getName(){
		return $this->name;
	}
	
	function setName($pName){
		$this->name = $pName;
	}
	
	function getSection(){
		return $this->section;
	}
	
	function setSection($pSection){
		$this->section = $pSection;
	}
	
	function getKeyword(){
		return $this->keyword;
	}
	
	function setKeyword($pKeywords){
		$this->keyword = $pKeywords;
	}
	
	function getThumbWidth(){
		return $this->thumb_width;
	}
	
	function setThumbWidth($pThumbWidth){
		$this->thumb_width = $pThumbWidth;
	}
	
	function getThumbHeight(){
		return $this->thumb_height;
	}
	
	function setThumbHeight($pThumbHeight){
		$this->thumb_height = $pThumbHeight;
	}
	
	function getDownloadUrlAccess(){
		return $this->downloadUrlAccess;
	}
	
	function setDownloadUrlAccess($pDownloadUrlAccess){
		$this->downloadUrlAccess = $pDownloadUrlAccess;
	}
	
}


?>
