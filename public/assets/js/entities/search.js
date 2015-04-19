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

  Entities.SearchCollection = Backbone.Paginator.requestPager.extend({
    model: Entities.SearchResult,

    initialize: function(options){
      options || (options = {});

      var params = options.parameters || { page: 1 };
      this.parameters = new Backbone.Model(params);

      var keys = options.keys || {"Specialist":"All Specialities","location":"Bangkok"};
      console.log('options.parameters:::'+JSON.stringify(keys));
      this.keys = new Backbone.Model(keys);

      this.paginator_core = {
        dataType: "json",
        url: "search?"
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
        count: function() { return this.perPage },
        offset: function() { return ((this.parameters.get("page") || 1) - 1) * this.perPage },
        filter: function() { return this.parameters.get("criterion"); }
      };

      var self = this;

      this.listenTo(this.parameters, "change", function(model){
        if(_.has(model.changed, "criterion")){
          self.server_api.filter = self.parameters.get("criterion");
        }
        $.when(this.pager()).done(function(){
          self.trigger("page:change:after");

          self.trigger("map:change");
        });
      });

      this.on("sync", function(){
        this.sort({silent: true});
        this.trigger("reset");
      });
    },
    parse: function(response){

      var data = response.result;
      this.totalRecords = response.resultCount;
      this.totalPages = Math.ceil(this.totalRecords / this.perPage);
      this.currentPage = this.parameters.get("page");
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
