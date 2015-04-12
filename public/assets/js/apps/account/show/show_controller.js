ContactManager.module("AccountApp.Show", function(Show, ContactManager, Backbone, Marionette, $, _){

	Show.Controller = {

		showLogin: function(){

			var loginsession = new ContactManager.Entities.SessionLogin();
			var loginview = new Show.Login({
				 	model: loginsession
			});
			
			loginview.on('form:submit',function(data){
				var savingSession = loginsession.save(data, {wait: true});
				if(savingSession){
					$.when(savingSession).done(function(data){

					   console.log("success:data:"+JSON.stringify(data));
					   loginview.trigger("dialog:close");
					   ContactManager.trigger("header:update",data.user);

					}).fail(function(response){

					   console.log("response:"+response.status);
					   console.log("response___:"+JSON.stringify(response));
					   if(response.status === 422){
					   		console.log("response_/:"+response.responseJSON.errors);
		                    loginview.triggerMethod("form:data:invalid", response.responseJSON.errors);
		               }else{
		                    alert("generic.unprocessedError");
		               }
					});
				}else{
				   loginview.triggerMethod("form:data:invalid", loginsession.validationError);
				}
			});

			ContactManager.dialogRegion.show(loginview);		
		},
		sociallogin: function(userId){
			if (userId) {
				var user = new ContactManager.Entities.User({id: userId});
			  	var fetchprofile = user.fetch();
				$.when(fetchprofile).done(function(data){
					console.log("profile:" +JSON.stringify(data));
					var profile  = new ContactManager.Entities.User(data);
					ContactManager.trigger("header:update",data);
				}).fail(function(response){
					console.log("response:"+response.status);
					console.log("response___:"+JSON.stringify(response));
					if(response.status === 422){
			             alert("generic.unprocessedError");
			        } else{
			            alert("generic.unprocessedError");
			        }
				});

			}
		},

		showSignup: function(){

			var user = new ContactManager.Entities.SessionSingup({});

			subview = new Show.Signup({
				model: user
			});

			subview.on('form:submit',function(data){

				var savingUser = user.save(data, {wait: true});
				if (savingUser) {
					$.when(savingUser).done(function(data){

					   console.log("success:data:"+JSON.stringify(data));
					   subview.trigger("dialog:close");
					   ContactManager.trigger("header:update",data.user);

					}).fail(function(response){
					  console.log("response:"+response.status);
					  console.log("response___:"+JSON.stringify(response));
				  	  if(response.status === 422){
	                    subview.triggerMethod("form:data:invalid", response.responseJSON.errors);
	                  }
	                  else{
	                    alert("generic.unprocessedError");
	                  }

					});
				} else {
					console.log("user.validationError:"+JSON.stringify(user.validationError));
					subview.triggerMethod("form:data:invalid", user.validationError)
				}
			});

			ContactManager.dialogRegion.show(subview);
		},
		showLogout: function(){
			
			var logoutV = new Show.Logout();
			logoutV.on("view:logout",function(){
				console.log('send logout');
				var sessionout = new ContactManager.Entities.Sessionlogut();
				var outuser = sessionout.fetch();
				$.when(outuser).done(function(data){

					   console.log("success:data:"+JSON.stringify(data));
					   if(data.success){
						   	logoutV.trigger("dialog:close");
						   	ContactManager.trigger("header:default");
					   }

					}).fail(function(response){
					  console.log("response:"+response.status);
					  console.log("response___:"+JSON.stringify(response));
				  	  if(response.status === 422){
	                    logoutV.triggerMethod("form:data:invalid", response.responseJSON.errors);
	                  }
	                  else{
	                    alert("generic.unprocessedError");
	                  }

				});
			});

			ContactManager.dialogRegion.show(logoutV);
		},
		// --- todo more --//
		showForget: function(){
			var forgetobj  = new ContactManager.Entities.SessionForget();
			var forgetV = new Show.Forget();
			forgetV.on("form:submit",function(data){
				console.log("data"+JSON.stringify(data));
				var queryforget = forgetobj.save(data);
				if ( queryforget ) {
					$.when(queryforget).done(function(data){

					}).fail(function(response){
						  console.log("response:"+response.status);
						  console.log("response___:"+JSON.stringify(response));
					  	  if(response.status === 422){
		                    forgetV.triggerMethod("form:data:invalid", response.responseJSON.errors);
		                  }
		                  else{
		                    alert("generic.unprocessedError");
		                  }
					});
				}else {
					forgetV.triggerMethod("form:data:invalid", forgetobj.validationError)
				}
			});

			ContactManager.dialogRegion.show(forgetV);
		},
		showProfile: function(userId){

			if (userId) {

				var user = new ContactManager.Entities.User({id: userId});
			  	var fetchprofile = user.fetch();
				$.when(fetchprofile).done(function(data){

					console.log("profile:" +JSON.stringify(data));
					var profile  = new ContactManager.Entities.User(data);
					var profileV = new Show.Profile({model: profile });
					ContactManager.mainRegion.show(profileV);

				}).fail(function(response){
					console.log("response:"+response.status);
					console.log("response___:"+JSON.stringify(response));
					if(response.status === 422){
			             forgetV.triggerMethod("form:data:invalid", response.responseJSON.errors);
			        } else{
			            alert("generic.unprocessedError");
			        }
				});

			}
		},
		showReset: function(){
			var resetV = new Show.Reset();
			ContactManager.mainRegion.show(resetV);
		},
		getAccount: function() {
			var account = ContactManager.request("account:entities");
			console.log('get account data'+JSON.stringify(account));
		}
	};
});