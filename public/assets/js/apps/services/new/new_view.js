ContactManager.module("ContactsApp.New", function(New, ContactManager, Backbone, Marionette, $, _){

      New.UploadItem = Marionette.ItemView.extend({
	      template: "#UploadItem",
	      tagName:'tr',

	      initialize: function(options) {
	        this.file = options.file;
	        this.xhr = new XMLHttpRequest();
	      },

	      events:{
	        'click .upload-img':'uploadwithProgress', 
	        'click .cancel-img':'abort'
	      },
	      abort: function() {
	        console.log("abort");
	        this.xhr.abort();
	        this.xhr.upload.addEventListener('abort', function(e) {
	            that.$('.text-danger').append('<span class="label label-danger">Cancel Uploading</span>');
	        });
	      },
      	  uploadwithProgress: function ( ) {

              that = this;
              var formData = new FormData();
              formData.append('photo', this.file);   

              this.xhr.open('post', 'api/uploads', true);
                          
              this.xhr.addEventListener('loadstart', function(e) {
                            that.$('.progress').removeClass('hide')
              },false);

              this.xhr.addEventListener('progress', function(e) {
                          // While sending and loading data.
                   if (e.lengthComputable) {
                        var percentage = (e.loaded / e.total) * 100;
                        console.log("percentage :" + percentage);
                        that.$('.progress-bar').css('width', percentage + '%').text(percentage+'%');
                   }
              },false);

              this.xhr.addEventListener('load', function(e) {
                          // When the request has *successfully* completed.
                          // Even if the server hasn't responded that it finished.
                          console.log("upload success");
                          that.$('.text-danger').append('<span class="label label-success">Finished upload</span>');
                          that.$('.upload-img').addClass('hide');
              },false);

              this.xhr.addEventListener('error', function(e) {
                          // When the request has failed.
                          var err = 'An error occurred while submitting the form. Maybe your file is too big';
                          console.log("errror");
                          that.$('.text-danger').append('<span class="label label-danger">Error</span>');
              },false);

              this.xhr.onload = function(e) {
              	  
               	  if(this.status==200){
					that.trigger("uploadfile:success", JSON.parse(this.response));
               	  }else{
               	  	console.log("this.error: "+this.response);
               	  }
			  };

               this.xhr.send(formData);
          }
  });

  New.fileInput = Backbone.Model.extend({
      defaults: {
           filename: '',
           filesize: '',
           pic: ''
      }
  });

  New.Contact = ContactManager.ContactsApp.Common.Views.Form.extend({
    title: "New Service",
    template: "#service-form",
    initialize: function(options) {
      that =this;
    	this.temp = { };
    	this.view   = {};
      that.pic="";
	},
    onShow: function( ){
	    this.$el.find('.procedures').multiselect({
	    	selectedList: 4
	    });	   
  	},
    onRender: function(){
      	this.$(".js-submit").text("Create Service");
    },
    events:{
        'click .dropdown-menu li':'save',
        'change input#fileInput':'update',
        'click button.js-submit': 'submitClicked'
    },

    update: function(e){;
    	console.log("upload file");
    	var file_  = $('input[name="fileInput"]')[0].files[0];
    	var $tbody = this.$("tbody");
    	var file_info   = new New.fileInput({filename: file_.name,filesize:file_.size});
        this.view   = new New.UploadItem({
              model: file_info,
              file: file_
        });
        this.view.render();
        this.view.on("uploadfile:success", function(data){
        	that.pic = data.pic;
      	});
        $tbody.append(this.view.el);
    },

    submitClicked: function(e){

      e.preventDefault();
      e.stopPropagation();
      var data = Backbone.Syphon.serialize(this);
      	  data.location = this.$(".location option:selected").text();
      	  data.specialist = this.$(".specialist option:selected").text();
      	  data.pic = that.pic;
		  var procedures = []; 
		  $('.procedures :selected').each(function(i, selected){ 
		   	procedures[i] = $(selected).text(); 
		  });
		  data.procedures = procedures;
      this.trigger("form:submit", data);
    }
  });


});
