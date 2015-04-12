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
      paginationMainRegion: ".js-pagination-main"
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

      // todo //
      var mapView = new Views.Map();

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
      console.log(JSON.stringify(options));
      this.collection = options.collection;
    },
    init_map: function() {
      
        _.each(this.collection, function(provider){
          console.log('provider:'+JSON.stringify(provider));
        });
        
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            mapTypeId: 'roadmap'
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions );
        map.setTilt(45);
        
        var markers = [
            ['Bangkok Hosital, Bangkok', 13.749370, 100.583448],
            ['Bumrungrad International Hospital Bangkok, Bangkok', 13.746256, 100.552327],
            ['The Parkland Grand Taksin, Bangkok', 13.716477, 100.480532],
            ['Park Plaza, Bangkok', 13.735086, 100.560660],
            ['Asoke Residence Sukhumvit, Bangkok', 13.746836, 100.561734],
            ['MBK Center Phayathai Road Bangkok, Bangkok', 13.744633, 100.529990],
            ['Centara Grand at Central Plaza Ladprao,Bangkok', 13.817435, 100.562745],
            ['Union Mall, Bangkok', 13.813684, 100.562316],
            ['Horwang School, Bangkok', 13.819060, 100.562574],
            ['Surasak Montri School,Bangkok', 13.776091, 100.560514]
        ];
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        var arrMarkers = {};
        for( i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            
            marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: markers[i][0],
                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    animation: google.maps.Animation.DROP
            });
            arrMarkers[i] = marker;
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(markers[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }
    },

    onShow: function(){
        this.init_map( );

        this.$el.affix({
          offset: {
            top: 30
          }
        });
      
    },

    searchClicked: function(e){
      
       for( j = 0; j < markers.length; j++ ) {
         if (j === i) {
            arrMarkers[j].setIcon('');
         }else {
            arrMarkers[j].setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
         }
       }
    }
  });

});