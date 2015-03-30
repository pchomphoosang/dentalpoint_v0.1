ContactManager.module("ContactsApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
  List.Controller = {
    listContacts: function(options){
      var loadingView = new ContactManager.Common.Views.Loading();
      ContactManager.mainRegion.show(loadingView);

      //var fetchingContacts = ContactManager.request("contact:entities");
      var fetchingContacts = ContactManager.request("provider:entities",{ parameters:options });
      var contactsListLayout = new List.Layout();
      var contactsListPanel = new List.Panel();

      $.when(fetchingContacts).done(function(contacts){
        
          if(options.criterion){

            contacts.parameters.set({
              page:1,
              criterion: options.criterion 
            });
            contactsListPanel.once("show", function(){
              contactsListPanel.triggerMethod("set:filter:criterion", options.criterion);
            });
          }
          console.log("contacts>>:"+JSON.stringify(contacts));


          var contactsListView = new List.Contacts({
            collection: contacts
          });

          contactsListPanel.on("contacts:filter", function(filterCriterion){
            contacts.parameters.set({
              page: 1,
              criterion: filterCriterion
            });
            ContactManager.trigger("contacts:filter", _.clone(contacts.parameters.attributes));
          });

          contactsListLayout.on("show", function(){
            contactsListLayout.panelRegion.show(contactsListPanel);
            contactsListLayout.contactsRegion.show(contactsListView);
          });

              contactsListPanel.on("contact:new", function(){
                var newContact = new ContactManager.Entities.Provider({owner:options.userId});

                var view = new ContactManager.ContactsApp.New.Contact({
                  model: newContact
                });

                view.on("form:submit", function(data){

                  var savingContact = newContact.save(data);
                  if(savingContact){
                     $.when(savingContact).done(function(){

                        var num =1;
                        if(contacts.length > 0){
                            num  = contacts.length +1;
                        }
                        newContact.set({id : num});
                        console.log("new-contract"+JSON.stringify(newContact) );
                        contacts.add(newContact);
                        view.trigger("dialog:close");
                        var newContactView = contactsListView.children.findByModel(newContact);

                        if(newContactView){
                          newContactView.flash("success");
                        }

                     }).fail(function(response){
                        
                        view.onDestroy = function(){
                          newContact.set(newContact.previousAttributes());
                        };

                        if(response.status === 422){
                          view.triggerMethod("form:data:invalid", response.responseJSON.errors);
                        }
                        else{
                          alert("generic.unprocessedError");
                        }

                     });
                  }else {
                    view.triggerMethod("form:data:invalid", newContact.validationError);
                  }
                });

                ContactManager.dialogRegion.show(view);
              });

              contactsListView.on("childview:contact:show", function(childView, args){
                ContactManager.trigger("contact:show", args.model.get("id"));
              });

              contactsListView.on("childview:contact:edit", function(childView, args){
                var model = args.model;
                var view = new ContactManager.ContactsApp.Edit.Contact({
                  model: model
                });

                view.on("form:submit", function(data){

                  var savingContact = model.save(data);
                  if(savingContact){

                    $.when(savingContact).done(function(){
                       childView.render();
                       view.trigger("dialog:close");
                       childView.flash("success");

                    }).fail(function(response){
                       console.log("response.status:"+response.status);
                        view.onDestroy = function(){
                          model.set(model.previousAttributes());
                        };
                        
                       if(response.status === 422){
                          var serverSide = response.responseJSON.entity
                          var previousAttributes = model.previousAttributes();
                          var changed = model.changedAttributes();
                          console.log("serverSide:"+JSON.stringify(serverSide));
                          console.log("previousAttributes:"+JSON.stringify(previousAttributes));
                          console.log("changed:"+JSON.stringify(changed));
                           model.set(serverSide);
                           model.set(changed);
                           view.render();
                          view.triggerMethod("form:data:invalid",response.responseJSON.errors);
                        }else{
                          alert("An unprocessed error happened. Please try again!");
                        }

                    });

                  } else {
                    view.triggerMethod("form:data:invalid", model.validationError);
                  }

                });

                ContactManager.dialogRegion.show(view);
              });

              contactsListView.on("childview:contact:delete", function(childView, args){
                args.model.destroy();
              });

          ContactManager.mainRegion.show(contactsListLayout);

      }).fail(function(response){
           console.log('resss:'+response.status);
      });
    }
  }
});
