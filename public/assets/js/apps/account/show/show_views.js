ContactManager.module("AccountApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){


  Show.Login = ContactManager.ContactsApp.Common.Views.Form.extend({
    template: "#login-template",
    title: "Sign In",
    events: {
      "click  .forget": "forget",
      "click  .signup": "signup",
      "click button.js-submit": "submitClicked"
    },
    forget: function(e){
      e.preventDefault();
      ContactManager.trigger("account:forget");
    },
    signup: function(e){
      e.preventDefault();
      ContactManager.trigger("account:signup");
    }
  });


  Show.Signup = ContactManager.ContactsApp.Common.Views.Form.extend({ 
    template: "#signup-template",
    title: "SignUp"
  });

  Show.Forget = ContactManager.ContactsApp.Common.Views.Form.extend({
    title: "Forgot Password",
    template: "#forget-template"
  });

  Show.Profile= Marionette.ItemView.extend({
    template: "#profile-template",
    className:"container"
  }); 

  Show.Reset = Marionette.ItemView.extend({
    template: "#reset-template"
  });

  Show.Logout = ContactManager.ContactsApp.Common.Views.Form.extend({
    template: "#logout-template",
    title: "Logout",
    triggers: {
      "click  .logout": "view:logout",
      "click  .off": "dialog:close"
    }
  }); 


  Show.MissingContact = Marionette.ItemView.extend({
    template: "#message"
  });
  
});