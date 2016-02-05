angular.module('teambition')
.filter('momentFromNow', () => (input) => input && moment(input).fromNow());
