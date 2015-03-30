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

             providers.goTo(options.page);
             ContactManager.trigger("page:change",options);

             var providersListView = new ContactManager.Common.Views.PaginatedView({
                 collection: providers,
                 mainView: List.Contacts,
                 paginatedUrlBase: "search/filter/",
                 propagatedEvents: [
                     "childview:search:show",
                     "childview:search:edit",
                     "childview:search:delete"
                 ]
             });
                        
             providersListView.on("page:change", function(childView, model){
                  ContactManager.trigger("page:change", _.clone(providers.parameters.attributes));
             });

             providersListView.on("childview:search:show", function(childView, model){
                  ContactManager.trigger("search:show", model.get("id"));
             });

             providersListView.on("childview:search:delete", function(childView, model){
                  model.destroy();
             });
                          
            layoutView.contactsRegion.show(providersListView);
                      
       });
    }
  });

  List.Controller = new Controller();

  ContactManager.SearchApp.on("stop", function(){
    List.Controller.destroy();
  });
  
});
