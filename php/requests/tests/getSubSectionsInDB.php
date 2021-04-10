<?php
/*
 *
* VERSION 2.3 : 27/06/2015 : GEstion de l'indexation des photos.
*
* @author: S.Binda
*
*/
include_once(__DIR__.'/../../controlers/PictureControler.php');

// Create logger
$logger = new Katzgrau\KLogger\Logger('/tmp');

$user='seb';
//$section='/';
$section='/petits chiens';

$subSections = PictureControler::getSubSectionsFromDb($user,$section);

print_r($subSections);
echo "<br/>";

$subSections = PictureControler::getSubSectionsFromDisk($user,$section);

print_r($subSections);

?>
