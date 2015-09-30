import Ember from 'ember';
import Promise from 'rsvp/promise';

export default Ember.Service.extend({
  post: function(url, data) {
    return new Promise(function(resolve, reject) {
      Ember.$.ajax({
        type:'POST',
        url: url,
        data: data,
        success: function(response) {
          console.log('returned', response);
          resolve(response);
        },
        error: function(response) {
          reject(response);
        }
      });
    });
  }
});
