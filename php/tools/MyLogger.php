<?php 

include_once(__DIR__.'/../vendors/KLogger/Logger.php');

class MyLogger {

	private $logger = null;
	
	function __construct() {
		
		try {
			$this->logger = new Katzgrau\KLogger\Logger(__DIR__.'/../logs');
		} catch (Exception $ex){
			// Nohing to do.
		}
	}
	
	function info($pMessage){
		try {
			if ($this->logger != null){
				$this->logger->info($pMessage);
			}
		} catch (Exception $ex){
			// Nohing to do.
		}
	}
	
	function error($pMessage){
		try {
			if ($this->logger != null){
				$this->logger->error($pMessage);
			}
		} catch (Exception $ex){
			// Nohing to do.
		}
	}
	
}


?>