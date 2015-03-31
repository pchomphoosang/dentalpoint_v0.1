ContactManager.module("MainApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){

  Show.Message = Marionette.ItemView.extend({
    template: "#main-view",
    className: "container"
  }); 

});
