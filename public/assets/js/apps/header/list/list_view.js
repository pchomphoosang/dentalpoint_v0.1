ContactManager.module("HeaderApp.List", function(List, ContactManager, Backbone, Marionette, $, _){

  	List.Headers = Marionette.CompositeView.extend({
	    template: "#header-template",
	    className: "navbar navbar-inverse navbar-fixed-top",
	    events: {
      		"click #loginlink": "login",
          "click a#accountlogout": "logout"
    	},
    	login : function(){
    		ContactManager.trigger("account:login");
    	},
      logout : function(){
        ContactManager.trigger("account:logout");
      }
  	});
});
