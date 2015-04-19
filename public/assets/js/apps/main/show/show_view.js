ContactManager.module("MainApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){

  Show.MainPage = Marionette.ItemView.extend({
    template: "#main-view",
    className: "container",
    events: {
      "click button.btn": "searchClicked"
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
