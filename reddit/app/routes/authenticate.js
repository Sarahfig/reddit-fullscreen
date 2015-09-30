import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(window.location.search.length > 2) {
      console.log('got code');
      var search = {};
      window.location.search.substring(1).split('&').forEach(function(value) {
        value = value.split('=');
        search[value[0]] = value[1];
      });
      if(search.state !== this.session.auth.state()) {
        console.error('State mismatch!');
        this.session.set('authState', '');
        return;
      }
      this.session.set('authCode', search.code);
    }
    
    if(!this.session.auth.code()) {
      console.log('No code. Authenticating');
      var state = Math.random().toString(36).substring(7);
      this.session.set('authState', state);
      window.location.replace('https://www.reddit.com/api/v1/authorize?client_id=VVotW8Dp6WU6-w&response_type=code&state=' + state + '&redirect_uri=http://localhost:4200/authenticate&duration=permanent&scope=identity,edit,history,mysubreddits,read,save,submit,vote');
    }
  }
});
