import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var self = this;
    var fn = self.functions;
    var token = fn.getToken(self);
    console.log('got token:', token);
    if(!token) {
      return;
    }
    self.api.account.getMe().then(function(response) {
      self.session.set('accountUser', response);
	  var page = localStorage.originalRoute || 'index';
	  localStorage.originalRoute = '';
      self.transitionTo(page);
    });
  },

  functions: {
    getToken: function($scope) {
      if(window.location.hash.length > 2) {
        var params = {};
        window.location.hash.substring(1).split('&').forEach(function(value) {
          value = value.split('=');
          params[value[0]] = value[1];
        });
        if(params.state !== $scope.session.auth.state()) {
          console.error('State mismatch!');
          $scope.session.set('authState', '');
          return false;
        }
        $scope.session.set('authToken', params.access_token);
        $scope.session.set('authExpires', new Date().getTime() + (params.expires_in * 1000));
        return params.access_token;
      }
      if(!$scope.session.auth.token() || $scope.session.auth.expires() < new Date().getTime()) {
        var state = Math.random().toString(36).substring(7);
        $scope.session.set('authState', state);
		var clientId, redirectDomain;
		if(window.location.hostname === 'localhost') {
			clientId = 'ZWE3iZH2TyAp8g';
			redirectDomain = 'http://localhost:4200';
		} else {
			clientId = '1Q-yPT8mA68PNQ';
			redirectDomain = 'http://reddittv.wattydev.com';
		}
        window.location.replace('https://www.reddit.com/api/v1/authorize?client_id=' + clientId + '&response_type=token&state=' + state + '&redirect_uri=' + redirectDomain + '/authenticate&scope=identity,edit,history,mysubreddits,read,save,submit,vote');
        return false;
      }
    }
  }
});
