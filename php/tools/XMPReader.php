<?php 

/*
 *
* VERSION 2.3 : 12/06/2015 : Création.
*
* @author: S.Binda
* 
*/

class XMPReader {
	
	public static function read($filename){
		
		$result = null;
		
		$raw = XMPReader::read_raw($filename);
		
		if (isset($raw)){
			$result = XMPReader::get_xmp_array($raw);
		}
		return $result;
	}
	
	private static function read_raw($filename)
	{
	    $chunk_size = 50000;
	    $buffer = NULL;
	
	    if (($file_pointer = fopen($filename, 'r')) === FALSE) {
	        throw new RuntimeException('Could not open file for reading');
	    }
	
	    $chunk = fread($file_pointer, $chunk_size);
	    if (($posStart = strpos($chunk, '<x:xmpmeta')) !== FALSE) {
	        $buffer = substr($chunk, $posStart);
	        $posEnd = strpos($buffer, '</x:xmpmeta>');
	        $buffer = substr($buffer, 0, $posEnd + 12);
	    }
	    fclose($file_pointer);
	    
	    
	    return $buffer;
	}
	
	private static function get_xmp_array( &$xmp_raw ) {
		$xmp_arr = array();
		foreach ( array(
// 				'Creator Email' => '<Iptc4xmpCore:CreatorContactInfo[^>]+?CiEmailWork="([^"]*)"',
// 				'Owner Name'    => '<rdf:Description[^>]+?aux:OwnerName="([^"]*)"',
// 				'Creation Date' => '<rdf:Description[^>]+?xmp:CreateDate="([^"]*)"',
// 				'Modification Date'     => '<rdf:Description[^>]+?xmp:ModifyDate="([^"]*)"',
// 				'Label'         => '<rdf:Description[^>]+?xmp:Label="([^"]*)"',
// 				'Credit'        => '<rdf:Description[^>]+?photoshop:Credit="([^"]*)"',
// 				'Source'        => '<rdf:Description[^>]+?photoshop:Source="([^"]*)"',
// 				'Headline'      => '<rdf:Description[^>]+?photoshop:Headline="([^"]*)"',
// 				'City'          => '<rdf:Description[^>]+?photoshop:City="([^"]*)"',
// 				'State'         => '<rdf:Description[^>]+?photoshop:State="([^"]*)"',
// 				'Country'       => '<rdf:Description[^>]+?photoshop:Country="([^"]*)"',
// 				'Country Code'  => '<rdf:Description[^>]+?Iptc4xmpCore:CountryCode="([^"]*)"',
// 				'Location'      => '<rdf:Description[^>]+?Iptc4xmpCore:Location="([^"]*)"',
// 				'Title'         => '<dc:title>\s*<rdf:Alt>\s*(.*?)\s*<\/rdf:Alt>\s*<\/dc:title>',
// 				'Description'   => '<dc:description>\s*<rdf:Alt>\s*(.*?)\s*<\/rdf:Alt>\s*<\/dc:description>',
// 				'Creator'       => '<dc:creator>\s*<rdf:Seq>\s*(.*?)\s*<\/rdf:Seq>\s*<\/dc:creator>',
				'Keywords'      => '<dc:subject>\s*<rdf:Bag>\s*(.*?)\s*<\/rdf:Bag>\s*<\/dc:subject>',
// 				'Hierarchical Keywords' => '<lr:hierarchicalSubject>\s*<rdf:Bag>\s*(.*?)\s*<\/rdf:Bag>\s*<\/lr:hierarchicalSubject>'
		) as $key => $regex ) {
	
			// get a single text string
			$xmp_arr[$key] = preg_match( "/$regex/is", $xmp_raw, $match ) ? $match[1] : '';
	
			// if string contains a list, then re-assign the variable as an array with the list elements
			$xmp_arr[$key] = preg_match_all( "/<rdf:li[^>]*>([^>]*)<\/rdf:li>/is", $xmp_arr[$key], $match ) ? $match[1] : $xmp_arr[$key];
	
			// hierarchical keywords need to be split into a third dimension
// 			if ( ! empty( $xmp_arr[$key] ) && $key == 'Hierarchical Keywords' ) {
// 				foreach ( $xmp_arr[$key] as $li => $val ) $xmp_arr[$key][$li] = explode( '|', $val );
// 				unset ( $li, $val );
// 			}
		}
		return $xmp_arr;
	}
}