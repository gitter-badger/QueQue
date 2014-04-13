(function() {
  define(['jquery', 'knockout', 'lodash', 'sammy'], function($, ko, _, sammy) {
    var QueQue;
    QueQue = (function() {
      QueQue.prototype.options = {
        API: "http://109.124.175.121/QueQue/backend/"
      };

      function QueQue() {
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
        this.currentPage = ko.observable("queue");
        this.currentPage.subscribe((function(_this) {
          return function(currentPage) {
            var item, menu, _i, _len, _results;
            console.log(currentPage);
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
        this.isLocal = ko.computed((function(_this) {
          return function() {
            var currentPage;
            currentPage = _this.currentPage;
            return window.location.hostname === "109.124.175.121";
          };
        })(this));
        this.closeModal = function() {
          $('.modal').modal('hide');
          $('body').removeClass('modal-open');
          return $('.modal-backdrop').remove();
        };
        this.ajaxRequest = (function(_this) {
          return function(options, data) {
            var headers;
            _this.loading.push('ajax');
            headers = $.extend({}, options.headers);
            return $.ajax({
              type: options.type,
              url: _this.options.API + options.url,
              data: JSON.stringify(data),
              contentType: 'application/json',
              complete: function(data) {
                return _this.loading.pop();
              },
              success: options.callback,
              error: function(e) {
                if (e.status !== 200) {
                  if (e.status === 401) {
                    _this.logout();
                  }
                  if (e.hasOwnProperty('message')) {
                    _this.messages.push({
                      error: 0,
                      error_description: e.responseJSON.message
                    });
                  }
                  return _this.loading.pop();
                }
              },
              headers: headers
            });
          };
        })(this);
        this.user = {
          number: ko.observable(null),
          qPos: ko.observable(0)
        };
        this.ticket = ko.observable(false);
        this.queue = 0;
        this.getCurrentQueue = (function(_this) {
          return function() {
            console.log('getCurrentQueue');
            return _this.ajaxRequest({
              type: 'GET',
              url: 'queue.php',
              callback: function(data) {
                if (data.hasOwnProperty('queue')) {
                  return _this.queue(data.queue);
                }
              }
            }, false);
          };
        })(this);
        this.getTicket = function() {
          console.log('getTicket');
          return this.ajaxRequest({
            type: 'GET',
            url: 'phone.php',
            callback: (function(_this) {
              return function(data) {
                console.log(data);
                return _this.ticket = ko.mapping.fromJS(data);
              };
            })(this)
          }, false);
        };
        this.nextNumber = function() {
          console.log('nextNumber');
          return this.ajaxRequest({
            type: 'GET',
            url: 'queue.php?next',
            callback: (function(_this) {
              return function(data) {
                if (data.hasOwnProperty('queue')) {
                  return _this.queue(data.queue);
                }
              };
            })(this)
          }, false);
        };
        this.setUpRoutes = (function(_this) {
          return function() {
            _this.router = sammy(function(context) {
              context.get('#/', function() {
                _this.getCurrentQueue();
                return _this.currentPage("queue");
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
            return _this.setUpRoutes();
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