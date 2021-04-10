/*
 * 
 * VERSION 2.3 : 13/06/2015 : Ajout de la recherche dans les meta données des photos.
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
 * VERSION 2.2 : 16/04/2015 : Configuration des connexions avec ou sans mot de passe.
 * VERSION 2.2 : 15/04/2015 : Ajout d'un parametre d'affichage ou non du nom des photos.
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.1 : 07/08/2014 : Ajout de la description longue condifurable pour chaque utilisateur.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define({
	'root' : {
		'adminPageUserManagementTitle' : 'Administration',
		'deconnectionButtonLabel' : 'Deconnexion',
		'serviceConfigurationButtonLabel' : 'Configuration de la connexion des utilisateurs',
		'serviceConfigurationDialog' : 'Connexion configuration',
		'adminPageUserManagInfos' : "Cette section vous permet de gérer les utilisateurs, les produits et les commandes.<br> Pour donner l'accès aux photos d'un client : <br><ul><li>Créer lui un utilisateur en remplissant les champs du formulaire en cliquant sur \"Ajouter un nouvel utilisateur\"</li><li>Deposer les photos que vous voulez lui proposer dans le répertoire /www/EPhoto/users/login/fullsize</li><li>Deposer les miniatures associées (noms identiques aux photos) dans /www/EPhoto/users/login/thumbmails</li><li> Enfin déposer le fichier \"franckrp-photos.zip\" contenant toutes les photos dans /www/EPhoto/users/login/archive (ce fichier correspond au téléchargement de toutes les photos par l'utilisateur)</li></ul><b>Attention</b>, le Titre des utilisateurs est utilisé comme titre dans la page privée de l'utilisateur et dans le nom des photos achetées.",
		
		serviceconfigration : {
			'passwordEnableLabel' : 'Activation des mots de passe de connexion',
			'trueLabel' : 'Oui',
			'falseLabel' : 'Non',
			'submitButton' : 'Confirmer',
			'cancelButton' : 'Annuler'
		},
		usermanagement : {
			'title' : 'Gestion des utilisateurs',
			'newUserDialogTitle' : 'Création d\'un nouvel utilisateur',
			'editUserDialogTitle' : 'Modification d\'un utilisateur',
			'login' : 'Identifiant',
			'password' : 'Mot de passe',
			'retypepassword' : 'Mot de passe (confirmation)',
			'description' : 'Titre',
			'long_description' : 'Description (HTML)',
			'resetLongDescriptionButton' : 'Réinitialiser la description',
			'allowdownload' : 'Téléchargement gratuit',
			'displaySearchView' : 'Champ de recherche',
			'search_info_description' : 'Description du champ de recherche',
			'search_placeholder' : 'Texte dans le champ de saisie de la recherche',
			'default_search_tags' : 'Tags recherchés par défaut<br/>Caractère de séparation ;',
			'freeDownloadDir' : 'Répertoire de dépot des fichiers en téléchargement gratuit',
			'trueLabel' : 'Oui',
			'falseLabel' : 'Non',
			'nbPicturesByPage' : 'Photos/page',
			'nbProductsMin' : 'Min tirages/cmd',
			'products' : 'Produits associés',
			'sectionDisplayMode' : 'Mode affichage sections',
			'public' : 'Publique',
			'section_info_description' : 'Texte d\'information concernant les sections',
			'displayPictureNamesLabel' : 'Affichage du nom des photos',
			'section_display_mode_0' : 'FOLDERS',
			'section_display_mode_1' : 'FREE SEARCH',
			'section_display_mode_2' : 'SECTIONS LIST',
			'actions' : 'Actions',
			'addnewuser' : 'Ajouter un nouvel utilisateur',
			'editaction' : 'Modifier l\'utilisateur',
			'deleteaction' : 'Supprimer l\'utilisateur',
			'selectProducts' : 'Associer des produits',
			'saveButton' : "Sauvegarder",
			'cancelButton' : "Annuler",
			'confirmDeleteUserTitle' : 'Confirmer la suppression ?',
			'confirmDeleteUserMessage' : 'Vous ête sur le point de supprimer un utilisateur. Voulez vous continuez ?',
			'confirmDeleteUserButton' : 'Suppression',
			'cancelDeleteUserButton' : 'Annuler',
			'loading' : 'Sauvegarde en cours',
			'galeryInfos' : "<p>Dans cette section vous pouvez sélectionner les photographies dont vous désirez acheter un ou plusieurs tirage(s).<br>Le paiement est ensuite réalisé de manière sécurisé via paypal&copy;.<br>Les tirages achetés vous seront ensuite envoyés par la poste à l'adresse de livraison fournie lors du paiement paypal&copy;<br>Les photographies achetées en téléchargement vous seront fournies par e-mail avec l\'adresse fournie lors du paiement paypal&copy;.<br>Je me ferai un plaisir de vous aider si vous voulez par exemple des tirages plus grands.</p>",
			'editErrorTitle' : 'Erreur de modification',
			'editErrorMessage' : 'Erreur durant la mise à jour de l\'utilisateur. Veuillez réessayer plus tard.<br/><br/>Merci.',
			'deleteErrorTitle' : 'Erreur de suppression',
			'deleteErrorMessage' : 'Erreur durant la suppression de l\'utilisateur. Veuillez réessayer plus tard.<br/><br/>Merci.',
		},
		
		productmanagement : {
			'title' : 'Gestion des produits',
			'id' : 'Identifiant',
			'name' : 'Nom',
			'price' : 'Prix',
			'type' : 'Type',
			'weight' : 'Poids (gr)',
			'shippingType' : 'Type d\'envoi',
			'typeStandard' : 'Standard',
			'typeDownload' : 'Téléchargement',
			'description' : 'Description',
			'deliveryDirectory' : 'Répertoire de dépot',
			'actions' : 'Actions',
			'addnewproduct' : 'Ajouter un nouveau produit',
			'editaction' : 'Modifier le produit',
			'deleteaction' : 'Supprimer le produit',
			'newProductDialogTitle' : 'Ajout d\'un nouveau produit',
			'editProductDialogTitle' : 'Modifier le produit',
			'saveButton' : "Sauvegarder",
			'cancelButton' : "Annuler",
			'confirmDeleteProductTitle' : 'Confirmer la suppression ?',
			'confirmDeleteProductMessage' : 'Vous ête sur le point de supprimer un produit. Voulez vous continuez ?',
			'confirmDeleteProductButton' : 'Suppression',
			'cancelDeleteProductButton' : 'Annuler',
			'loading' : 'Sauvegarde en cours',
			'editErrorTitle' : 'Erreur de modification',
			'editErrorMessage' : 'Erreur durant la mise à jour du produit. Veuillez réessayer plus tard.<br/><br/>Merci',
			'deleteErrorTitle' : 'Erreur de suppression',
			'deleteErrorMessage' : 'Erreur durant la suppression du produit. Veuillez réessayer plus tard.<br/><br/>Merci',
		},
		ordermanagement : {
			'title' : 'Gestion des commandes',
			'id' : 'Identifiant',
			'username' : 'Utilisateur',
			'useremail' : 'Email de l\'acheteur',
			'date' : 'Date de la commande',
			'price' : 'Prix total de la commande',
			'money' : 'euros',
			'downloadfile' : 'Fichier',
			'status' : 'Etat',
			'actions' : 'Actions',
			'editaction' : 'Modifier l\'état de la commande',
			'deleteaction' : 'Supprimer la commande',
			'editOrderDialogTitle' : 'Changer l\'état de la commande',
			'confirmDeleteOrderTitle' : 'Confirmer la suppression',
			'confirmDeleteOrderMessage' : 'La suppression de cette commande, implique la suppression du fichier téléchargeable associé. Etes vous sure de vouloir supprimer cette commande ?',
			'confirmDeleteOrderButton' : 'Oui',
			'cancelDeleteOrderButton' : 'Non',
			'saveButton' : "Sauvegarder",
			'cancelButton' : "Annuler",
			'state_0' : 'En attente de livraison',
			'loading' : 'Sauvegarde en cours',
			'editErrorTitle' : 'Erreur de modification',
			'editErrorMessage' : 'Erreur durant la mise à jour de la commande. Veuillez réessayer plus tard.<br/><br/>Merci'
		}
	  },
  // "fr" : true,
});