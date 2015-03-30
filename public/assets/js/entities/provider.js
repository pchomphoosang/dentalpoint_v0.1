ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){

  Entities.Provider = Backbone.Model.extend({
    urlRoot: "providers",
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

    url : function() {
      var url = this.urlRoot +'?owner=' + this.owner;
      if(this.get("id")){
        url = url+'&record='+this.get("id");
      }
      return url;
    },

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

  Entities.ProviderCollection = Backbone.Paginator.clientPager.extend({
    model: Entities.Provider,
    initialize: function(options){

      options || (options = {});

      var params = options.parameters || { page: 1 };
      this.parameters = new Backbone.Model(params);

      this.paginator_core = {
        dataType: "json",
        url: "providers"
      };

      this.paginator_ui = {
         firstPage: 1,
         currentPage: 1,
         perPage: 10,
         pagesInRange: 2
      };

      this.server_api = {
        owner : function() { return params.userId; },
      };

      var self = this;

      this.listenTo(this.parameters, "change", function(params){
            self.goTo(parseInt(self.parameters.get("page"), 10));
            self.trigger("page:change:after");
      });
    },
    comparator: "firstName"
  });

  //Entities.configureStorage(Entities.ContactCollection);

  var API = {

    getContactEntities: function(options){
      console.log(" "+options.parameters.userId); // todo
      var providers = new Entities.ProviderCollection({ parameters: options.parameters});
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

    getContactEntity: function(contactId){
      var contact = new Entities.Provider({id: contactId});
      var defer = $.Deferred();
      contact.fetch({
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

  ContactManager.reqres.setHandler("provider:entities", function(options){

    return API.getContactEntities(options);
  });

  ContactManager.reqres.setHandler("provider:entity", function(id){
    return API.getContactEntity(id);
  });

});
