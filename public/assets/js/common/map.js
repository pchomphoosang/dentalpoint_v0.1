ContactManager.module("Common.Maps", function(Maps, ContactManager, Backbone, Marionette, $, _){
    Maps.Map = Marionette.ItemView.extend({
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