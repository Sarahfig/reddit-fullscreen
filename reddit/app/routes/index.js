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
            embed: data.embed,
            name: data.name,
            numComments: data.numComments,
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
        return parsed;
      });
      return model;
    });
  }
});
