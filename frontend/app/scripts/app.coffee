# app.coffee

define [
    'jquery'
    'knockout'
    'lodash'
], ($, ko, _) ->
    class QueQue
        options: {
            API: "http://vgrdev:8080/"
        }
        constructor: ->
            @loading = ko.observableArray []
            @messages = ko.observableArray []
            @removeMessage = (message) =>
                @messages.remove(message)
            @context = {
                
                edition: ko.observable false
                subject: ko.observable false
            }
            @currentPage = ko.observable "login"
            @isAdministrator = ko.observable false

            @menuItems = ko.observableArray [
                {group: "left", path: "#/", requireAdmin: false, name: "Editions", handle: "editions", active: ko.observable false}
                {group: "right", path: "#/users", requireAdmin: true, name: "Users", handle: "users", active: ko.observable false}
                {group: "right", path: "#/users/byroles", requireAdmin: true, name: "Roles", handle: "byroles", active: ko.observable false}
                {group: "dropdown", path: "#/users", requireAdmin: true, name: "Users", handle: "users", active: ko.observable false}
            ]
            @menu = ko.computed =>
                items = @menuItems()
                isAdministrator = @isAdministrator()
                if not isAdministrator then items = ko.utils.arrayFilter items, (item) -> item.requireAdmin == false
                return {
                    left: ko.utils.arrayFilter items, (item) -> item.group == "left"
                    right: ko.utils.arrayFilter items, (item) -> item.group == "right"
                    dropdown: ko.utils.arrayFilter items, (item) -> item.group == "dropdown"
                }

            @currentPage.subscribe (currentPage) =>
                console.log currentPage
                menu = @menuItems()
                for item in menu
                    if currentPage == item.handle
                        item.active true
                    else
                        item.active false

            @user = {
                userName: ko.observable("", {persist:'user.userName'})
                password: ko.observable("", {persist:'user.password'})
                access_token: ko.observable("", {persist:'user.access_token'})
                token_type: ko.observable("", {persist:'user.token_type'})
                expires: ko.observable("", {persist:'user.expires'})
            }

            @login = (form) =>
                formvalues = $(form).serializeArray();
                user = {}
                user.grant_type = "password"
                user = $.extend(user,ko.toJS(@user));
                console.log  $.param( user );

                @loading.push('login')
                $.ajax({
                    type: 'PUT'
                    url: this.options.internalAPI + 'Token'
                    dataType: 'json'
                    data: user
                    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
                    complete: (data) -> console.log  data.responseText
                    success: (data) =>
                        @user.userName data.userName
                        @user.password ""
                        @user.access_token data.access_token
                        @user.token_type data.token_type
                        @user.expires(new Date().getTime() + (data.expires_in*1000))
                        
                        @closeModal()
                        @router.refresh()

                        @loading.pop()
                        @checkAdministrator()
                    error: (e) =>
                        @messages.push(e.responseJSON)
                        @loading.pop()

                })
            @logout = () =>
                @user.access_token("")
                @checkLogin()
                @isAdministrator false

            @checkLogin = (performAPICheck) =>
                if (!@user.access_token().length>0)
                    $('#login-modal').modal()
                    @currentPage "login"
                else
                    @checkAdministrator()

            @checkAdministrator = (performAPICheck) =>
                @ajaxRequest({
                    silent: true
                    type: 'GET'
                    url: 'api/internal/Users/IsAdministrator'
                    callback: (data) =>
                        @isAdministrator data.isAdministrator
                },false)

            @closeModal = ->
                $('.modal').modal('hide')
                $('body').removeClass('modal-open')
                $('.modal-backdrop').remove()


            @ajaxRequest = (options, data) =>
                @loading.push('ajax')
                headers = $.extend({'Authorization': @user.token_type() + ' ' + @user.access_token()}, options.headers)
                $.ajax({
                    type: options.type
                    url: this.options.internalAPI + options.url
                    beforeSend: (xhr,settings) =>
                        console.log  xhr
                        console.log  settings
                    data: JSON.stringify(data)
                    contentType: 'application/json'
                    complete: (data) =>
                        console.log  data
                        @loading.pop()
                    success: options.callback
                    error: (e) =>
                        console.log  e
                        if (e.status != 200)
                            if (e.status == 401)
                                @logout()
                            if e.hasOwnProperty 'message'
                                @messages.push({error: 0, error_description: e.responseJSON.message})
                            
                            @loading.pop()
                    headers: headers
                })

            @editionEditable = ko.observable false
            @edition = {}
            @editionRules = {
                canSave: ko.observable false
                canDelete: ko.observable false
            }
            @editions = ko.observableArray []
            @getEditions = ->
                console.log 'getEditions'
                @ajaxRequest({
                    type: 'GET'
                    url: 'api/internal/Editions'
                    callback: (data) =>
                        @editions data
                },false)
            @newEdition = ->
                console.log 'newEdition'
                @editionEditable false
                @ajaxRequest({
                    type: 'GET'
                    url: 'api/internal/Editions/Default'
                    callback: (data) =>
                        console.log  data

                        @edition = ko.mapping.fromJS(data)
                        @editionRules.canSave data.canSave
                        @editionRules.canDelete data.canDelete
                        @editionEditable true
                        $('#edition-new-modal').modal()
                },false)
            @editEdition = (edition,event) =>
                event.preventDefault()
                console.log 'editEdition'
                @editionEditable false
                @ajaxRequest({
                    type: 'GET'
                    url: 'api/internal/Editions/' + edition.id
                    callback: (data, status, xhr) =>
                        @edition = ko.mapping.fromJS(data)
                        @editionRules.canSave data.canSave
                        @editionRules.canDelete data.canDelete
                        console.log  xhr.getAllResponseHeaders()
                        @edition.ETag = xhr.getResponseHeader('ETag')
                        @editionEditable true
                        $('#edition-new-modal').modal()
                },false)
            @saveEdition = ->
                @editionEditable false
                @closeModal()
                edition = ko.toJS(@edition)
                exists = edition.id isnt 0
                
                headers = {}

                url = 'api/internal/Editions'
                if exists
                    url += '/' + edition.id
                    headers = {
                        "If-Match": edition.ETag
                    }
                console.log  headers
                delete edition.canDelete
                delete edition.canSave
                delete edition.ETag
                delete edition.__ko_mapping__

                console.log 'saveEdition'
                @ajaxRequest({
                    type: if exists then 'PUT' else 'POST'
                    url: url
                    headers: headers
                    callback: (data) =>
                        @edition = ko.mapping.fromJS(data)
                        @editionRules.canSave data.canSave
                        @editionRules.canDelete data.canDelete

                        @getEditions()
                },edition)

            @deleteEdition = ->
                @closeModal()
                edition = ko.toJS(@edition)
                exists = edition.id isnt 0
                if not exists
                    return false
                url = 'api/internal/Editions/' + edition.id
                headers = {
                    "If-Match": edition.ETag
                }

                console.log  edition

                if confirm("Are you sure you want to delete this?")
                    @ajaxRequest({
                        type: 'DELETE'
                        url: url
                        headers: headers
                        callback: (data) =>
                            @getEditions()
                    },edition)


            @init = () =>
                @checkLogin()
            @init()

    $ ->
        window.QueQueApp or= new QueQue()
        ko.applyBindings window.QueQueApp