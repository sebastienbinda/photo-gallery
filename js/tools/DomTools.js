/*
 * 
 * VERSION 1.0 : 08/07/2014 : Création
 * 
 * @author: S.Binda
 * 
 */
define([ ], function() {

  return {

	    onRightClick : function(pEvent, pContainer, pRightClickDiv){
	    	
	    	var x;
	    	var y;
	    	if (pEvent.pageX || pEvent.pageY) { 
	    	  x = pEvent.pageX + $(pContainer).scrollLeft() +10;
	    	  y = pEvent.pageY + $(pContainer).scrollTop() - 150;
	    	}
	    	else { 
	    	  x = pEvent.clientX + $(pContainer).scrollLeft() + 10; 
	    	  y = pEvent.clientY + $(pContainer).scrollTop() - 150 ; 
	    	}
	    	
	    	$(pRightClickDiv).addClass("right-click-menu");
	    	$(pRightClickDiv).attr("style","top:"+y+"px; left:"+x+"px;");
	    	$(pRightClickDiv).show();
	    	
	    	this.rightMenuX = x;
	    	this.rightMenuY = y;
	    	
	    	pEvent.preventDefault();
	    	return false;
	    },
	    hideRightMenu : function(event, pContainer, pRightClickDiv){
	    	var x;
	    	var y;
	    	if (event.pageX || event.pageY) {
	    	  x = event.pageX + $(pContainer).scrollLeft();
	    	  y = event.pageY + $(pContainer).scrollTop() - 150;
	    	}
	    	else { 
	    	  x = event.clientX + $(pContainer).scrollLeft(); 
	    	  y = event.clientY + $(pContainer).scrollTop() - 150 ; 
	    	}
	    	
	    	if (x > this.rightMenuX + 20 || x < this.rightMenuX -20 || y > this.rightMenuY + 20 || y < this.rightMenuY -20){
	    		$(pRightClickDiv).hide();
	    	}
	    },
	    getUrlParameter : function(sParam)
	    {
	        var sPageURL = window.location.search.substring(1);
	        var sURLVariables = sPageURL.split('&');
	        for (var i = 0; i < sURLVariables.length; i++) 
	        {
	            var sParameterName = sURLVariables[i].split('=');
	            if (sParameterName[0] == sParam) 
	            {
	                return sParameterName[1];
	            }
	        }
	    }   
  	}
});