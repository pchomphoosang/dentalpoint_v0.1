ContactManager.module("SearchApp.List", function(List, ContactManager, Backbone, Marionette, $, _){
    List.Contact = Marionette.ItemView.extend({
    tagName: "div",
    className:"row provider-list-item",
    template: "#provider-list-item",

    events: {
      "click": "highlightName",
      "click a.js-show": "showClicked",
      "click button.js-delete": "deleteClicked"
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
      console.log('------.>??'+ this.model.id);
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
    className:"panel panel-default panel-search",
    events: {
      "click button.btn": "searchClicked"
    },
    onShow: function(){
      /*
      this.$el.affix({
        offset: {
          top: 30
        }
      });
      */
    },
    searchClicked: function(e){
      e.preventDefault();
      e.stopPropagation();
      var expert = this.$(".search-doc option:selected").text();
      var keylocate = this.$(".search-location option:selected").text();
      var  data = {Specialist : expert , location: keylocate};
      this.trigger("submit:search", data );
    }
  });

});
