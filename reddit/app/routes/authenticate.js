import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    var fn = this.functions;
    if(!fn.getCode(this)) {
      return;
    }
    this.api.auth.getToken().then(function(response) {
      console.log('got token', response);
    });

  },

  functions: {
    getCode: function($scope) {
      if(window.location.search.length > 2) {
        var search = {};
        window.location.search.substring(1).split('&').forEach(function(value) {
          value = value.split('=');
          search[value[0]] = value[1];
        });
        if(search.state !== $scope.session.auth.state()) {
          console.error('State mismatch!');
          $scope.session.set('authState', '');
          return false;
        }
        $scope.session.set('authCode', search.code);
        return search.code;
      }

      if(!$scope.session.auth.code()) {
        var state = Math.random().toString(36).substring(7);
        $scope.session.set('authState', state);
        window.location.replace('https://www.reddit.com/api/v1/authorize?client_id=VVotW8Dp6WU6-w&response_type=code&state=' + state + '&redirect_uri=http://localhost:4200/authenticate&duration=permanent&scope=identity,edit,history,mysubreddits,read,save,submit,vote');
        return false;
      }
    }
  }
});
