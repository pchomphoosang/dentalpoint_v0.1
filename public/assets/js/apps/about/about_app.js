ContactManager.module("MainApp", function(MainApp, ContactManager, Backbone, Marionette, $, _){

  MainApp.startWithParent = false;

  MainApp.onStart = function(){
  	console.log("starting Main app");
  };

  MainApp.onStop = function(){
 	console.log("stopping Main app");
  };

});

ContactManager.module("Routers.MainApp", function(MainAppRouter, ContactManager, Backbone, Marionette, $, _){
	MainAppRouter.Router = Marionette.AppRouter.extend({
	    appRoutes: {
	      "main" : "showMain"
	    }
	});

	var API={
		showMain: function(){
		  	  ContactManager.startSubApp("MainApp");
		  	  ContactManager.MainApp.Show.Controller.showAbout();
	    }
	};	

	this.listenTo(ContactManager, "main:show", function(){
		ContactManager.navigate("main");
		API.showMain();
	});

	ContactManager.addInitializer(function(){ 
		new MainAppRouter.Router({
			controller: API
		});
	});

});