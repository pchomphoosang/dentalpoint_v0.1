ContactManager.module("SearchApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
  Show.MissingContact = Marionette.ItemView.extend({
    template: "#missing-provider-view"
  });

  Show.Contact = Marionette.ItemView.extend({
    template: "#provider-view",
    events: {
      "click a.page-scroll": "moveSection"
    },
    initialize: function( ){

    },
    onShow: function(){

      $("#nav-provider").affix({
        offset: { 
            top: 195 
     	}
      });
    },
    moveSection: function(ev){
      var $anchor = $(ev.target);
      var $view   = this.$el;
      $('html, body').stop().animate({
            	scrollTop: $($anchor.attr('href')).offset().top
      }, 1200, 'easeInOutExpo');

    }

  });

});
