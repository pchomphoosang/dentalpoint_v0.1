ContactManager.module("SearchApp.List", function(List, ContactManager, Backbone, Marionette, $, _){

  //List.Controller = {
  var Controller = Marionette.Controller.extend({

    listProviders: function(options){

      var layoutView = new List.Layout();
      var searchPanel= new List.Search();


      layoutView.on("show", function(){

          layoutView.panelRegion.show(searchPanel);
           searchPanel.on('submit:search',function(data){
                 List.Controller.FetchProvider( data, layoutView,options);             
          })
      });
      ContactManager.mainRegion.show(layoutView);      
    },

    listProvidersSub: function(options){
      console.log("listProvidersSub options"+options);
      var layoutView = new List.Layout();
      var searchPanel= new List.Search();
      layoutView.on("show", function(){
          layoutView.panelRegion.show(searchPanel);
          List.Controller.FetchProvider("dd",layoutView,options);
      });
      ContactManager.mainRegion.show(layoutView);            
    },

    FetchProvider:function(keysearch,layoutView,options){

      var loadingView = new ContactManager.Common.Views.Loading();
      layoutView.contactsRegion.show(loadingView);



      console.log("keyword :"+JSON.stringify( options));
      var fetchingproviders = ContactManager.request("search:entities",{ parameters: options, keys: keysearch});
       $.when(fetchingproviders).done(function(providers){

             console.log('feedback:'+JSON.stringify(providers));
             console.log("options.page:"+options.page);
             console.log("options.criterion:"+options.criterion);
            /*
            if(options.criterion){
              searchPanel.once("show", function(){
                searchPanel.triggerMethod("set:filter:criterion", options.criterion);
              });
            }
            */

             ContactManager.trigger("page:change",options);

             var mapView =  new ContactManager.Common.Views.Map({
                 collection: providers
             });

             var providersListView = new ContactManager.Common.Views.PaginatedView({
                 collection: providers,
                 mainView: List.Contacts,
                 paginatedUrlBase: "search/filter/",
                 propagatedEvents: [
                     "childview:search:show",
                     "childview:search:edit",
                     "childview:search:delete",
                     "childview:search:maker"
                 ]
             });
                        
             providersListView.on("page:change", function(childView, model){
                  ContactManager.trigger("page:change", _.clone(providers.parameters.attributes));
             });
            
             providersListView.on("childview:search:show", function(childView, model){
                   window.open("#search/" + model.id, '_blank');
                  //ContactManager.trigger("search:show", model.get("id"));
             });

             providersListView.on("childview:search:delete", function(childView, model){
                  model.destroy();
             });
             
             providersListView.on("childview:search:maker", function(childView, model){
                  mapView.hightlight(model);
             });

             layoutView.mapRegion.show(mapView);   
             layoutView.contactsRegion.show(providersListView);                
       });
    }
  });

  List.Controller = new Controller();

  ContactManager.SearchApp.on("stop", function(){
    List.Controller.destroy();
  });
  
});
