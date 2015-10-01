import Ember from 'ember';

export default function ajax() {
  return {
    post: function(url, data, other) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
          type:'POST',
          url: url,
          headers: other.headers ? other.headers : {},
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
    },
    get: function(url, data, other) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
          type:'GET',
          url: url,
          headers: other.headers ? other.headers : {},
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
  };
}
