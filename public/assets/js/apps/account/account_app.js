ContactManager.module("AccountApp", function(AccountApp, ContactManager, Backbone, Marionette, $, _){

	AccountApp.Router = Marionette.AppRouter.extend({
	    appRoutes: {
	      "account/login" : "login",
	      "account/sociallogin/:id" : "sociallogin",
	      "account/logout": "logout",
	      "account/signup" : "signup",
	      "account/forget" : "forget",
	      "account/reset" : "reset",
	      "account/profile/:id" : "profile",
	    }
	});

	var API={
		login: function(){
	     	AccountApp.Show.Controller.showLogin();
	    },
	    sociallogin: function(id){
	     	AccountApp.Show.Controller.sociallogin(id);
	    },
	    signup: function(){
	     	AccountApp.Show.Controller.showSignup();
	    },
	    logout: function(){
	     	AccountApp.Show.Controller.showLogout();
	    },
	    forget: function(){
	     	AccountApp.Show.Controller.showForget();
	    },
	    profile: function(id){
	     	AccountApp.Show.Controller.showProfile(id);
	    },
	    reset: function(){
	     	AccountApp.Show.Controller.showReset();
	    }
	};

	ContactManager.on("account:login", function(){ 
		ContactManager.navigate("account/login"); 
		API.login();
	});

	ContactManager.on("account:signup", function(){ 
		ContactManager.navigate("account/signup"); 
		API.signup();
	});

	ContactManager.on("account:logout", function(){ 
		ContactManager.navigate("account/logout"); 
		API.logout();
	});

	ContactManager.on("account:forget", function(){ 
		console.log('account:forget');
		ContactManager.navigate("account/forget"); 
		API.forget();
	});

	ContactManager.addInitializer(function(){ 
		new AccountApp.Router({
			controller: API
		});
	});
	
});
