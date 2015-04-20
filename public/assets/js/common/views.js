ContactManager.module("Common.Views", function(Views, ContactManager, Backbone, Marionette, $, _){
  Views.Loading = Marionette.ItemView.extend({
    template: "#loading-view",

    initialize: function(options){
      var options = options || {};
      this.title = options.title || "Loading Data";
      this.message = options.message || "Please wait, data is loading.";
    },

    serializeData: function(){
      return {
        title: this.title,
        message: this.message
      }
    },

    onShow: function(){
      var opts = {
        lines: 13, // The number of lines to draw
        length: 20, // The length of each line
        width: 10, // The line thickness
        radius: 30, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: "#000", // #rgb or #rrggbb
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: "spinner", // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: "30px", // Top position relative to parent in px
        left: "auto" // Left position relative to parent in px
      };
      $("#spinner").spin(opts);
    }
  });


  Views.PaginationControls = Marionette.ItemView.extend({
    template: "#pagination-controls",
    className: "pagination text-center",

    initialize: function(options){
      this.paginatedCollection = options.paginatedCollection;
      this.urlBase = options.urlBase;
      this.listenTo(this.paginatedCollection,"page:change:after", this.render);
    },

    events: {
      "click a[class=navigatable]": "navigateToPage"
    }
  });

  _.extend(Views.PaginationControls.prototype, {
    
    navigateToPage: function(e){
      e.preventDefault();
      var page = parseInt($(e.target).data("page"), 10);
      this.paginatedCollection.parameters.set("page", page);
      this.trigger("page:change", page);
    },

    serializeData: function(){
      var data = this.paginatedCollection.info(),
        url = this.urlBase,
        criterion = this.paginatedCollection.parameters.get("criterion");

        if(criterion){
              url += "criterion:" + criterion + "+";
        }
        url += "page:";
        data.urlBase = url;
      return data;
    }
  });

  Views.PaginatedView = Marionette.LayoutView.extend({
    template: "#paginated-view",

    regions: {
      paginationControlsRegion: ".js-pagination-controls",
      paginationMainRegion: ".js-pagination-main",
    },
    
    initialize: function(options){
      this.collection = options.collection;
      var eventsToPropagate = options.propagatedEvents || [];

      var controls = new Views.PaginationControls({
        paginatedCollection: this.collection,
        urlBase: options.paginatedUrlBase
      });

      var listView = new options.mainView({
        collection: this.collection
      });


      var self = this;
      this.listenTo(controls, "page:change", function(page){
        self.trigger("page:change", page);
      });

      _.each(eventsToPropagate, function(evt){
        self.listenTo(listView, evt, function(view,model){
            self.trigger(evt,view,model);
        });
      });

      this.on("show", function(){
        this.paginationControlsRegion.show(controls);
        this.paginationMainRegion.show(listView);
      });
    }

  });

  Views.Map = Marionette.ItemView.extend({
    template: "#map-view",
    className: "map-frame col-xs-12 col-sm-12 col-md-9 col-lg-9",

    initialize: function(options){
      this.listenTo(this.collection ,"map:change", function(){
         this.init_map();
      });
      
      this.arrMarkers = {};
    },
    init_map: function() {

        that = this;
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            mapTypeId: 'roadmap'
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions );
        map.setTilt(45);

        infoWindow = new google.maps.InfoWindow();
        
        var i =0;
        var marker;
        this.collection.forEach(function(e) {

            var position = new google.maps.LatLng(e.attributes.maploc[0], e.attributes.maploc[1]);
            bounds.extend(position);

            marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: e.attributes.location,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    animation: google.maps.Animation.DROP
            });
            that.arrMarkers[i] = marker;
            google.maps.event.addListener(marker, 'click', (function(marker) {
                return function() {
                    infoWindow.setContent(e.attributes.location);
                    infoWindow.open(map, marker);
                }
            })(marker));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
            i++;
        });
    },

    onShow: function(){

        this.init_map( );
      /*
        this.$el.affix({
          offset: {
            top: 30
          }
        });
      */
    },

    hightlight: function( model ){

      var position = new google.maps.LatLng(model.attributes.maploc[0], model.attributes.maploc[1]);

       for( j = 0; j < this.collection.length ; j++ ) {
          var coodi = [this.arrMarkers[j].position.k , this.arrMarkers[j].position.D ];
          var focus = [position.k , position.D ];
          if (coodi[0]==focus[0] && coodi[1]==focus[1]){
              this.arrMarkers[j].setIcon('');
          }else {
              this.arrMarkers[j].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
          }

       }

    }
    
  });

});