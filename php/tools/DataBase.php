<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/


class DataBase {
	
	
	private static $_login = "";
	
	private static $_password = "";
	
	private static $_database = "";
	
	private static $_host = "";
	
	private $connected = false;
	
	private $mysqli = null;
	
	function __construct() {
		//Read configuration file
		$conf = parse_ini_file(__DIR__."/../conf/app.conf");
		self::$_host=$conf['dbhost'];
		self::$_login=$conf['dblogin'];
		self::$_password=$conf['dbpwd'];
		self::$_database=$conf['db'];
	}
	
	function connect(){
		
		if ($this->connected == false){
			$this->mysqli = @new mysqli(self::$_host,self::$_login,self::$_password,self::$_database);
		}
		
		// Check connection
		if ($this->mysqli->connect_errno)
		{
			error_log("Data base connection error.");
			throw new Exception('Data base connection error.');
		} else {
			$this->connected = true;
		}
		return true;
		
	}
	
	function disconnect(){
		if ($this->mysqli !== null){
			$this->mysqli->close();
		}
		$this->connected=false;
	}
	
	function execute($query){
		$result = null;
		if ($query !== null && $this->mysqli !== null){
			error_log("execute query=".$query);
			$result = $this->mysqli->query($query);
			if ($result == null || $result == false){
				error_log($this->mysqli->error);
			}
		} else {
			error_log("Invalid request");
		}
		return $result;
	}
	
	function getError(){
		if ($this->mysqli !== null){
			return $this->mysqli->error;
		} else {
			return "";
		}
	}
	
	function rollback(){
		if ($this->mysqli !== null){
			$this->mysqli->rollback();
		}
	}
	
	function getLastId(){
		if ($this->mysqli !== null){
			return $this->mysqli->insert_id;
		} else {
			return null;
		}
	}
	
}


?>