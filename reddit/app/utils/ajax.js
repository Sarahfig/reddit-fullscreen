import Ember from 'ember';

export default function ajax() {
  return {
    post: function(url, data, other) {
      return new Ember.RSVP.Promise(function(resolve, reject) {
        Ember.$.ajax({
          type:'POST',
          url: url,
          data: data,
          headers: other.headers ? other.headers : {},
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
