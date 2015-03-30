ContactManager.module("HeaderApp", function(Header, ContactManager,Backbone, Marionette, $, _){
	var API = {
		listHeader: function(user){
			Header.List.Controller.listHeader(user);	
		},
		defaultHeader: function(){
			Header.List.Controller.defaultHeader();	
		}
	};

    /* set hightlight
	ContactManager.commands.setHandler("set:active:header", function(name){
		ContactManager.HeaderApp.List.Controller.setActiveHeader(name);
	});
     */

	ContactManager.on("header:update", function(user){
		API.listHeader(user);
  	});

  	ContactManager.on("header:default", function(){
		API.defaultHeader();
  	});
	this.listenTo(Header, "start", function(){
    	API.listHeader();
  	});
});