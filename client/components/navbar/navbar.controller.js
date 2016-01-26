'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': 'Home',
    'state': 'main'
  },{
    'title': 'Watch',
    'state': 'watch'
  },{
    'title': 'Download',
    'state': 'download'
  },{
    'title': 'Contact',
    'state': 'contact'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;
  }
}

angular.module('lotusvoiceApp')
  .controller('NavbarController', NavbarController);
