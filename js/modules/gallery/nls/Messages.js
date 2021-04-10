/*
 * 
 * VERSION 2.2 : 04/05/2015 : Ajout des galleries publiques.
 * VERSION 2.2 : 17/04/2015 : Gestion de différents répertoire de dépot pour les téléchargements
 * VERSION 2.1 : 11/04/2015 : Ajout des sections de photos.
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define({
	'root' : {
		'disconnectButtonLabel' : 'Retour',
		'galleryTitle' : 'Liste des photos disponibles à l\'achat',
		'downloadAllButtonLabel' : 'Télécharger toutes les photos',
		'confirmLeaveGalleryTitle' : 'Quitter la galerie ?',
		'confirmLeaveGalleryMsg' : 'Etes-vous sur de vouloir quitter la galerie courante et ainsi vider votre panier ?',
		'confirmLeaveGalleryButton' : 'Oui',
		'cancelLeaveGalleryButton' : 'non',
		'publicAccessTitle' : 'Vous avez participé à un évènement publique couvert par RIEU-PATEY Franck : ',
		'publicGalleriesInformations' : 'Liste des galeries publiques. Cliquez sur la galerie souhaitée pour en découvrir le contenu',
		'confirmAddToCartOk' : 'Ok',
		'addtocartOkInfoPopUp' : 'Le(s) produit(s) ont bien été ajoutés au panier.',
		'addtocartOkInfoPopUpTitle' : 'Ajout au panier',
		
		products : {
			'title' : 'Liste des tirages disponibles',
			'tableNameColumnLabel' : 'Tirage',
			'tablePriceColumnLabel' : 'Prix',
			'tableDescriptionColumnLabel' : 'Description',
			'money' : 'euros'
		},
		directories : {
			'title' : 'Sections de la galerie',
			'section_reset' : 'Retour à la liste des sections principales',
			'section_search' : 'Afficher les images',
			'section_select' : 'Veuillez sélectioner la section souhaitée',
			'backSection' : 'Retour'
		},
		pictures : {
			'title' : 'Photos disponibles',
			'fullsizelabel' : 'Agrandir',
			'noPicturesAvailables' : '',
			'addtocartbutton' : 'Ajouter au panier',
			'imagecopyright' : 'Les droits de cette image sont sous le Copyright© 2014. FranckRP.',
			'download' : "Télécharger",
			'loadingTitle' : 'Franckrp photographe',
			'loading' : 'Chargement ...',
			'loadErrorTitle' : 'Photographie innacessible',
			'loadErrorMessage' : 'La photographie demandée n\'est pas actuellement disponible, veuillez réessayer plus tard.<br/><br/>Merci.',
			'loading_msg' : 'Veuillez patienter, recherche des photos en cours ...',
			
		},
		addtocartpanel : {
			'addtocartpaneltitle' : 'Ajout au panier',
			'addtocartpanelinfo' : '',
			'formatinfo' : 'Format : ',
			'quantiteinfo' : 'Quantité : ',
			'addtocartbutton' : 'Ajouter au panier',
			'addtocartClosebutton' : 'Annuler',
			'money' : 'euros',
			'imagecopyright' : 'Les droits de cette image sont sous le Copyright© 2014. FranckRP.',
			'cartErrorTitle' : 'Informations',
			'cartErrorMessage' : 'La commande est actuellement désactivée. Veuillez nous excuser du désagrément et réessayer utlérieurement.<br/><br/>Merci.',
			'downloadFileDoesNotExists' : '<br/>L\'image sélectionnée n\'est actuellement pas disponible dans le format selectionné.<br/><br/>Veuillez nous excuser pour la gêne occasionée.<br/><br/>',
			'fileAlreadyInCart': 'L\'image sélectionnée est déjà dans votre panier pour le format demandé.'
		},
		search : {
			noresultsMessage : 'Aucune photo ne correspond à votre recherche.',
			noresultsTitle : 'Pas de résultats',
			defaultResultsMessage : 'Aucune photo ne correspond à votre recherche. Toutefois, les photos générales de l\'évènement vous sont proposées.',
			defaultResultsTitle : 'Pas de résultats associé à votre recherche',
			okbutton : 'OK'
		}
			
	  },
  // "fr" : true,
});
