ContactManager.module("ContactsApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
  Show.Controller = {
    showContact: function(id){
      var loadingView = new ContactManager.Common.Views.Loading({
        title: "Artificial Loading Delay",
        message: "Data loading is delayed to demonstrate using a loading view."
      });
      ContactManager.mainRegion.show(loadingView);

      var fetchingContact = ContactManager.request("provider:entity", id, {
        error: function(xhr, responseText, error){
          console.log("Some error happened (processed in error callback)");
        }
      });

      $.when(fetchingContact).done(function(contact){

        console.log("contact :"+JSON.stringify( contact ));

        if(contact !== undefined){
          contactView = new Show.Contact({
            model: contact
          });

          contactView.on("contact:edit", function(contact){
            ContactManager.trigger("contact:edit", contact.get("id"));
          });
        }
        else{
          contactView = new Show.MissingContact();
        }      
        ContactManager.mainRegion.show(contactView);

      }).fail(function(response){
            console.log("Some error happened (processed in deferred's fail callback)");
          if(response.status === 404){
            var contactView = new Show.MissingContact();
            ContactManager.mainRegion.show(contactView);

          } else if( response.status === 422 ){
            view.triggerMethod("form:data:invalid", response.responseJSON.errors);

          } else {
             alert("An unprocessed error happened. Please try again!");
             
          }
      });
    }
  }
});
