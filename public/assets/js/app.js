Marionette.Region.Dialog = Marionette.Region.extend({
  onShow: function(view){
    this.listenTo(view, "dialog:close", this.closeDialog);

    var self = this;
    this.$el.dialog({
      modal: true,
      title: view.title,
      width: "auto",
      close: function(e, ui){
        self.closeDialog();
      }
    });
  },

  closeDialog: function(){
    console.log('closeDialog');
    this.stopListening();
    this.empty();
    this.$el.dialog("destroy");
  }
  
});

var ContactManager = new Marionette.Application();

ContactManager.addRegions({
  headerRegion: "#header-region",
  messageRegion: "#message-region",
  mainRegion: "#main-region",
  dialogRegion: Marionette.Region.Dialog.extend({
      el: "#dialog-region"
  })
});


ContactManager.navigate = function(route,  options){
  options || (options = {});
  Backbone.history.navigate(route, options);
};

ContactManager.getCurrentRoute = function(){

  return Backbone.history.fragment
};


ContactManager.startSubApp = function(appName, args){

  var currentApp = ContactManager.module(appName);
  if (ContactManager.currentApp === currentApp){ return; }

  if (ContactManager.currentApp){
   ContactManager.currentApp.stop();
  }

  ContactManager.currentApp = currentApp;
  currentApp.start(args);
};

ContactManager.on("start", function(){

  if(Backbone.history){
    
    Backbone.history.start();

    if(this.getCurrentRoute() === ""){
      ContactManager.trigger("main:show");
    }
  }
});
