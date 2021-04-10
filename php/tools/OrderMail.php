<?php 

/*
 *
 * VERSION : 2.3 : 29/06/2015 : Correction de l'envoie de mail, utilisation de php mail si l'envoie avec PHPMailer echoue.
* VERSION 2.3 : 12/06/2015 : Ajout de messages de log. 
* VERSION 1.0 : 08/07/2014 : Création
*
* @author: S.Binda
* 
*/

include_once(__DIR__.'/../vendors/phplib/template.inc');
include_once(__DIR__.'/MyLogger.php');
require __DIR__.'/../vendors/PHPMailer/PHPMailerAutoload.php';


class OrderMail {
	
	/**
	 * 
	 * @param $pTo : Adresse mail du recepteur
	 * @param $pFrom : Adress mail de l'envoyeur
	 * @param $pName : Nom complet de l'acheteur
	 * @param $pAdress : Adresse complete de l'acheteur
	 * @param $pFileLink : Lien vers le fichier en téléchargement ou null s'il n'y en a pas
	 * @param $pItems : Liste des produits achetés
	 * @param $pShippingFee : Frais de port
	 * @param $pTotal : Prix total de la commande
	 */
	public static function sendMail($pTo,$pName,$pAdress,$pFileLink,$pItems,$pShippingFee,$pTotal){
		
		// Create logger
		$logger = new MyLogger();
		
		$conf = parse_ini_file(__DIR__."/../conf/app.conf");
		$smtp_port=$conf['smtp_port'];
		$smtp_server=$conf['smtp_server'];
		$smtp_secure=$conf['smtp_secure'];
		$mail_sender=$conf['mail_sender'];
		$mail_sender_name=$conf['mail_sender_name'];
		$smtp_server=$conf['smtp_server'];
		$smtp_login=$conf['smtp_login'];
		$smtp_password=$conf['smtp_password'];
		$pFrom = $conf['mail_sender'];
		
		$subject = 'Validation de votre commande';
		
		$tpl = new template(__DIR__.'/mail/');
		$tpl->set_file("mail",'mail.html');
		
		$linkMessage = "";
		if ($pFileLink != null){
			$linkMessage = 'Les tirages achetés au format numérique vous sont accessibles <a href="'.$pFileLink.'">ici</a>. Si vous rencontrez le moindre problème n\'hésitez pas à me contacter.';
			$linkMessageAlt = 'Les tirages achetés au format numérique vous sont accessibles à cette adresse :'.$pFileLink.'  \n Si vous rencontrez le moindre problème n\'hésitez pas à me contacter.';
		}
		
		if ($pItems != null){
		
			$tpl->set_block('mail','liste_items','liste_bloc');
		
			for ($i=0;$i<sizeof($pItems);$i++){
				if (isset($pItems[$i]['picture'])){
					$tpl->set_var("picture", $pItems[$i]['picture']);
				} else {
					$tpl->set_var("picture", "");
				}
				
				if (isset($pItems[$i]['product'])){
					$tpl->set_var("product", $pItems[$i]['product']);
				} else {
					$tpl->set_var("product", "");
				}
				
				if (isset($pItems[$i]['price'])){
					$tpl->set_var("price", $pItems[$i]['price']);
				} else {
					$tpl->set_var("price", "");
				}
				
				if (isset($pItems[$i]['unit_price'])){
					$tpl->set_var("unit_price", $pItems[$i]['unit_price']);
				} else {
					$tpl->set_var("unit_price", "");
				}
				
				if (isset($pItems[$i]['quantity'])){
					$tpl->set_var("quantity", $pItems[$i]['quantity']);
				} else {
					$tpl->set_var("quantity", "");
				}
		
				$tpl->parse('liste_bloc','liste_items',true);
			}
		}
		
		$site_link="http://www.franckrp-photographe.com/";
		$title = "Résumé de votre commande";
		$main_message= "Merci de votre achat chez <a href='".$site_link."'>Franck-rp-photographe</a> ! Voici ci-dessous le résumé de votre commande. Les tirages papiers commandés vous seront envoyés par la poste.";
		$context = array("MAIN_TITLE"=>$title,"MAIN_MESSAGE"=>$main_message,"LINK_MESSAGE"=>$linkMessage,"SHIPPING_FEE"=>$pShippingFee,"TOTAL"=>$pTotal,"MONEY"=>"euros","SITE_LINK"=>$site_link,"ADDRESS"=>$pAdress,"NAME"=>$pName);
		
		$tpl->set_var($context);
		
		$out = $tpl->parse('out',"mail");
		
		$altMessage = 'Merci de votre achat chez Franck-rp-photographe\n. Les tirages aux formats papiers commandés vous seront livrés par la poste\n. ';
		$altMessage .= $linkMessageAlt.'\nLe total de votre commande est de '.$pTotal.' euros.';
		
		//$result=self::sendPhPMailer($smtp_server,$smtp_port,$smtp_login,$smtp_password,$smtp_secure, $pFrom, $pTo, $mail_sender_name, $subject, $out, $altMessage);
		$result = self::sendMailSimple($pFrom, $pTo, $mail_sender_name, $subject, $out);
		
		return $result;
	}
	
	private static function sendMailSimple($pFrom, $pTo, $mail_sender_name, $subject, $body) {
		
		// Create logger
		$logger = new MyLogger();
		
		$result = false;
		try {
			$headers  = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";
			
			// En-têtes additionnels
			$headers .= 'To: '.$pTo."\r\n";
			$headers .= 'From: '.$mail_sender_name.'<'.$pFrom.">\r\n";
			$headers .= 'Cc: '.$pFrom."\r\n";
			
			$logger->info("before mail send");
			$result = mail($pTo, $subject, $body, $headers);
			$logger->info("mail end");
		} catch (Exception $e){
			$logger->error("Error sending simple mail : ".$e->getMessage());
		}
		
		return $result;
	}
	
	private static function sendPhPMailer($smtp_server,$smtp_port,$smtp_login,$smtp_password,$smtp_secure, $pFrom, $pTo, $mail_sender_name, $subject, $body, $altMessage){
		
		// Create logger
		$logger = new MyLogger();
		
		$result = false;
		
		$mail = new PHPMailer;
		
		//$mail->SMTPDebug = true;
		$mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->Host = $smtp_server;  // Specify main and backup SMTP servers
		$mail->Port = $smtp_port;
		if ($smtp_login != "" && $smtp_password != ""){
			$mail->SMTPAuth = true;                               // Enable SMTP authentication
			$mail->Username = $smtp_login;                 // SMTP username
			$mail->Password = $smtp_password;                           // SMTP password
		}
		$mail->SMTPSecure = $smtp_secure;                            // Enable encryption, 'ssl' also accepted
		
		$mail->From = $pFrom;
		$mail->FromName = $mail_sender_name;
		$mail->addAddress($pTo);     // Add a recipient
		//$mail->addAddress($pTo);               // Name is optional
		//$mail->addReplyTo('info@example.com', 'Information');
		//$mail->addCC('cc@example.com');
		//$mail->addBCC('bcc@example.com');
		
		//$mail->WordWrap = 50;                                 // Set word wrap to 50 characters
		//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
		//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
		$mail->isHTML(true);                                  // Set email format to HTML
		$mail->CharSet = 'UTF-8';
		
		$mail->Subject = 'FranckRP-Photographe : Validation de votre commande';
		$mail->AddEmbeddedImage(__DIR__.'/../../templates/darkpurple-theme/img/logo_site.png', 'logo_frp');
		$mail->Body    = $body;
		$mail->AltBody = $altMessage;
		
		if(!$mail->send()) {
			$logger->error("Error sending order confirmation mail to ".$pTo);
			$logger->error($mail->ErrorInfo);
			$logger->error("MAIL :");
			$logger->error("$body");
			
			// try to send mail simply
			$logger->info("sending mail simply ... ".$pFrom." - ".$pTo." - ".$subject." - ".$body);
			$result = false;
			$result = self::sendMailSimple($pFrom, $pTo, $mail_sender_name, $subject, $body);
			if ($result == true){
				$logger->info("Simple mail sent to ".$pTo);
			} else {
				$logger->error("Error sending simple mail to ".$pTo);
			}
			return $result;
		} else {
			$result = true;
			$logger->info("Mail succesfuly sent to ".$pTo);
		}
		return $result;
	}
	
}

?>