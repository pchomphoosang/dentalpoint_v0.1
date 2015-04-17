ContactManager.module("MainApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){

	var Controller = Marionette.Controller.extend({
		showAbout: function(){
			var view = new Show.Message();
			view.on('submit:search',function(data){
				console.log('--------->>'+JSON.stringify(data) );   

				ContactManager.trigger("search_main:list",data);  
          	})
			ContactManager.mainRegion.show(view);
		}
	});

	Show.Controller = new Controller();

	ContactManager.MainApp.on("stop", function(){
		Show.Controller.destroy();
	});
});