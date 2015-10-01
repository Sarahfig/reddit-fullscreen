import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var fn = this.functions;
    var token = fn.getToken(this);
    console.log('got token:', token);
    if(!token) {
      return;
    }
    this.transitionTo('index');
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

      if(!$scope.session.auth.token()) {
        var state = Math.random().toString(36).substring(7);
        $scope.session.set('authState', state);
        window.location.replace('https://www.reddit.com/api/v1/authorize?client_id=ZWE3iZH2TyAp8g&response_type=token&state=' + state + '&redirect_uri=http://localhost:4200/authenticate&scope=identity,edit,history,mysubreddits,read,save,submit,vote');
        return false;
      }
    }
  }
});
