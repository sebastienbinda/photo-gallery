<?php

/*
 *
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

    /**
     * Parses INI file adding extends functionality via ":base" postfix on namespace.
     *
     * @param string $filename
     * @return array
     */
    function getConf() {
    	$p_ini = parse_ini_file(__DIR__."/../conf/app.conf",true);
        $config = array();
        foreach($p_ini as $namespace => $properties){
        	if (strpos($namespace,':') !== false) {
	            list($name, $extends) = explode(':', $namespace);
	            $name = trim($name);
	            $extends = trim($extends);
	            // create namespace if necessary
	            if(!isset($config[$name])) $config[$name] = array();
	            if(!isset($config[$name][$extends])) $config[$name][$extends] = array();
	            
	            // inherit base namespace
	            foreach($p_ini[$namespace] as $prop => $val)
	                $config[$name][$extends][$prop] = $val;
        	} else {
        		$config[$namespace]=$properties;
        	}
        }
        return $config;
    }
?>