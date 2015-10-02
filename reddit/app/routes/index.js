import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    if(this.session.auth.needed()) {
      this.transitionTo('authenticate');
    }
  },
	model: function() {
		return this.api.front.get().then(function(response) {
			var model = {};
			model.after = response.data.after;
			model.list = response.data.children.map(function(item) {
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
					url: data.url,
				};
		  		if(parsed.thumbnail === 'self' || !parsed.thumbnail) {
					parsed.hasThumbnail = false;
				} else {
					parsed.hasThumbnail = true;
				}
				if(!parsed.media) {
					if(parsed.url.toLowerCase().match(/\.(jpg|png|gif)/g)) {
						parsed.isImage = true;
					} else if(parsed.url.indexOf('imgur.com/a/') !== -1){
						parsed.isAlbum = true;
					} else if(parsed.url.indexOf('imgur.com/') !== -1) {
						parsed.isImage = true;
						parsed.url = parsed.url + '.jpg';
					} else if (parsed.url.indexOf('livememe.com/' !== -1)) {
						parsed.isImage = true;
						var id = parsed.url.split('com/')[1];
						parsed.url = 'http://e.lvme.me/' + id + '.jpg';
					} else {
						parsed.isArticle = true;
						if(parsed.thumbnail === 'self' || !parsed.thumbnail) {
							parsed.isArticleNoThumbnail = true;
						} else {
							parsed.isArticleThumbnail = true;
						}
					}
				} else {
					if(parsed.media.oembed.type === 'video') {
						parsed.isVideo = true;
						parsed.html = Ember.$('<div/>').html(parsed.media.oembed.html).text();
					} else if(parsed.url.indexOf('imgur.com/a/') !== -1){
						parsed.isAlbum = true;
					} else {
						console.log('unsupported media type', parsed);
					}
				}
				return parsed;
			});
			return model;
		});
	}
});
