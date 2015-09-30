import Ember from 'ember';

export default Ember.Service.extend({
  auth: {
    getToken:function() {
      console.log(this);
    },
    refresh:null
  }
});
