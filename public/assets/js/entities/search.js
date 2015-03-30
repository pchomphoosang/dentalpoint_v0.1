ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){

  Entities.SearchResult = Backbone.Model.extend({
    urlRoot: "search",
    defaults: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      owner:'',
    },

    initialize: function(options){
        options = options || {};
        this.owner = options.owner;
    },
/*
    url : function() {
      var url = this.urlRoot +'?owner=' + this.owner;
      if(this.get("id")){
        url = url+'&record='+this.get("id");
      }
      return url;
    },
*/
    validate: function(attrs, options) {
      var errors = {}
      if (! attrs.firstName) {
        errors.firstName = "can't be blank";
      }
      if (! attrs.lastName) {
        errors.lastName = "can't be blank";
      }
      else{
        if (attrs.lastName.length < 2) {
          errors.lastName = "is too short";
        }
      }
      if( ! _.isEmpty(errors)){
        return errors;
      }
    }

  });

  //Entities.configureStorage(Entities.Contact);

  //Entities.configureStorage(Entities.Contact);

  Entities.SearchCollection = Backbone.Paginator.clientPager.extend({
    model: Entities.SearchResult,
    initialize: function(options){
      options || (options = {});

      var params = options.parameters || { page: 1 };
      var keys = options.keys || {"Specialist":"*","location":"*"};
      this.parameters = new Backbone.Model(params);
      this.keys = new Backbone.Model(keys);
      this.paginator_core = {
        dataType: "json",
        url: "search"
      };

      this.paginator_ui = {
         firstPage: 1,
         currentPage: 1,
         perPage: 10,
         pagesInRange: 2
      };

      this.server_api = {
        specialist : function() { return keys.Specialist; },
        location : function() { return keys.location; },
      };

      var self = this;

      this.listenTo(this.parameters, "change", function(params){
            self.goTo(parseInt(self.parameters.get("page"), 10));
            self.trigger("page:change:after");
      });
    },
    parse: function(response){
      var data = response;
      console.log('data'+JSON.stringify(data));
      return data;
    },
    comparator: "firstName"
  });

  //Entities.configureStorage(Entities.ContactCollection);

  var API = {

    getSearchEntities: function(options){

      console.log("keysearch: "+JSON.stringify(options) ); // todo
      var providers = new Entities.SearchCollection({ parameters: options.parameters, keys: options.keys});
      var defer = $.Deferred();
      options || (options = {});

      options.reset = true;
      defer.then(options.success, options.error);
      var response = providers.fetch( _.omit(options, 'success', 'error'));
      response.done(function(){
        defer.resolveWith(response, [providers]);
      });
      response.fail(function(){
        defer.rejectWith(response, arguments);
      });
      return defer.promise();
    },

    getContactEntity: function(providerId){
      console.log("providerId:"+providerId);
      var provider = new Entities.SearchResult({id: providerId});
      var defer = $.Deferred();
      provider.fetch({
            success: function(data){
              defer.resolve(data);
            },
            error:function(data){
              defer.resolve(undefined);
            }
      });
      return defer.promise();
    }
  };

  ContactManager.reqres.setHandler("search:entities", function(options){
    return API.getSearchEntities(options);
  });

  ContactManager.reqres.setHandler("search:entity", function(id){
    return API.getContactEntity(id);
  });

});
