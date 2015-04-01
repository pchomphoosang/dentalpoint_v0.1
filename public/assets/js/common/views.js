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
    className: "col-xs-12 col-sm-12 col-md-6 col-lg-6",

    init_map: function(index){
        var latitudes = [13.688031, 38.898537, 38.8507126, 38.84753];
        var longitudes = [100.647662, -77.13208299999997, -77.09903600000001, -77.06577290000001];
        var myLocation = new google.maps.LatLng(latitudes[index], longitudes[index]);
        var mapOptions = {
            center: myLocation,
            zoom: 16
        };
        var marker = new google.maps.Marker({
            position: myLocation,
            title: "Property Location"
        });
        var map = new google.maps.Map(document.getElementById("map"),mapOptions);
        marker.setMap(map);
    },

    onShow: function(){
        this.init_map(0);

        this.$el.affix({
          offset: {
            top: 30
          }
        });
      
    },

    searchClicked: function(e){

    }
  });

});