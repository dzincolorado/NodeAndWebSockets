function facebookLogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            // connected
            window.location = "/auth/facebook/callback";
        } else {
            // cancelled
        }
    });
}

function getFacebookLoginStatus(){
	// Additional init code here
	FB.getLoginStatus(function(response) {
	    if (response.status === 'connected') {
	        // connected
	    } else if (response.status === 'not_authorized') {
	        // not_authorized
	        facebookLogin();
	    } else {
	        // not_logged_in
	        facebookLogin();
	    }
	});
}


// Load the SDK's source Asynchronously
  (function(d, debug){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
     ref.parentNode.insertBefore(js, ref);
   }(document, /*debug*/ false));

// Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : appId, // App ID
      channelUrl : cbUrl, // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true,  // parse XFBML
      oauth		 : true
    });

    // Additional init code here
    getFacebookLoginStatus();

  };