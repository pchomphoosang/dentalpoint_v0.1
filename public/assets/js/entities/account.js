ContactManager.module("Entities", function(Entities, ContactManager, Backbone, Marionette, $, _){
  
  Entities.SessionLogin = Backbone.Model.extend({
      urlRoot: "login",
      defaults :{
        login_status :false
      },
      validation: {
        email: {
          required: true
        },
        password: {
          required: true,
          minLength: 2
        }
      }

  });

  Entities.SessionSingup = Backbone.Model.extend({
      urlRoot: "signup",
      validation: {
        email: {
          required: true
        },
        password: {
          required: true,
          minLength: 2
        }
      }

  });

  Entities.SessionForget = Backbone.Model.extend({
      urlRoot: "forgot",
      validation: {
        email: {
          required: true
        }
      }

  });

  Entities.Sessionlogut = Backbone.Model.extend({
    urlRoot: "logout"
  });
  
  Entities.User = Backbone.Model.extend({
    urlRoot: "account"
  });

  _.extend(Entities.SessionLogin.prototype, Backbone.Validation.mixin);
  _.extend(Entities.SessionSingup.prototype, Backbone.Validation.mixin);
  _.extend(Entities.SessionForget.prototype, Backbone.Validation.mixin);

  var API = {
    getAccount: function(){
      consolo.log("get account");
      var account = new Entities.Account({ });
      account.fetch({            
        success: function(model, response){
          console.log("inside"+JSON.stringify(response));
                //defer.resolve(data);
        },
        error: function(){
                //defer.resolve(undefined);
        }
      });

    },

    getLogin: function(options){
      console.log("Get session-login");
      var session  = new Entities.SessionLogin({});
      /*
          var defer = $.Deferred();
          options || (options = {});
          defer.then(options.success, options.error);
          var response = session.save(_.omit(options, 'success', 'error'));
          response.done(function(){
            defer.resolveWith(response, [session]);
          });
          response.fail(function(){
            defer.rejectWith(response, arguments);
          });
          return defer.promise();
      */
      return session;
    },

    getSingup: function(options){
      console.log("Get session-signup");
      var singup  = new Entities.SessionSingup({});
      return singup;
    },
    // todo
    getsession: function(options){
      console.log("session");
      var session = new Entities.Session();
      return session;
    },

  };

  ContactManager.reqres.setHandler("account:sessionlogin", function(options){
    console.log("session Login");
    return API.getLogin(options);
  });

  ContactManager.reqres.setHandler("account:sessionsingup", function(options){
    console.log("session Signup");
    return API.getSingup(options);
  });

    ContactManager.reqres.setHandler("account:session", function(options){
    console.log("session");
    return API.getsession();
  });

});
