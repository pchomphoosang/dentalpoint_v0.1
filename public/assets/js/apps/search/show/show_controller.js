ContactManager.module("SearchApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
  //Show.Controller = {
  var Controller = Marionette.Controller.extend({
    showProvider: function(id){
      
      var loadingView = new ContactManager.Common.Views.Loading({
          title: "Loading View Detail",
          message: "Loading........ View Detail"
      });

      ContactManager.mainRegion.show(loadingView);

      var providerfetch = ContactManager.request("search:entity",id);

      $.when(providerfetch).done(function(provider){
          console.log('provider:'+JSON.stringify(provider));    
          if(provider !== undefined){
              var providerView = new Show.Contact({
                  model: provider
              });
              ContactManager.mainRegion.show(providerView);
          }
          
      }).fail(function(response){
              providerView = new Show.MissingContact();
              ContactManager.mainRegion.show(providerView);
      });

      
    }
  });

  Show.Controller = new Controller();

  ContactManager.SearchApp.on("stop", function(){
    Show.Controller.destroy();
  });
  
});
