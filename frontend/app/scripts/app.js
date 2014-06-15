(function() {
  define(['jquery', 'knockout', 'lodash', 'sammy', 'knockoutmapping'], function($, ko, _, sammy) {
    var QueQue;
    QueQue = (function() {
      QueQue.prototype.options = {
        API: "http://b.dhsupport.se/"
      };

      function QueQue() {
        console.log('start app');
        this.loading = ko.observableArray([]);
        this.messages = ko.observableArray([]);
        this.removeMessage = (function(_this) {
          return function(message) {
            return _this.messages.remove(message);
          };
        })(this);
        this.context = {
          edition: ko.observable(false),
          subject: ko.observable(false)
        };
        this.session = ko.observable(false, {
          persist: 'session'
        });
        this.user = {
          number: ko.observable(null, {
            persist: 'user.number'
          }),
          qpos: ko.observable(-1, {
            persist: 'user.qpos'
          })
        };
        this.auth = {
          password: ko.observable(null),
          authenticated: ko.observable(false)
        };
        this.ticket = ko.observable(false, {
          persist: 'ticket'
        });
        this.menuItems = ko.observableArray([
          {
            group: "left",
            path: "#/admin",
            requireAdmin: true,
            name: "ADMIN",
            handle: "admin",
            active: ko.observable(false)
          }
        ]);
        this.queue = ko.observable(-1);
        this.upcomingQueue = ko.observableArray([]);
        this.pastQueue = ko.observableArray([]);
        this.queueMonitor = false;
        this.queueNumber = ko.observable(-1);
        this.queueMax = ko.observable(0);
        this.currentPage = ko.observable("queue");
        console.log('qn=', this.queueNumber());
        this.currentPage.subscribe((function(_this) {
          return function(currentPage) {
            var item, menu, _i, _len, _results;
            menu = _this.menuItems();
            _results = [];
            for (_i = 0, _len = menu.length; _i < _len; _i++) {
              item = menu[_i];
              if (currentPage === item.handle) {
                _results.push(item.active(true));
              } else {
                _results.push(item.active(false));
              }
            }
            return _results;
          };
        })(this));
        this.tabs = ko.observableArray([
          {
            id: "en",
            menu: "English",
            title: "Read Me",
            content: "<p>Please enter a valid phone number where we can reach you, your phone number will be used to identify you once it is your turn.</p> <p>If you leave this page open once you have signed up for the queue it will auto refresh the queue position and notify you of progress, keeping track of how many numbers are in front of you and who is being processed.</p> <p>Typing in your number again while still in the queue will return the same queue number, if you forgot it or just want to reactivate the auto tracker. If you have been helped and type in your number again you will get a new number.</p>"
          }, {
            id: "sv",
            menu: "Svenska",
            title: "Läs Mig",
            content: "<p>Fyll i ett telefonnummer som vi kan få tag i dig på för att få en kölapp, det kommer att användas för att identifiera dig när det är din tur.</p> <p>Om du lämnar den här sidan öppen när du skrivit upp dif så kommer den automatiskt uppdateras med köstatus.</p> <p>Skriver du in samma telefonnummer igen kommer du att få samma kölapp om ditt nummer inte har passerat, på så sätt kan du få fram vilken kölapp du har även efter att ha stängt fönstret. Har din kölapp redan passerats och du skriver in ditt telefonnummer igen så får du en ny kölapp.</p>"
          }
        ]);
        this.selectedTab = ko.observable();
        this.Access = ko.observable(false);
        this.checkAccess = (function(_this) {
          return function(callback) {
            console.log('checkAccess');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?access',
              callback: function(data) {
                if (data.hasOwnProperty('access')) {
                  _this.Access(data.access);
                  if (data.access === true) {
                    if (typeof callback === 'function') {
                      return callback();
                    }
                  } else {
                    return _this.logout();
                  }
                }
              }
            }, false);
          };
        })(this);
        this.logout = (function(_this) {
          return function() {
            console.log('logout');
            _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?login'
            }, false);
            return $('#login-modal').modal({
              backdrop: 'static'
            });
          };
        })(this);
        this.login = (function(_this) {
          return function() {
            var authen, reqData;
            console.log('login');
            authen = ko.toJS(_this.auth);
            reqData = {
              'login': authen.password
            };
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php',
              callback: function(data, status, xhr) {
                if (data.status === "OK") {
                  _this.session(data.session);
                  _this.auth.authenticated(true);
                  _this.adminQueueMonitor();
                  return $('#login-modal').modal('hide');
                } else {
                  _this.auth.authenticated(false);
                  _this.stopQueueMonitor();
                  return _this.logout();
                }
              }
            }, reqData);
          };
        })(this);
        this.closeModal = function() {
          $('.modal').modal('hide');
          $('body').removeClass('modal-open');
          return $('.modal-backdrop').remove();
        };
        this.ajaxRequest = (function(_this) {
          return function(options, data) {
            var separator, url;
            _this.loading.push('ajax');
            url = _this.options.API + options.url;
            console.log(_this.session());
            if (_this.session()) {
              separator = '?';
              if (url.indexOf('?') > -1) {
                separator = '&';
              }
              url += separator + "session=" + _this.session();
            }
            console.log(url);
            return $.ajax({
              type: options.type,
              url: url,
              dataType: 'json',
              data: data,
              complete: function(data) {
                return _this.loading.pop();
              },
              success: options.callback,
              error: function(e) {
                console.log(e);
                return _this.loading.pop();
              }
            });
          };
        })(this);
        this.getCurrentQueue = (function(_this) {
          return function() {
            console.log('getCurrentQueue');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php',
              callback: function(data) {
                if (data.hasOwnProperty('queue')) {
                  _this.queue(data.queue);
                  if (_this.user.qpos() > 0 && data.queue > _this.user.qpos()) {
                    return _this.stopQueueMonitor();
                  }
                }
              }
            }, false);
          };
        })(this);
        this.getPastQueue = (function(_this) {
          return function() {
            console.log('getPastQueue');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?history',
              callback: function(data) {
                var item, _i, _len, _ref, _results;
                console.log(data);
                if (data.hasOwnProperty('queue')) {
                  _this.queue(data.queue);
                  if (_this.user.qpos() > 0 && data.queue > _this.user.qpos()) {
                    _this.stopQueueMonitor();
                  }
                }
                if (data.hasOwnProperty('history')) {
                  _this.pastQueue([]);
                  data.history.reverse();
                  _ref = data.history;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    _results.push(_this.pastQueue.push(item));
                  }
                  return _results;
                }
              }
            }, false);
          };
        })(this);
        this.getUpcomingQueue = (function(_this) {
          return function() {
            console.log('getUpcomingQueue');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?upcoming',
              callback: function(data) {
                var item, _i, _len, _ref, _results;
                console.log(data);
                if (data.hasOwnProperty('queue')) {
                  _this.queue(data.queue);
                  if (_this.user.qpos() > 0 && data.queue > _this.user.qpos()) {
                    _this.stopQueueMonitor();
                  }
                }
                if (data.hasOwnProperty('upcoming')) {
                  _this.upcomingQueue([]);
                  _ref = data.upcoming;
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    item = _ref[_i];
                    _results.push(_this.upcomingQueue.push(item));
                  }
                  return _results;
                }
              }
            }, false);
          };
        })(this);
        this.getCurrentQueueMax = (function(_this) {
          return function() {
            console.log('getCurrentQueueMax');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?max',
              callback: function(data) {
                if (data.hasOwnProperty('queue')) {
                  return _this.queueMax(data.queue);
                }
              }
            }, false);
          };
        })(this);
        this.getTicket = (function(_this) {
          return function() {
            var params, user;
            console.log('getTicket');
            user = ko.toJS(_this.user);
            delete user.__ko_mapping__;
            params = $.param(user);
            console.log(params);
            return _this.ajaxRequest({
              type: 'GET',
              url: 'phone.php',
              callback: function(data) {
                console.log(data);
                if (data.hasOwnProperty('qpos')) {
                  _this.user.number(null);
                  _this.user.qpos(data.qpos);
                }
                return _this.ticket(true);
              }
            }, params);
          };
        })(this);
        this.nextNumber = (function(_this) {
          return function() {
            console.log('nextNumber');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php?next',
              callback: function(data) {
                if (data.hasOwnProperty('queue')) {
                  _this.queue(data.queue);
                }
                if (data.hasOwnProperty('number')) {
                  _this.queueNumber(data.number);
                  $('#number-modal').modal();
                }
                return _this.getPastQueue();
              }
            }, false);
          };
        })(this);
        this.stopQueueMonitor = (function(_this) {
          return function() {
            return clearInterval(_this.queueMonitor);
          };
        })(this);
        this.startQueueMonitor = (function(_this) {
          return function() {
            _this.stopQueueMonitor();
            _this.getCurrentQueue();
            _this.getCurrentQueueMax();
            return _this.queueMonitor = setInterval(function() {
              _this.getCurrentQueue();
              return _this.getCurrentQueueMax();
            }, 30000);
          };
        })(this);
        this.adminQueueMonitor = (function(_this) {
          return function() {
            _this.stopQueueMonitor();
            _this.getCurrentQueue();
            _this.getCurrentQueueMax();
            _this.getUpcomingQueue();
            _this.getPastQueue();
            return _this.queueMonitor = setInterval(function() {
              _this.getCurrentQueue();
              _this.getCurrentQueueMax();
              _this.getUpcomingQueue();
              return _this.getPastQueue();
            }, 30000);
          };
        })(this);
        this.setUpRoutes = (function(_this) {
          return function() {
            _this.router = sammy(function(context) {
              context.get('#/', function() {
                _this.startQueueMonitor();
                return _this.currentPage("queue");
              });
              context.get('#/tv', function() {
                _this.startQueueMonitor();
                return _this.currentPage("tv");
              });
              context.get('#/admin', function() {
                _this.checkAccess(_this.adminQueueMonitor);
                return _this.currentPage("admin");
              });
              return context.get(/([^]*)/, function() {
                if (context.path === '/') {
                  return context.setLocation('#/');
                }
              });
            }).run('#/');
            _this.router.defaultCheckFormSubmission = _this.router._checkFormSubmission;
            return _this.router._checkFormSubmission = function(form) {
              var $form, path, verb;
              $form = $(form);
              path = $form.attr("action");
              verb = _this.router._getFormVerb($form);
              if (!path || (verb === "get" && !path.lastIndexOf('#', 0) === 0)) {
                return false;
              } else {
                return _this.router.defaultCheckFormSubmission(form);
              }
            };
          };
        })(this);
        this.init = (function(_this) {
          return function() {
            _this.setUpRoutes();
            if (_this.session()) {
              _this.auth.authenticated(true);
            }
            return _this.selectedTab(_this.tabs()[0]);
          };
        })(this);
        this.init();
      }

      return QueQue;

    })();
    return $(function() {
      window.QueQueApp || (window.QueQueApp = new QueQue());
      return ko.applyBindings(window.QueQueApp);
    });
  });

}).call(this);
