ContactManager.module("SearchApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){
  Show.MissingContact = Marionette.ItemView.extend({
    template: "#missing-provider-view"
  });

  Show.Contact = Marionette.ItemView.extend({
    template: "#provider-view",
    className: "container",

    onShow: function(){

      var $body   = $(document.body);
      var navHeight = $('.navbar').outerHeight(true) + 10;

      $('#sidebar').affix({
        offset: {
          top: 30
        }
      });

      $body.scrollspy({
        target: '#leftCol',
        offset: navHeight
      });

      $('a[href*=#]:not([href=#])').click(function() {
          if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html,body').animate({
                scrollTop: target.offset().top - 50
              }, 1000);
              return false;
            }
          }
      });
      
      // review
      $({ someValue: 0 }).animate({ someValue: Math.floor(Math.random() * 3000) }, {
          duration: 3000,
          easing: 'swing', // can be anything
          step: function () { // called on every step
              // Update the element's text with rounded-up value:
              $('.count').text(commaSeparateNumber(Math.round(this.someValue)));
          }
      });

      function commaSeparateNumber(val) {
          while (/(\d+)(\d{3})/.test(val.toString())) {
              val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
          }
          return val;
      }
    }

  });

});
