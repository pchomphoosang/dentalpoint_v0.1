ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){


	Entities.BaseModel = Backbone.Model.extend({
	    refresh: function(serverData, keys){
	      var previousAttributes = this.previousAttributes();
	      var changed = this.changedAttributes();

	      this.set(serverData);
	      if(changed){
	        this.set(changed, {silent: true});
	        keys = _.difference(keys, _.keys(changed))
	      }
	      var clientSide = _.pick(previousAttributes, keys);
	      var serverSide = _.pick(serverData, keys);
	      this.set({
	        changedOnServer: ! _.isEqual(clientSide, serverSide)
	      }, {silent: true});
	    },

	    sync: function(method, model, options){
	      return Backbone.Model.prototype.sync.call(this, method, model, options);
	    }
	});

	Entities.Session = Backbone.Model.extend({

      initialize: function(){

          //Check for sessionStorage support
          if(Storage && sessionStorage){
              this.supportStorage = true;
          }
      },
      set: function(key, value){
          if(this.supportStorage){
              sessionStorage.setItem(key, value);
          }else{
              Backbone.Model.prototype.set.call(this, key, value);
          }
          return this;
      },
      get: function(key){
          if(this.supportStorage){
              var data = sessionStorage.getItem(key);
              if(data && data[0] === '{'){
                  return JSON.parse(data);
              }else{
                  return data;
              }
          }else{
              return Backbone.Model.prototype.get.call(this, key);
          }
      },
      unset : function(key){
          if(this.supportStorage){
              sessionStorage.removeItem(key);
          }else{
              Backbone.Model.prototype.unset.call(this, key);
          }
          return this;   
      },
      clear : function(){
          if(this.supportStorage){
              sessionStorage.clear();
          }else{
              Backbone.Model.prototype.clear(this);
          }
      }
	});

});