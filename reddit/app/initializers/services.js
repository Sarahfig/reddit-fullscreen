export function initialize(container, application) {
  // application.register('service:session', application.session);
  // application.register('service:api', application.api);

  //inject into routes
  application.inject('route', 'session', 'service:session');
  application.inject('route', 'api', 'service:api');
  application.inject('route', 'parse', 'service:parser');
  application.inject('route', 'bindings', 'service:keybindings');

  //inject into components
  application.inject('component', 'bindings', 'service:keybindings');

  //inject into controllers
  application.inject('controller', 'api', 'service:api');
  application.inject('controller', 'bindings', 'service:keybindings');

  //inject into services
  application.inject('service:api', 'session', 'service:session');
  application.inject('service:parser', 'api', 'service:api');
}

export default {
  name: 'services',
  initialize: initialize
};
