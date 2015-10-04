import Ember from 'ember';
import Ajax from 'reddit/utils/ajax';

var reddit = {
	domain:'https://oauth.reddit.com/',
	base: function() {
		return this.domain + 'api/';
	},
	token: function() {
      return 'Bearer ' + localStorage.authToken;
  },
  auth: function() {
    return {
      headers: {
        'Authorization': this.token()
      }
    };
  }
};
var imgur = {
	domain: 'https://api.imgur.com/',
	base: function() {
		return this.domain + '3/';
	},
	token: 'Client-ID 5f84998ba19cca5',
	auth: function() {
		return {
			headers: {
				'Authorization': this.token
			}
		};
	}
};

export default Ember.Service.extend({
	account: {
		getMe: function() {
			return new Ajax().get(reddit.base() + 'v1/me', null, reddit.auth());
		}
	},
	front: {
		get: function() {
			return new Ajax().get(reddit.domain, null, reddit.auth());
		},
		getMore: function(after) {
			return new Ajax().get(reddit.domain, {after:after}, reddit.auth());
		}
	},
	top: {
		get: function(scope) {
			return new Ajax().get(reddit.domain + '/top', {t:scope}, reddit.auth());
		},
		getMore: function(after, scope) {
			return new Ajax().get(reddit.domain + '/top', {t:scope, after:after}, reddit.auth());
		}
	},
	post: {
		upVote: function(id) {
			return new Ajax().post(reddit.base() + 'vote', {
				id: id,
				dir: 1
			}, reddit.auth());
		},
		downVote: function(id) {
			return new Ajax().post(reddit.base() + 'vote', {
				id: id,
				dir: -1
			}, reddit.auth());
		},
		removeVote: function(id) {
			return new Ajax().post(reddit.base() + 'vote', {
				id: id,
				dir: 0
			}, reddit.auth());
		},
		getImgurAlbum: function(id) {
			return new Ajax().get(imgur.base() + 'album/' + id, null, imgur.auth());
		}
	}
});
