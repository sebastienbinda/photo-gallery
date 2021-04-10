({
	appDir : "../",
	baseUrl : "js",
	dir : "./target",
	// optimize : "none",
	optimizeCss : "standard",
	mainConfigFile : "../js/main.js",
	inlineText : true,
	removeCombined : true,
	fileExclusionRegExp : /^\.project|^build|^data|\.txt$|^sql/,
	wrap: true,
	modules : [ {
	    name : "main"
	  },{
		  name : "afterpayment_main"
	  }
	  ]
})