ContactManager.module("SearchApp", function(SearchApp, ContactManager, Backbone, Marionette, $, _){
  SearchApp.startWithParent = false;

  SearchApp.onStart = function(){
    console.log("starting SearchApp");
  };

  SearchApp.onStop = function(){
    console.log("stopping SearchApp");
  };

});

ContactManager.module("Routers.SearchApp", function(SearchAppRouter, ContactManager, Backbone, Marionette, $, _){
  SearchAppRouter.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "search": "listProviders", 
      "search(/filter/:params)": "listProvidersSub",
      "search/:id": "showProvider"
    }
  });

  var parseParams = function(params){
    var options = {};
    if(params && params.trim() !== ''){
      params = params.split('+');
      _.each(params, function(param){ 
          var values = param.split(':');
          if(values[1]){
            if(values[0] === "page"){
              options[values[0]] = parseInt(values[1], 10);
            }else{
              options[values[0]] = values[1];
            }
          }
      });

    }
    _.defaults(options, { page: 1 });
   return options;
  };

  var serializeParams = function(options){
    options = _.pick(options, "criterion", "page");
    return (_.map(_.filter(_.pairs(options), function(pair){ return pair[1]; }), function(pair){ return pair.join(":"); })).join("+");
  };

  var executeAction = function(action, arg){
    ContactManager.startSubApp("SearchApp");
    action(arg);
  };

  var API = {
    listProviders: function(options){
      options || (options = { page: 1 });
      executeAction(ContactManager.SearchApp.List.Controller.listProviders , options);

    },
    listProvidersSub: function(params){
      var options = parseParams(params);
      executeAction(ContactManager.SearchApp.List.Controller.listProvidersSub , options);
      //ProvidersApp.List.Controller.listProvidersSub(options);
      //ContactManager.execute("set:active:header", "contacts");
    },

    showProvider: function(id){
      executeAction(ContactManager.SearchApp.Show.Controller.showProvider , id);
      //ProvidersApp.Show.Controller.showProvider(id);
    }
  };

  ContactManager.on("page:change", function(options){
    console.log("serializeParams(options)"+serializeParams(options));
    ContactManager.navigate("search/filter/" + serializeParams(options));
  });

  ContactManager.on("search:list", function(){
    ContactManager.navigate("search");
    API.listProviders();
  });

  ContactManager.on("search:show", function(id){
    ContactManager.navigate("search/" + id);
    API.showProvider(id);
  });

  this.listenTo(ContactManager, "search:filter", function(options){
    ContactManager.navigate("search/filter/" + serializeParams(options));
  });

  ContactManager.addInitializer(function(){
    new SearchAppRouter.Router({
      controller: API
    });
  });

});
