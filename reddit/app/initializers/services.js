export function initialize(container, application) {
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
  //application.inject('service:api', 'ajax', 'util:ajax');
}

export default {
  name: 'services',
  initialize: initialize
};
