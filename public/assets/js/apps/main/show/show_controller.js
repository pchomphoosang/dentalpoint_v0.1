ContactManager.module("MainApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){

	var Controller = Marionette.Controller.extend({
		showMain: function(){

      		var key = new Backbone.Model({ test1: 'test' });
			var view = new Show.MainPage({model : key});

			view.on('submit:search',function(data){ 

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