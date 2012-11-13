function facebookLogin() {
    FB.login(function(response) {
        if (response.authResponse) {
            // connected
        } else {
            // cancelled
        }
    });
}

function getFacebookLoginStatus(){
	// Additional init code here
	FB.getLoginStatus(function(response) {
		alert("");
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


// Additional JS functions here
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '376509982436950', // App ID
      channelUrl : 'http://nodeandwebsockets.herokuapp.com/channel.html', // Channel File
      status     : true, // check login status
      cookie     : true, // enable cookies to allow the server to access the session
      xfbml      : true  // parse XFBML
    });

    // Additional init code here
    getFacebookLoginStatus();

  };

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=376509982436950";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));