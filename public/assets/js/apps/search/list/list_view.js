ContactManager.module("SearchApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
    List.Contact = Marionette.ItemView.extend({
    tagName: "div",
    className:"row provider-list-item",
    template: "#provider-list-item",

    events: {
      "click": "highlightName",
      "click a.js-show": "showClicked",
      "click button.js-delete": "deleteClicked",
      "mouseover .row": "hover"
    },
    hover: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger("search:maker", this.model);
    },
    flash: function(cssClass){
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function(){
        setTimeout(function(){
          $view.toggleClass(cssClass)
        }, 500);
      });
    },
    
    highlightName: function(e){
      this.$el.toggleClass("warning");
    },

    showClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      this.trigger("search:show", this.model);
    },

    deleteClicked: function(e){
      e.stopPropagation();
      this.trigger("search:delete", this.model);
    },

    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  var NoProviderView = Marionette.ItemView.extend({
    template: "#provider-list-none",
    tagName: "tr",
    className: "alert"
  });
  
  List.Contacts = Marionette.CompositeView.extend({
    tagName: "div",
    className: "container provider-list",
    template: "#provider-list",
    emptyView: NoProviderView,
    childView: List.Contact,
  });

  List.Layout = Marionette.LayoutView.extend({
    template: "#provider-list-layout",

    regions: {
      panelRegion: "#panel-region",
      contactsRegion: "#contacts-region",
      mapRegion: "#map-region"
    }
  });

  List.Search = Marionette.ItemView.extend({
    template: "#search-panel",
    className:"panel panel-default panel-search ",
    events: {
      "click button.btn": "searchClicked"
    },
    initialize: function(options){

        if(options.keys){
          this.update = true;
          this.keys   = options.keys;
        }
    },
    onShow: function(){
/*
      this.$el.affix({
        offset: {
          top: 30
        }
      });
*/ 
     if (this.keys) {
        console.log("this.keys:::"+JSON.stringify(this.keys) );
        $("select[class=form-control] option[value='"+ this.keys.Specialist +"']").attr('selected', 'selected');

        $("select[class=form-control] option[value='"+ this.keys.location +"']").attr('selected', 'selected');
     }
    },
    searchClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      var expert = this.$("#search-doc option:selected").text();
      var keylocate = this.$("#search-location option:selected").text();
      var  data = {Specialist : expert , location: keylocate};
      this.trigger("submit:search", data );
    }
  });

});
