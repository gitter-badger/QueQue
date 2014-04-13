(function() {
  define(['jquery', 'knockout', 'lodash'], function($, ko, _) {
    var QueQue;
    QueQue = (function() {
      QueQue.prototype.options = {
        API: "http://vgrdev:8080/"
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
        this.currentPage = ko.observable("login");
        this.isAdministrator = ko.observable(false);
        this.menuItems = ko.observableArray([
          {
            group: "left",
            path: "#/",
            requireAdmin: false,
            name: "Editions",
            handle: "editions",
            active: ko.observable(false)
          }, {
            group: "right",
            path: "#/users",
            requireAdmin: true,
            name: "Users",
            handle: "users",
            active: ko.observable(false)
          }, {
            group: "right",
            path: "#/users/byroles",
            requireAdmin: true,
            name: "Roles",
            handle: "byroles",
            active: ko.observable(false)
          }, {
            group: "dropdown",
            path: "#/users",
            requireAdmin: true,
            name: "Users",
            handle: "users",
            active: ko.observable(false)
          }
        ]);
        this.menu = ko.computed((function(_this) {
          return function() {
            var isAdministrator, items;
            items = _this.menuItems();
            isAdministrator = _this.isAdministrator();
            if (!isAdministrator) {
              items = ko.utils.arrayFilter(items, function(item) {
                return item.requireAdmin === false;
              });
            }
            return {
              left: ko.utils.arrayFilter(items, function(item) {
                return item.group === "left";
              }),
              right: ko.utils.arrayFilter(items, function(item) {
                return item.group === "right";
              }),
              dropdown: ko.utils.arrayFilter(items, function(item) {
                return item.group === "dropdown";
              })
            };
          };
        })(this));
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
        this.user = {
          userName: ko.observable("", {
            persist: 'user.userName'
          }),
          password: ko.observable("", {
            persist: 'user.password'
          }),
          access_token: ko.observable("", {
            persist: 'user.access_token'
          }),
          token_type: ko.observable("", {
            persist: 'user.token_type'
          }),
          expires: ko.observable("", {
            persist: 'user.expires'
          })
        };
        this.login = (function(_this) {
          return function(form) {
            var formvalues, user;
            formvalues = $(form).serializeArray();
            user = {};
            user.grant_type = "password";
            user = $.extend(user, ko.toJS(_this.user));
            console.log($.param(user));
            _this.loading.push('login');
            return $.ajax({
              type: 'PUT',
              url: _this.options.internalAPI + 'Token',
              dataType: 'json',
              data: user,
              contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
              complete: function(data) {
                return console.log(data.responseText);
              },
              success: function(data) {
                _this.user.userName(data.userName);
                _this.user.password("");
                _this.user.access_token(data.access_token);
                _this.user.token_type(data.token_type);
                _this.user.expires(new Date().getTime() + (data.expires_in * 1000));
                _this.closeModal();
                _this.router.refresh();
                _this.loading.pop();
                return _this.checkAdministrator();
              },
              error: function(e) {
                _this.messages.push(e.responseJSON);
                return _this.loading.pop();
              }
            });
          };
        })(this);
        this.logout = (function(_this) {
          return function() {
            _this.user.access_token("");
            _this.checkLogin();
            return _this.isAdministrator(false);
          };
        })(this);
        this.checkLogin = (function(_this) {
          return function(performAPICheck) {
            if (!_this.user.access_token().length > 0) {
              $('#login-modal').modal();
              return _this.currentPage("login");
            } else {
              return _this.checkAdministrator();
            }
          };
        })(this);
        this.checkAdministrator = (function(_this) {
          return function(performAPICheck) {
            return _this.ajaxRequest({
              silent: true,
              type: 'GET',
              url: 'api/internal/Users/IsAdministrator',
              callback: function(data) {
                return _this.isAdministrator(data.isAdministrator);
              }
            }, false);
          };
        })(this);
        this.closeModal = function() {
          $('.modal').modal('hide');
          $('body').removeClass('modal-open');
          return $('.modal-backdrop').remove();
        };
        this.ajaxRequest = (function(_this) {
          return function(options, data) {
            var headers;
            _this.loading.push('ajax');
            headers = $.extend({
              'Authorization': _this.user.token_type() + ' ' + _this.user.access_token()
            }, options.headers);
            return $.ajax({
              type: options.type,
              url: _this.options.internalAPI + options.url,
              beforeSend: function(xhr, settings) {
                console.log(xhr);
                return console.log(settings);
              },
              data: JSON.stringify(data),
              contentType: 'application/json',
              complete: function(data) {
                console.log(data);
                return _this.loading.pop();
              },
              success: options.callback,
              error: function(e) {
                console.log(e);
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
        this.editionEditable = ko.observable(false);
        this.edition = {};
        this.editionRules = {
          canSave: ko.observable(false),
          canDelete: ko.observable(false)
        };
        this.editions = ko.observableArray([]);
        this.getEditions = function() {
          console.log('getEditions');
          return this.ajaxRequest({
            type: 'GET',
            url: 'api/internal/Editions',
            callback: (function(_this) {
              return function(data) {
                return _this.editions(data);
              };
            })(this)
          }, false);
        };
        this.newEdition = function() {
          console.log('newEdition');
          this.editionEditable(false);
          return this.ajaxRequest({
            type: 'GET',
            url: 'api/internal/Editions/Default',
            callback: (function(_this) {
              return function(data) {
                console.log(data);
                _this.edition = ko.mapping.fromJS(data);
                _this.editionRules.canSave(data.canSave);
                _this.editionRules.canDelete(data.canDelete);
                _this.editionEditable(true);
                return $('#edition-new-modal').modal();
              };
            })(this)
          }, false);
        };
        this.editEdition = (function(_this) {
          return function(edition, event) {
            event.preventDefault();
            console.log('editEdition');
            _this.editionEditable(false);
            return _this.ajaxRequest({
              type: 'GET',
              url: 'api/internal/Editions/' + edition.id,
              callback: function(data, status, xhr) {
                _this.edition = ko.mapping.fromJS(data);
                _this.editionRules.canSave(data.canSave);
                _this.editionRules.canDelete(data.canDelete);
                console.log(xhr.getAllResponseHeaders());
                _this.edition.ETag = xhr.getResponseHeader('ETag');
                _this.editionEditable(true);
                return $('#edition-new-modal').modal();
              }
            }, false);
          };
        })(this);
        this.saveEdition = function() {
          var edition, exists, headers, url;
          this.editionEditable(false);
          this.closeModal();
          edition = ko.toJS(this.edition);
          exists = edition.id !== 0;
          headers = {};
          url = 'api/internal/Editions';
          if (exists) {
            url += '/' + edition.id;
            headers = {
              "If-Match": edition.ETag
            };
          }
          console.log(headers);
          delete edition.canDelete;
          delete edition.canSave;
          delete edition.ETag;
          delete edition.__ko_mapping__;
          console.log('saveEdition');
          return this.ajaxRequest({
            type: exists ? 'PUT' : 'POST',
            url: url,
            headers: headers,
            callback: (function(_this) {
              return function(data) {
                _this.edition = ko.mapping.fromJS(data);
                _this.editionRules.canSave(data.canSave);
                _this.editionRules.canDelete(data.canDelete);
                return _this.getEditions();
              };
            })(this)
          }, edition);
        };
        this.deleteEdition = function() {
          var edition, exists, headers, url;
          this.closeModal();
          edition = ko.toJS(this.edition);
          exists = edition.id !== 0;
          if (!exists) {
            return false;
          }
          url = 'api/internal/Editions/' + edition.id;
          headers = {
            "If-Match": edition.ETag
          };
          console.log(edition);
          if (confirm("Are you sure you want to delete this?")) {
            return this.ajaxRequest({
              type: 'DELETE',
              url: url,
              headers: headers,
              callback: (function(_this) {
                return function(data) {
                  return _this.getEditions();
                };
              })(this)
            }, edition);
          }
        };
        this.init = (function(_this) {
          return function() {
            return _this.checkLogin();
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
