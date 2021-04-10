<?php

/*
*
* VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
* VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
* VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
* VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
* VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

class User {
	
	// Indication si l'utilisateur est d'accès public ou privé
	private $public=false;
	
	// Nom d'utilisateur
	private $login="";
	
	// Mot de passe
	private $password="";
	
	// Description associée à l'utilisateur
	private $description="";
	
	// Description longue associée à l'utilisateur
	private $long_description="";
	
	// Accès à la fonction de téléchargement des photos
	private $allowDownload=false;
	
	// Nombre de photos par page dans la gallerie
	private $nb_pictures_by_page=50;
	
	// Nombre minimun de tirage a commander pour une commande
	private $nb_products_min=0;
	
	// Mode d'affichage des sections dans la galerie privée
	private $section_display_mode=0;
	
	// Message d'information des sections
	private $section_info_description=null;
	
	// Booleen indiquant si l'on doit afficher le nom des photos
	private $display_picture_names=true;
	
	// Répertoire de téléchargement gratuit et direct des photos
	private $free_download_dir="";
	
	// Affichage ou non du champ de recherche des photos
	private $display_search_viw=0;
	
	//Message d'information a afficher pour la section de recherche
	private $search_infos_description=null;
	
	//Message d'information a afficher pour la section de recherche
	private $search_placeholder=null;
	
	// Liste des tags par défault.
	private $defaultSearchTags=null;
	
	// Is the user pictures indexed
	private $indexed=0;
	
	// Accesseurs
	
	function isPublic(){
		return $this->public;
	}
	
	function setPublic($pPublic){
		$this->public = $pPublic;
	}
	
	function getLogin(){
		return $this->login;
	}
	
	function setLogin($pLogin){
		$this->login = $pLogin;
	}
	
	function getPassword(){
		return $this->password;
	}
	
	function setPassword($password){
		$this->password = $password;
	}
	
	function getDescription(){
		return $this->description;
	}
	
	function setDescription($description){
		$this->description = $description;
	}
	
	function getLongDescription(){
		return $this->long_description;
	}
	
	function setLongDescription($longdescription){
		$this->long_description = $longdescription;
	}
	
	function isAllowDownload(){
		return $this->allowDownload;
	}
	
	function setAllowDownload($pAllow){
		$this->allowDownload = $pAllow;
	}
	
	function getNbPicturesByPage(){
		return $this->nb_pictures_by_page;
	}
	
	function setNbPicturesByPage($pNb){
		$this->nb_pictures_by_page = $pNb;
	}
	
	function getNbProductsMin(){
		return $this->nb_products_min;
	}
	
	function setNbProductsMin($pNb){
		$this->nb_products_min = $pNb;
	}
	
	function getSectionDisplayMode(){
		return $this->section_display_mode;
	}
	
	function setSectionDisplayMode($pSectionDisplayMode){
		$this->section_display_mode = $pSectionDisplayMode;
	}
	
	function getSectionInfoDescription(){
		return $this->section_info_description;
	}
	
	function setSectionInfoDescription($pSectionInfoDescription){
		$this->section_info_description = $pSectionInfoDescription;
	}
	
	function getDisplayPictureNames(){
		return $this->display_picture_names;
	}
	
	function setDisplayPictureNames($pDisplayPictureNames){
		$this->display_picture_names = $pDisplayPictureNames;
	}
	
	function getFreeDownloadDir(){
		return $this->free_download_dir;
	}
	
	function setFreeDownloadDir($pFreeDownloadDir){
		$this->free_download_dir = $pFreeDownloadDir;
	}
	
	function getDisplaySearchView(){
		return $this->display_search_view;
	}
	
	function setDisplaySearchView($pDisplaySearchView){
		$this->display_search_view = $pDisplaySearchView;
	}
	
	function getSearchInfosDescription(){
		return $this->search_infos_description;
	}
	
	function setSearchInfosDescription($pText){
		$this->search_infos_description = $pText;
	}
	
	function getSearchPlaceHolder(){
		return $this->search_placeholder;
	}
	
	function setSearchPlaceHolder($pText){
		$this->search_placeholder = $pText;
	}
	
	function getDefaultSearchTags(){
		return $this->defaultSearchTags;
	}
	
	function setDefaultSearchTags($pTags){
		$this->defaultSearchTags = $pTags;
	}
	
	function getIndexed(){
		return $this->indexed;
	}
	
	function setIndexed($pIndexed){
		$this->indexed = $pIndexed;
	}
	
}


?>
