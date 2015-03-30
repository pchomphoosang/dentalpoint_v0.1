ContactManager.module("AboutApp", function(AboutApp, ContactManager, Backbone, Marionette, $, _){

  AboutApp.startWithParent = false;

  AboutApp.onStart = function(){
  	console.log("starting About app");
  };

  AboutApp.onStop = function(){
 	console.log("stopping About app");
  };

});

ContactManager.module("Routers.AboutApp", function(AboutAppRouter, ContactManager, Backbone, Marionette, $, _){
	AboutAppRouter.Router = Marionette.AppRouter.extend({
	    appRoutes: {
	      "about" : "showAbout"
	    }
	});

	var API={
		showAbout: function(){
		    var  auth = ContactManager.HeaderApp.List.session.get('authenticated');
			if (auth !== null) {
		  	  ContactManager.startSubApp("AboutApp");
		  	  ContactManager.AboutApp.Show.Controller.showAbout();
			}else {
			   ContactManager.trigger("account:login");
			}
	    }
	};	

	this.listenTo(ContactManager, "about:show", function(){
		ContactManager.navigate("about");
		API.showAbout();
	});

	ContactManager.addInitializer(function(){ 
		new AboutAppRouter.Router({
			controller: API
		});
	});

});