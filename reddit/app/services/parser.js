import Ember from 'ember';

export default Ember.Service.extend({
	listings: function(list) {
		var self = this;
		var mapped = list.map(function(item) {
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
					self.album(parsed);
				} else if(parsed.url.indexOf('imgur.com/') !== -1) {
					parsed.isImage = true;
					parsed.url = parsed.url + '.jpg';
				} else if (parsed.url.indexOf('livememe.com/') !== -1) {
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
					var html = parsed.html;
					if(html.indexOf('youtube.com') > -1) {
						var insertAt = html.indexOf('&schema=youtube');
						var newhtml = [html.slice(0, insertAt), '&autoplay=1', html.slice(insertAt)].join('');
						parsed.html = newhtml;
					}
				} else if(parsed.url.indexOf('imgur.com/a/') !== -1){

					parsed.isAlbum = true;
					self.album(parsed);
				} else {
					parsed.isArticle = true;
					if(parsed.thumbnail === 'self' || !parsed.thumbnail) {
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
	album: function(parsed) {
		var id = parsed.url.split('a/')[1];
		this.api.post.getImgurAlbum(id).then(function(response) {
			parsed.album = response.data.images;
		});
	}
});
