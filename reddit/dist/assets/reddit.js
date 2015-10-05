"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('reddit/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'reddit/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('reddit/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'reddit/config/environment'], function (exports, AppVersionComponent, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = AppVersionComponent['default'].extend({
    version: version,
    name: name
  });

});
define('reddit/components/imgur-album', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		currentIndex: 0,
		currentNumber: (function () {
			return this.get('currentIndex') + 1;
		}).property('currentIndex'),
		currentImage: (function () {
			var album = this.get('album');
			return album[this.get('currentIndex')];
		}).property('currentIndex', 'album'),
		totalImages: (function () {
			return this.get('album').length;
		}).property('album'),
		init: function init() {
			Ember['default'].$(window).bind('keypress', Ember['default'].run.bind(this, this.globalKeyPress));
			this._super.apply(this);
		},
		globalKeyPress: function globalKeyPress(e) {
			if (!this.get('album')) {
				return;
			}
			var key = this.bindings.keyMap[e.keyCode];
			var functions = this.bindings.functions;
			var currentIndex = this.get('currentIndex');
			var totalImages = this.get('totalImages');
			if (key === functions.nextImage.getKey()) {
				var next;
				if (currentIndex === totalImages - 1) {
					next = 0;
				} else {
					next = currentIndex + 1;
				}
				this.set('currentIndex', next);
			}
			if (key === functions.previousImage.getKey()) {
				var previous;
				if (currentIndex === 0) {
					previous = totalImages - 1;
				} else {
					previous = currentIndex - 1;
				}
				this.set('currentIndex', previous);
			}
		}
	});

});
define('reddit/components/reddit-list', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		init: function init() {
			Ember['default'].$(window).keypress(Ember['default'].run.bind(this, this.keyPress));
			this._super.apply(this);
		},
		keyPress: function keyPress(e) {
			var key = this.bindings.keyMap[e.keyCode];
			var functions = this.bindings.functions;
			if (key === functions.nextPost.getKey()) {
				this.sendAction('nextPost', e);
				return;
			}
			if (key === functions.previousPost.getKey()) {
				this.sendAction('previousPost', e);
				return;
			}
		},
		actions: {
			upVote: function upVote() {
				this.sendAction('upVote');
			},
			downVote: function downVote() {
				this.sendAction('downVote');
			}
		}
	});

});
define('reddit/components/reddit-nav', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		isHot: (function () {
			return this.get('current') === 'hot';
		}).property('current'),
		isTop: (function () {
			return this.get('current') === 'top';
		}).property('current')
	});

});
define('reddit/components/reddit-post', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		classNameBindings: ['isCurrent:current', 'isPrevious:previous', 'isNext:next', 'isUpVoted:upvoted', 'isDownVoted:downvoted'],
		isCurrent: (function () {
			return this.get('post.isCurrent');
		}).property('post.isCurrent'),
		isPrevious: (function () {
			return this.get('post.isPrevious');
		}).property('post.isPrevious'),
		isNext: (function () {
			return this.get('post.isNext');
		}).property('post.isNext'),
		isUpVoted: (function () {
			return this.get('post.isUpVoted');
		}).property('post.isUpVoted'),
		isDownVoted: (function () {
			return this.get('post.isDownVoted');
		}).property('post.isDownVoted'),
		init: function init() {
			if (this.attrs.post.value.isCurrent) {
				Ember['default'].$(window).bind('keypress', Ember['default'].run.bind(this, this.globalKeyPress));
			}
			this._super.apply(this);
		},
		globalKeyPress: function globalKeyPress(e) {
			if (!this.get('post')) {
				return;
			}
			var key = this.bindings.keyMap[e.keyCode];
			var functions = this.bindings.functions;
			if (key === functions.upVote.getKey()) {
				this.sendAction('upVote');
				if (this.get('post.isUpVoted')) {
					this.set('post.isUpVoted', false);
				} else {
					this.set('post.isUpVoted', true);
				}
				this.set('post.isDownVoted', false);
				return;
			}
			if (key === functions.downVote.getKey()) {
				this.sendAction('downVote');
				if (this.get('post.isDownVoted')) {
					this.set('post.isDownVoted', false);
				} else {
					this.set('post.isDownVoted', true);
				}
				this.set('post.isUpVoted', false);
				return;
			}
		}
	});

});
define('reddit/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('reddit/controllers/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({
		currentIndex: 0,
		previousIndex: function previousIndex() {
			return this.currentIndex - 1;
		},
		nextIndex: function nextIndex() {
			return this.currentIndex + 1;
		},
		list: (function () {
			var list = JSON.parse(JSON.stringify(this.get('model.list')));
			var displayed = [];
			if (list[this.previousIndex()]) {
				displayed.push(list[this.previousIndex()]);
				displayed[0].isPrevious = true;
			}
			displayed.push(list[this.currentIndex]);
			displayed[displayed.length - 1].isCurrent = true;
			if (list[this.nextIndex()]) {
				displayed.push(list[this.nextIndex()]);
				displayed[displayed.length - 1].isNext = true;
			}
			return displayed;
		}).property('model.list', 'currentIndex'),
		actions: {
			nextPost: function nextPost() {
				if (this.currentIndex < this.get('model.list').length - 1) {
					this.set('currentIndex', this.currentIndex + 1);

					if (this.currentIndex === this.get('model.list').length - 2) {
						//load more
						this.send('getMore');
					}
				}
			},
			previousPost: function previousPost() {
				if (this.currentIndex) {
					this.set('currentIndex', this.currentIndex - 1);
				}
			},
			upVote: function upVote() {
				var list = this.get('model.list');
				var current = this.get('currentIndex');
				var post = null;
				list.forEach(function (item, index) {
					if (index === current) {
						post = item;
					}
				});
				if (post.isUpVoted) {
					this.api.post.removeVote(post.name);
					post.isUpVoted = false;
				} else {
					this.api.post.upVote(post.name);
					post.isUpVoted = true;
				}
				post.isDownVoted = false;
			},
			downVote: function downVote() {
				var list = this.get('model.list');
				var current = this.get('currentIndex');
				var post = null;
				list.forEach(function (item, index) {
					if (index === current) {
						post = item;
					}
				});
				if (post.isDownVoted) {
					this.api.post.removeVote(post.name);
					post.isDownVoted = false;
				} else {
					this.api.post.upVote(post.name);
					post.isDownVoted = true;
				}
				post.isUpVoted = false;
			}
		}
	});

});
define('reddit/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('reddit/controllers/top', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    currentIndex: 0,
    previousIndex: function previousIndex() {
      return this.currentIndex - 1;
    },
    nextIndex: function nextIndex() {
      return this.currentIndex + 1;
    },
    list: (function () {
      var list = JSON.parse(JSON.stringify(this.get('model.list')));
      var displayed = [];
      if (list[this.previousIndex()]) {
        displayed.push(list[this.previousIndex()]);
        displayed[0].isPrevious = true;
      }
      displayed.push(list[this.currentIndex]);
      displayed[displayed.length - 1].isCurrent = true;
      if (list[this.nextIndex()]) {
        displayed.push(list[this.nextIndex()]);
        displayed[displayed.length - 1].isNext = true;
      }
      return displayed;
    }).property('model.list', 'currentIndex'),
    actions: {
      nextPost: function nextPost() {
        if (this.currentIndex < this.get('model.list').length - 1) {
          this.set('currentIndex', this.currentIndex + 1);

          if (this.currentIndex === this.get('model.list').length - 2) {
            //load more
            this.send('getMore');
          }
        }
      },
      previousPost: function previousPost() {
        if (this.currentIndex) {
          this.set('currentIndex', this.currentIndex - 1);
        }
      },
      upVote: function upVote() {
        var list = this.get('model.list');
        var current = this.get('currentIndex');
        var post = null;
        list.forEach(function (item, index) {
          if (index === current) {
            post = item;
          }
        });
        if (post.isUpVoted) {
          this.api.post.removeVote(post.name);
          post.isUpVoted = false;
        } else {
          this.api.post.upVote(post.name);
          post.isUpVoted = true;
        }
        post.isDownVoted = false;
      },
      downVote: function downVote() {
        var list = this.get('model.list');
        var current = this.get('currentIndex');
        var post = null;
        list.forEach(function (item, index) {
          if (index === current) {
            post = item;
          }
        });
        if (post.isDownVoted) {
          this.api.post.removeVote(post.name);
          post.isDownVoted = false;
        } else {
          this.api.post.upVote(post.name);
          post.isDownVoted = true;
        }
        post.isUpVoted = false;
      }
    }
  });

});
define('reddit/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'reddit/config/environment'], function (exports, initializerFactory, config) {

  'use strict';

  var _config$APP = config['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;

  exports['default'] = {
    name: 'App Version',
    initialize: initializerFactory['default'](name, version)
  };

});
define('reddit/initializers/export-application-global', ['exports', 'ember', 'reddit/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('reddit/initializers/services', ['exports'], function (exports) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    // application.register('service:session', application.session);
    // application.register('service:api', application.api);

    //inject into routes
    application.inject('route', 'session', 'service:session');
    application.inject('route', 'api', 'service:api');
    application.inject('route', 'parse', 'service:parser');

    //inject into components
    application.inject('component', 'bindings', 'service:keybindings');

    //inject into controllers
    application.inject('controller', 'api', 'service:api');

    //inject into services
    application.inject('service:api', 'session', 'service:session');
    application.inject('service:parser', 'api', 'service:api');
  }

  exports['default'] = {
    name: 'services',
    initialize: initialize
  };

});
define('reddit/router', ['exports', 'ember', 'reddit/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('index', { path: '/' });
    this.route('authenticate');
    this.route('top');
  });

  exports['default'] = Router;

});
define('reddit/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function model() {
      return {
        user: this.session.account.user()
      };
    }
  });

});
define('reddit/routes/authenticate', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function beforeModel() {
      var self = this;
      var fn = self.functions;
      var token = fn.getToken(self);
      console.log('got token:', token);
      if (!token) {
        return;
      }
      self.api.account.getMe().then(function (response) {
        self.session.set('accountUser', response);
        var page = localStorage.originalRoute || 'index';
        localStorage.originalRoute = '';
        self.transitionTo(page);
      });
    },

    functions: {
      getToken: function getToken($scope) {
        if (window.location.hash.length > 2) {
          var params = {};
          window.location.hash.substring(1).split('&').forEach(function (value) {
            value = value.split('=');
            params[value[0]] = value[1];
          });
          if (params.state !== $scope.session.auth.state()) {
            console.error('State mismatch!');
            $scope.session.set('authState', '');
            return false;
          }
          $scope.session.set('authToken', params.access_token);
          $scope.session.set('authExpires', new Date().getTime() + params.expires_in * 1000);
          return params.access_token;
        }
        if (!$scope.session.auth.token() || $scope.session.auth.expires() < new Date().getTime()) {
          var state = Math.random().toString(36).substring(7);
          $scope.session.set('authState', state);
          var clientId, redirectDomain;
          if (window.location.hostname === 'localhost') {
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

});
define('reddit/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		beforeModel: function beforeModel() {
			if (this.session.auth.needed()) {
				this.transitionTo('authenticate');
			}
		},
		model: function model() {
			var self = this;
			return this.api.front.get().then(function (response) {
				var model = {};
				model.after = response.data.after;
				model.list = self.parse.listings(response.data.children);
				return model;
			});
		},
		actions: {
			self: undefined,
			getMore: function getMore() {
				var after = this.get('context.after');
				var self = this;
				this.api.front.getMore(after).then(function (response) {
					var list = self.get('currentModel.list');
					var newStuff = self.parse.listings(response.data.children);
					var combined = list.concat(newStuff);
					self.set('currentModel.list', combined);
				});
			}
		}
	});

});
define('reddit/routes/top', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		beforeModel: function beforeModel() {
			if (this.session.auth.needed()) {
				localStorage.originalRoute = 'top';
				this.transitionTo('authenticate');
			}
		},
		model: function model() {
			var self = this;
			var scope = this.session.account.preferences.topScope() || 'week';
			return this.api.top.get(scope).then(function (response) {
				var model = {};
				model.scope = scope;
				model.after = response.data.after;
				model.list = self.parse.listings(response.data.children);
				return model;
			});
		},
		actions: {
			self: undefined,
			getMore: function getMore() {
				var after = this.get('context.after');
				var scope = this.get('context.scope');
				var self = this;
				this.api.top.getMore(after, scope).then(function (response) {
					var list = self.get('currentModel.list');
					var newStuff = self.parse.listings(response.data.children);
					var combined = list.concat(newStuff);
					self.set('currentModel.list', combined);
				});
			}
		}
	});

});
define('reddit/services/api', ['exports', 'ember', 'reddit/utils/ajax'], function (exports, Ember, Ajax) {

	'use strict';

	var reddit = {
		domain: 'https://oauth.reddit.com/',
		base: function base() {
			return this.domain + 'api/';
		},
		token: function token() {
			return 'Bearer ' + localStorage.authToken;
		},
		auth: function auth() {
			return {
				headers: {
					'Authorization': this.token()
				}
			};
		}
	};
	var imgur = {
		domain: 'https://api.imgur.com/',
		base: function base() {
			return this.domain + '3/';
		},
		token: 'Client-ID 5f84998ba19cca5',
		auth: function auth() {
			return {
				headers: {
					'Authorization': this.token
				}
			};
		}
	};

	exports['default'] = Ember['default'].Service.extend({
		account: {
			getMe: function getMe() {
				return new Ajax['default']().get(reddit.base() + 'v1/me', null, reddit.auth());
			}
		},
		front: {
			get: function get() {
				return new Ajax['default']().get(reddit.domain, null, reddit.auth());
			},
			getMore: function getMore(after) {
				return new Ajax['default']().get(reddit.domain, { after: after }, reddit.auth());
			}
		},
		top: {
			get: function get(scope) {
				return new Ajax['default']().get(reddit.domain + '/top', { t: scope }, reddit.auth());
			},
			getMore: function getMore(after, scope) {
				return new Ajax['default']().get(reddit.domain + '/top', { t: scope, after: after }, reddit.auth());
			}
		},
		post: {
			upVote: function upVote(id) {
				return new Ajax['default']().post(reddit.base() + 'vote', {
					id: id,
					dir: 1
				}, reddit.auth());
			},
			downVote: function downVote(id) {
				return new Ajax['default']().post(reddit.base() + 'vote', {
					id: id,
					dir: -1
				}, reddit.auth());
			},
			removeVote: function removeVote(id) {
				return new Ajax['default']().post(reddit.base() + 'vote', {
					id: id,
					dir: 0
				}, reddit.auth());
			},
			getImgurAlbum: function getImgurAlbum(id) {
				return new Ajax['default']().get(imgur.base() + 'album/' + id, null, imgur.auth());
			}
		}
	});

});
define('reddit/services/keybindings', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	var KeyFunction = function KeyFunction(data) {
		Ember['default'].$.extend(this, data);
		this.user = function () {
			return localStorage[data.name] ? localStorage[data.name] : 'default';
		};
		return this;
	};
	KeyFunction.prototype.getKey = function () {
		if (this.user() === 'default') {
			return this['default'];
		}
		return this.user();
	};
	exports['default'] = Ember['default'].Service.extend({
		functions: {
			nextPost: new KeyFunction({
				'default': 'D',
				description: 'Move to next post',
				name: 'keyNextPost'
			}),
			previousPost: new KeyFunction({
				'default': 'A',
				description: 'Move to previous post',
				name: 'keyPreviousPost'
			}),
			upVote: new KeyFunction({
				'default': 'W',
				description: 'Upvote currently viewed post',
				name: 'keyUpvote'
			}),
			downVote: new KeyFunction({
				'default': 'S',
				description: 'Downvote currently viewed post',
				name: 'keyDownVote'
			}),
			nextImage: new KeyFunction({
				'default': 'E',
				description: 'Move to next image in album',
				name: 'keyNextImage'
			}),
			previousImage: new KeyFunction({
				'default': 'Q',
				description: 'Move to previous image in album',
				name: 'keyPreviousImage'
			})
		},
		keyMap: {
			97: 'A',
			98: 'B',
			99: 'C',
			100: 'D',
			101: 'E',
			102: 'F',
			103: 'G',
			104: 'H',
			105: 'I',
			106: 'J',
			107: 'K',
			108: 'L',
			109: 'M',
			110: 'N',
			111: 'O',
			112: 'P',
			113: 'Q',
			114: 'R',
			115: 'S',
			116: 'T',
			117: 'U',
			118: 'V',
			119: 'W',
			120: 'X',
			121: 'Y',
			122: 'Z',
			13: 'Enter',
			16: 'Shift',
			17: 'Control',
			18: 'Alt',
			27: 'Escape',
			33: 'Page Up',
			34: 'Page Down',
			35: 'End',
			36: 'Home',
			37: 'Left Arrow',
			38: 'Up Arrow',
			39: 'Right Arrow',
			40: 'Down Arrow',
			45: 'Insert',
			46: 'Delete',
			48: '0',
			49: '1',
			50: '2',
			51: '3',
			52: '4',
			53: '5',
			54: '6',
			55: '7',
			56: '8',
			57: '9'
		}
	});

});
define('reddit/services/parser', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Service.extend({
		listings: function listings(list) {
			var self = this;
			var mapped = list.map(function (item) {
				var data = item.data,
				    parsed = {
					author: data.author,
					comments: data.permalink,
					created: data.created,
					domain: data.domain,
					downs: data.downs,
					id: data.id,
					isSelf: data.is_self,
					media: data.media,
					embed: data.media_embed,
					name: data.name,
					numComments: data.num_comments,
					nsfw: data.over_18,
					saved: data.saved,
					score: data.score,
					subreddit: data.subreddit,
					subredditId: data.subreddit_id,
					thumbnail: data.thumbnail,
					title: data.title,
					ups: data.ups,
					url: data.url
				};
				if (parsed.thumbnail === 'self' || !parsed.thumbnail) {
					parsed.hasThumbnail = false;
				} else {
					parsed.hasThumbnail = true;
				}
				if (!parsed.media) {
					if (parsed.url.toLowerCase().match(/\.(jpg|png|gif)/g)) {
						parsed.isImage = true;
					} else if (parsed.url.indexOf('imgur.com/a/') !== -1) {
						parsed.isAlbum = true;
						self.album(parsed);
					} else if (parsed.url.indexOf('imgur.com/') !== -1) {
						parsed.isImage = true;
						parsed.url = parsed.url + '.jpg';
					} else if (parsed.url.indexOf('livememe.com/') !== -1) {
						parsed.isImage = true;
						var id = parsed.url.split('com/')[1];
						parsed.url = 'http://e.lvme.me/' + id + '.jpg';
					} else {
						parsed.isArticle = true;
						if (parsed.thumbnail === 'self' || !parsed.thumbnail) {
							parsed.isArticleNoThumbnail = true;
						} else {
							parsed.isArticleThumbnail = true;
						}
					}
				} else {
					if (parsed.media.oembed.type === 'video') {
						parsed.isVideo = true;
						parsed.html = Ember['default'].$('<div/>').html(parsed.media.oembed.html).text();
						var html = parsed.html;
						if (html.indexOf('youtube.com') > -1) {
							var insertAt = html.indexOf('&schema=youtube');
							var newhtml = [html.slice(0, insertAt), '&autoplay=1', html.slice(insertAt)].join('');
							parsed.html = newhtml;
						}
					} else if (parsed.url.indexOf('imgur.com/a/') !== -1) {

						parsed.isAlbum = true;
						self.album(parsed);
					} else {
						parsed.isArticle = true;
						if (parsed.thumbnail === 'self' || !parsed.thumbnail) {
							parsed.isArticleNoThumbnail = true;
						} else {
							parsed.isArticleThumbnail = true;
						}
						console.log('unsupported media type', parsed);
					}
				}
				return parsed;
			});
			return mapped;
		},
		album: function album(parsed) {
			var id = parsed.url.split('a/')[1];
			this.api.post.getImgurAlbum(id).then(function (response) {
				parsed.album = response.data.images;
			});
		}
	});

});
define('reddit/services/session', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Service.extend({
    auth: {
      expires: function expires() {
        return localStorage.authExpires;
      },
      state: function state() {
        return localStorage.authState;
      },
      token: function token() {
        return localStorage.authToken;
      },
      needed: function needed() {
        if (!this.token() || this.expires() < new Date().getTime()) {
          return true;
        }
        return false;
      }
    },
    account: {
      user: function user() {
        if (!localStorage.accountUser) {
          return null;
        }
        return JSON.parse(localStorage.accountUser);
      },
      preferences: {
        topScope: function topScope() {
          if (!localStorage.preferencesTopScope) {
            return null;
          }
          return localStorage.preferencesTopScope;
        }
      }
    },
    set: function set(property, value) {
      if (typeof value === 'object') {
        localStorage[property] = JSON.stringify(value);
      } else {
        localStorage[property] = value;
      }
    }
  });

});
define('reddit/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("p");
        var el2 = dom.createTextNode("\n	Signed in as ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        return morphs;
      },
      statements: [
        ["content","model.user.name",["loc",[null,[2,14],[2,33]]]],
        ["content","outlet",["loc",[null,[5,0],[5,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/templates/authenticate', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/authenticate.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["content","outlet",["loc",[null,[1,0],[1,10]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/templates/components/imgur-album', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/components/imgur-album.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","album-image");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","album-nav");
        var el2 = dom.createTextNode("Viewing ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode(" of ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(fragment, [2]);
        var morphs = new Array(3);
        morphs[0] = dom.createAttrMorph(element0, 'style');
        morphs[1] = dom.createMorphAt(element1,1,1);
        morphs[2] = dom.createMorphAt(element1,3,3);
        return morphs;
      },
      statements: [
        ["attribute","style",["concat",["background-image: url(",["get","currentImage.link",["loc",[null,[1,56],[1,73]]]],")"]]],
        ["content","currentNumber",["loc",[null,[2,31],[2,48]]]],
        ["content","totalImages",["loc",[null,[2,52],[2,67]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/templates/components/reddit-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 3,
              "column": 0
            }
          },
          "moduleName": "reddit/templates/components/reddit-list.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("	");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
          return morphs;
        },
        statements: [
          ["inline","reddit-post",[],["tagName","li","post",["subexpr","@mut",[["get","post",["loc",[null,[2,33],[2,37]]]]],[],[]],"upVote","upVote","downVote","downVote"],["loc",[null,[2,1],[2,75]]]]
        ],
        locals: ["post"],
        templates: []
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/components/reddit-list.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["block","each",[["get","list",["loc",[null,[1,16],[1,20]]]]],[],0,null,["loc",[null,[1,0],[3,9]]]]
      ],
      locals: [],
      templates: [child0]
    };
  }()));

});
define('reddit/templates/components/reddit-nav', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/components/reddit-nav.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("ul");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/");
        var el4 = dom.createTextNode("Hot");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("li");
        var el3 = dom.createElement("a");
        dom.setAttribute(el3,"href","/top");
        var el4 = dom.createTextNode("Top");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element0, [3]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element1, 'class');
        morphs[1] = dom.createAttrMorph(element2, 'class');
        return morphs;
      },
      statements: [
        ["attribute","class",["concat",[["subexpr","if",[["get","isHot",[]],"current",""],[],[]]]]],
        ["attribute","class",["concat",[["subexpr","if",[["get","isTop",[]],"current",""],[],[]]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/templates/components/reddit-post', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 2
              },
              "end": {
                "line": 5,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","image");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element2, 'style');
            return morphs;
          },
          statements: [
            ["attribute","style",["concat",["background-image:url(",["get","post.url",["loc",[null,[4,52],[4,60]]]],")"]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 6,
                "column": 2
              },
              "end": {
                "line": 8,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createUnsafeMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","post.html",["loc",[null,[7,3],[7,18]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child2 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 9,
                "column": 2
              },
              "end": {
                "line": 11,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","image");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element1, 'style');
            return morphs;
          },
          statements: [
            ["attribute","style",["concat",["background-image:url(",["get","post.thumbnail",["loc",[null,[10,52],[10,66]]]],")"]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child3 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 2
              },
              "end": {
                "line": 14,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","no-image");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      var child4 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 15,
                "column": 2
              },
              "end": {
                "line": 17,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["inline","imgur-album",[],["elementId","album","album",["subexpr","@mut",[["get","post.album",["loc",[null,[16,41],[16,51]]]]],[],[]]],["loc",[null,[16,3],[16,53]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 1
            },
            "end": {
              "line": 18,
              "column": 1
            }
          },
          "moduleName": "reddit/templates/components/reddit-post.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(5);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          morphs[1] = dom.createMorphAt(fragment,1,1,contextualElement);
          morphs[2] = dom.createMorphAt(fragment,2,2,contextualElement);
          morphs[3] = dom.createMorphAt(fragment,3,3,contextualElement);
          morphs[4] = dom.createMorphAt(fragment,4,4,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","post.isImage",["loc",[null,[3,8],[3,20]]]]],[],0,null,["loc",[null,[3,2],[5,9]]]],
          ["block","if",[["get","post.isVideo",["loc",[null,[6,8],[6,20]]]]],[],1,null,["loc",[null,[6,2],[8,9]]]],
          ["block","if",[["get","post.isArticleThumbnail",["loc",[null,[9,8],[9,31]]]]],[],2,null,["loc",[null,[9,2],[11,9]]]],
          ["block","if",[["get","post.isArticleNoThumbnail",["loc",[null,[12,8],[12,33]]]]],[],3,null,["loc",[null,[12,2],[14,9]]]],
          ["block","if",[["get","post.isAlbum",["loc",[null,[15,8],[15,20]]]]],[],4,null,["loc",[null,[15,2],[17,9]]]]
        ],
        locals: [],
        templates: [child0, child1, child2, child3, child4]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 19,
                "column": 2
              },
              "end": {
                "line": 21,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","image");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(1);
            morphs[0] = dom.createAttrMorph(element0, 'style');
            return morphs;
          },
          statements: [
            ["attribute","style",["concat",["background-image:url(",["get","post.thumbnail",["loc",[null,[20,52],[20,66]]]],")"]]]
          ],
          locals: [],
          templates: []
        };
      }());
      var child1 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.7",
            "loc": {
              "source": null,
              "start": {
                "line": 21,
                "column": 2
              },
              "end": {
                "line": 23,
                "column": 2
              }
            },
            "moduleName": "reddit/templates/components/reddit-post.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("			");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1,"class","no-image");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() { return []; },
          statements: [

          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.7",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 1
            },
            "end": {
              "line": 24,
              "column": 1
            }
          },
          "moduleName": "reddit/templates/components/reddit-post.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [
          ["block","if",[["get","post.hasThumbnail",["loc",[null,[19,8],[19,25]]]]],[],0,1,["loc",[null,[19,2],[23,9]]]]
        ],
        locals: [],
        templates: [child0, child1]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 29,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/components/reddit-post.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","display");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","info");
        var el2 = dom.createTextNode("\n	");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("a");
        dom.setAttribute(el2,"class","title");
        dom.setAttribute(el2,"target","_blank");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element3 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]),1,1);
        morphs[1] = dom.createAttrMorph(element3, 'href');
        morphs[2] = dom.createMorphAt(element3,0,0);
        return morphs;
      },
      statements: [
        ["block","if",[["get","post.isCurrent",["loc",[null,[2,7],[2,21]]]]],[],0,1,["loc",[null,[2,1],[24,8]]]],
        ["attribute","href",["concat",[["get","post.url",["loc",[null,[27,12],[27,20]]]]]]],
        ["content","post.title",["loc",[null,[27,54],[27,68]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('reddit/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/index.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","reddit-nav",[],["tagName","nav","current","hot"],["loc",[null,[1,0],[1,42]]]],
        ["inline","reddit-list",[],["tagName","ul","elementId","list","list",["subexpr","@mut",[["get","list",["loc",[null,[2,49],[2,53]]]]],[],[]],"nextPost","nextPost","previousPost","previousPost","upVote","upVote","downVote","downVote"],["loc",[null,[2,0],[2,139]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/templates/top', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.7",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 3,
            "column": 0
          }
        },
        "moduleName": "reddit/templates/top.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        morphs[1] = dom.createMorphAt(fragment,2,2,contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [
        ["inline","reddit-nav",[],["tagName","nav","current","top"],["loc",[null,[1,0],[1,42]]]],
        ["inline","reddit-list",[],["tagName","ul","elementId","list","list",["subexpr","@mut",[["get","list",["loc",[null,[2,49],[2,53]]]]],[],[]],"nextPost","nextPost","previousPost","previousPost","upVote","upVote","downVote","downVote"],["loc",[null,[2,0],[2,139]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('reddit/tests/app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('app.js should pass jshint', function(assert) { 
    assert.ok(true, 'app.js should pass jshint.'); 
  });

});
define('reddit/tests/components/imgur-album.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/imgur-album.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/imgur-album.js should pass jshint.'); 
  });

});
define('reddit/tests/components/reddit-list.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/reddit-list.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/reddit-list.js should pass jshint.'); 
  });

});
define('reddit/tests/components/reddit-nav.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/reddit-nav.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/reddit-nav.js should pass jshint.'); 
  });

});
define('reddit/tests/components/reddit-post.jshint', function () {

  'use strict';

  QUnit.module('JSHint - components');
  QUnit.test('components/reddit-post.js should pass jshint', function(assert) { 
    assert.ok(true, 'components/reddit-post.js should pass jshint.'); 
  });

});
define('reddit/tests/controllers/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/index.js should pass jshint.'); 
  });

});
define('reddit/tests/controllers/top.jshint', function () {

  'use strict';

  QUnit.module('JSHint - controllers');
  QUnit.test('controllers/top.js should pass jshint', function(assert) { 
    assert.ok(true, 'controllers/top.js should pass jshint.'); 
  });

});
define('reddit/tests/helpers/resolver', ['exports', 'ember/resolver', 'reddit/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('reddit/tests/helpers/resolver.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/resolver.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('reddit/tests/helpers/start-app', ['exports', 'ember', 'reddit/app', 'reddit/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('reddit/tests/helpers/start-app.jshint', function () {

  'use strict';

  QUnit.module('JSHint - helpers');
  QUnit.test('helpers/start-app.js should pass jshint', function(assert) { 
    assert.ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('reddit/tests/initializers/services.jshint', function () {

  'use strict';

  QUnit.module('JSHint - initializers');
  QUnit.test('initializers/services.js should pass jshint', function(assert) { 
    assert.ok(true, 'initializers/services.js should pass jshint.'); 
  });

});
define('reddit/tests/integration/components/imbur-album-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('imbur-album', 'Integration | Component | imbur album', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'imbur-album', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'imbur-album', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('reddit/tests/integration/components/imbur-album-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/imbur-album-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/imbur-album-test.js should pass jshint.'); 
  });

});
define('reddit/tests/integration/components/reddit-list-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('reddit-list', 'Integration | Component | reddit list', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'reddit-list', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'reddit-list', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('reddit/tests/integration/components/reddit-list-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/reddit-list-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/reddit-list-test.js should pass jshint.'); 
  });

});
define('reddit/tests/integration/components/reddit-nav-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('reddit-nav', 'Integration | Component | reddit nav', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 14
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'reddit-nav', ['loc', [null, [1, 0], [1, 14]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'reddit-nav', [], [], 0, null, ['loc', [null, [2, 4], [4, 19]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('reddit/tests/integration/components/reddit-nav-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/reddit-nav-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/reddit-nav-test.js should pass jshint.'); 
  });

});
define('reddit/tests/integration/components/reddit-post-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('reddit-post', 'Integration | Component | reddit post', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 15
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'reddit-post', ['loc', [null, [1, 0], [1, 15]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.7',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.7',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'reddit-post', [], [], 0, null, ['loc', [null, [2, 4], [4, 20]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('reddit/tests/integration/components/reddit-post-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - integration/components');
  QUnit.test('integration/components/reddit-post-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'integration/components/reddit-post-test.js should pass jshint.'); 
  });

});
define('reddit/tests/router.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('router.js should pass jshint', function(assert) { 
    assert.ok(true, 'router.js should pass jshint.'); 
  });

});
define('reddit/tests/routes/application.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/application.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('reddit/tests/routes/authenticate.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/authenticate.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/authenticate.js should pass jshint.'); 
  });

});
define('reddit/tests/routes/index.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/index.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('reddit/tests/routes/top.jshint', function () {

  'use strict';

  QUnit.module('JSHint - routes');
  QUnit.test('routes/top.js should pass jshint', function(assert) { 
    assert.ok(true, 'routes/top.js should pass jshint.'); 
  });

});
define('reddit/tests/services/api.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/api.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/api.js should pass jshint.'); 
  });

});
define('reddit/tests/services/keybindings.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/keybindings.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/keybindings.js should pass jshint.'); 
  });

});
define('reddit/tests/services/parser.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/parser.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/parser.js should pass jshint.'); 
  });

});
define('reddit/tests/services/session.jshint', function () {

  'use strict';

  QUnit.module('JSHint - services');
  QUnit.test('services/session.js should pass jshint', function(assert) { 
    assert.ok(true, 'services/session.js should pass jshint.'); 
  });

});
define('reddit/tests/test-helper', ['reddit/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('reddit/tests/test-helper.jshint', function () {

  'use strict';

  QUnit.module('JSHint - .');
  QUnit.test('test-helper.js should pass jshint', function(assert) { 
    assert.ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('reddit/tests/unit/controllers/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/application-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/controllers/authenticate-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:authenticate', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('reddit/tests/unit/controllers/authenticate-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/authenticate-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/authenticate-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/controllers/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('reddit/tests/unit/controllers/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/index-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/index-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/controllers/top-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:top', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('reddit/tests/unit/controllers/top-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/controllers');
  QUnit.test('unit/controllers/top-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/controllers/top-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/initializers/services-test', ['ember', 'reddit/initializers/services', 'qunit'], function (Ember, services, qunit) {

  'use strict';

  var registry, application;

  qunit.module('Unit | Initializer | services', {
    beforeEach: function beforeEach() {
      Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        application.deferReadiness();
      });
    }
  });

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    services.initialize(registry, application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });

});
define('reddit/tests/unit/initializers/services-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/initializers');
  QUnit.test('unit/initializers/services-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/initializers/services-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/models/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('application', 'Unit | Model | application', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('reddit/tests/unit/models/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/models');
  QUnit.test('unit/models/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/models/application-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('reddit/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/application-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/routes/authenticate-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:authenticate', 'Unit | Route | authenticate', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('reddit/tests/unit/routes/authenticate-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/authenticate-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/authenticate-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:index', 'Unit | Route | index', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('reddit/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/index-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/index-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/routes/top-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:top', 'Unit | Route | top', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('reddit/tests/unit/routes/top-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/routes');
  QUnit.test('unit/routes/top-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/routes/top-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/services/ajax-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:ajax', 'Unit | Service | ajax', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('reddit/tests/unit/services/ajax-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/ajax-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/ajax-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/services/api-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:api', 'Unit | Service | api', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('reddit/tests/unit/services/api-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/api-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/api-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/services/keybindings-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:keybindings', 'Unit | Service | keybindings', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('reddit/tests/unit/services/keybindings-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/keybindings-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/keybindings-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/services/parser-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:parser', 'Unit | Service | parser', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('reddit/tests/unit/services/parser-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/parser-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/parser-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/services/session-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:session', 'Unit | Service | session', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('reddit/tests/unit/services/session-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/services');
  QUnit.test('unit/services/session-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/services/session-test.js should pass jshint.'); 
  });

});
define('reddit/tests/unit/utils/ajax-test', ['reddit/utils/ajax', 'qunit'], function (ajax, qunit) {

  'use strict';

  qunit.module('Unit | Utility | ajax');

  // Replace this with your real tests.
  qunit.test('it works', function (assert) {
    var result = ajax['default']();
    assert.ok(result);
  });

});
define('reddit/tests/unit/utils/ajax-test.jshint', function () {

  'use strict';

  QUnit.module('JSHint - unit/utils');
  QUnit.test('unit/utils/ajax-test.js should pass jshint', function(assert) { 
    assert.ok(true, 'unit/utils/ajax-test.js should pass jshint.'); 
  });

});
define('reddit/tests/utils/ajax.jshint', function () {

  'use strict';

  QUnit.module('JSHint - utils');
  QUnit.test('utils/ajax.js should pass jshint', function(assert) { 
    assert.ok(true, 'utils/ajax.js should pass jshint.'); 
  });

});
define('reddit/utils/ajax', ['exports', 'ember'], function (exports, Ember) {

  'use strict';



  exports['default'] = ajax;
  function ajax() {
    return {
      post: function post(url, data, other) {
        return new Ember['default'].RSVP.Promise(function (resolve, reject) {
          Ember['default'].$.ajax({
            type: 'POST',
            url: url,
            headers: other.headers ? other.headers : {},
            data: data,
            success: function success(response) {
              resolve(response);
            },
            error: function error(response) {
              reject(response);
            }
          });
        });
      },
      get: function get(url, data, other) {
        return new Ember['default'].RSVP.Promise(function (resolve, reject) {
          Ember['default'].$.ajax({
            type: 'GET',
            url: url,
            headers: other.headers ? other.headers : {},
            data: data,
            success: function success(response) {
              resolve(response);
            },
            error: function error(response) {
              reject(response);
            }
          });
        });
      }
    };
  }

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('reddit/config/environment', ['ember'], function(Ember) {
  var prefix = 'reddit';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("reddit/tests/test-helper");
} else {
  require("reddit/app")["default"].create({"name":"reddit","version":"0.0.0+e04c72ad"});
}

/* jshint ignore:end */
//# sourceMappingURL=reddit.map