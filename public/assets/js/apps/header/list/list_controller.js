ContactManager.module("HeaderApp.List", function(List, AppManager,Backbone, Marionette, $, _){
	
	// session object
	List.session = new  ContactManager.Entities.Session();
	var Controller = Marionette.Controller.extend({
		listHeader: function(user){
			var headers;
			if (user){
				List.session.set('authenticated', true);
				List.session.set('email',user.email);
				List.session.set('profile.name',user.profile.name);
				List.session.set('userId',user._id);
			}

			var  auth = List.session.get('authenticated');
			if ( auth === null ){

				header  = new ContactManager.Entities.Header({
						firstName:'',
						lastName:'',
						email:'',
						user_id:'',
						login_status: false
				});
				headers = new List.Headers({model:header});
			} else {

				var obj = new ContactManager.Entities.Header({
						firstName:List.session.get('profile.name'),
						lastName:'',
						email:List.session.get('email'),
						user_id:List.session.get('userId'),
						login_status: true
				});
				headers = new List.Headers({model:obj});

			}
			
			ContactManager.headerRegion.show(headers);
		},
		defaultHeader: function(){
			List.session.clear();
			this.listHeader();
		}
	});
	List.Controller = new Controller();
});