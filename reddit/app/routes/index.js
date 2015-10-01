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
		if(!parsed.media) {
			if(parsed.url.toLowerCase().match(/\.(jpg|png|gif)/g)) {
				parsed.type = 'image';
			} else if(parsed.url.indexOf('//imgur.com/') !== -1) {
				parsed.type = 'image';
				parsed.url = parsed.url + '.jpg';
			} else {
				parsed.type = 'article';
			}
		} else {
			if(parsed.media.oembed.type === 'video') {
				parsed.type = 'video';
				parsed.html = parsed.media.oembed.html;
			} else if(parsed.url.indexOf('//imgur.com/a/')){
				parsed.type = 'album';
			} else {
				console.log('unsupported media type', parsed);
			}
		}
        return parsed;
      });
	  console.log(model.list);
      return model;
    });
  }
});
