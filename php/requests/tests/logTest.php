<?php

include_once(__DIR__.'/../../vendors/KLogger/Logger.php');

// Create logger
$logger = new Katzgrau\KLogger\Logger('/tmp');


for ($i=0;$i<100000;$i++){
	$logger->info("Test numéro ".$i);
}