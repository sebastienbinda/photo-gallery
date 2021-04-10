<?php session_start();

/*
 *
* VERSION 2.3 : 20/06/2015 : Création
*
* @author: S.Binda
* 
*/

// includes
include_once(__DIR__.'/../../tools/ParseIniWrapper.php');
include_once(__DIR__.'/../../tools/MyLogger.php');
include_once(__DIR__.'/../../controlers/PictureControler.php');



$userLogin=$_GET['login'];
$type=$_GET['type'];
$meta = null;
$section = null;
if (isset($_GET['meta'])){
	$meta = $_GET['meta'];
}

if (isset($_GET['section'])){
	$section = $_GET['section'];
}

$start=0;
if (isset($_GET['start'])){
	$start = $_GET['start'];
}
$nbByPage=5;
if (isset($_GET['nb'])){
	$nbByPage = $_GET['nb'];
}


if ($type == "index"){
	PictureControler::indexPictures($userLogin);
} else {
	
	$keywords = null;
	if ($meta != null){
		$keywords = Array();
		array_push($keywords,$meta);
	}
	
	$total=PictureControler::countPictures($userLogin,$keywords,$section);
	if ($total > 0){
		$pictures = PictureControler::searchPicture($userLogin,$keywords,$section,$start,$nbByPage);
	}
	
	$result = array();
	if ($pictures != null){
		foreach ($pictures as &$picture){
			$fileJson = array("name"=>$picture->getName(),"thumb_width"=>$picture->getThumbWidth(),"thumb_height"=>$picture->getThumbHeight(),"fullname"=>$picture->getSection().'/'.$picture->getName());
			array_push($result,$fileJson);
		}
	}
	
	$nbPages = $total/$nbByPage;
	$nbPages=ceil($nbPages);
	$resultJson = array("nbpictures"=>$total,"nbpages"=>$nbPages,"firstindex"=>$start,"pictures"=>$result,"tagResult"=>"");
	
	echo json_encode($resultJson);
}



?>