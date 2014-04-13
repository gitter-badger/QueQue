# app.coffee

define [
    'jquery'
    'knockout'
    'lodash'
    'sammy'
    'knockoutmapping'
], ($, ko, _, sammy) ->
    class QueQue
        options: {
            API: "http://109.124.175.121/QueQue/backend/"
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
            @currentPage = ko.observable "queue"

            @currentPage.subscribe (currentPage) =>
                console.log currentPage
                menu = @menuItems()
                for item in menu
                    if currentPage == item.handle
                        item.active true
                    else
                        item.active false

            @isLocal = ko.computed =>
                currentPage = @currentPage
                return window.location.hostname == "109.124.175.121"

            @closeModal = ->
                $('.modal').modal('hide')
                $('body').removeClass('modal-open')
                $('.modal-backdrop').remove()

            @ajaxRequest = (options, data) =>
                @loading.push('ajax')
                headers = $.extend({}, options.headers)
                $.ajax({
                    type: options.type
                    url: this.options.API + options.url
                    data: JSON.stringify(data)
                    contentType: 'application/json'
                    complete: (data) =>
                        @loading.pop()
                    success: options.callback
                    error: (e) =>
                        if (e.status != 200)
                            if (e.status == 401)
                                @logout()
                            if e.hasOwnProperty 'message'
                                @messages.push({error: 0, error_description: e.responseJSON.message})
                            @loading.pop()
                    headers: headers
                })

            @user = {
                number: ko.observable null
                qPos: ko.observable 0
            }
            @ticket = ko.observable false
            @queue = 0
            @getCurrentQueue = =>
                console.log 'getCurrentQueue'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php'
                    callback: (data) =>
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                },false)
            @getTicket = =>
                console.log 'getTicket'
                @ajaxRequest({
                    type: 'GET'
                    url: 'phone.php'
                    callback: (data) =>
                        console.log data
                        @ticket = ko.mapping.fromJS(data)
                },false)
            @nextNumber = =>
                console.log 'nextNumber'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?next'
                    callback: (data) =>
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                },false)

            @setUpRoutes = () =>
                @router = sammy( (context) =>

                    context.get '#/', =>
                        @getCurrentQueue()
                        @currentPage "queue"

                    #Handle empty hash, e.g user uses back button on first "page"
                    context.get /([^]*)/, =>
                        if (context.path == '/')
                            context.setLocation('#/');


                    #TODO perhaps we also need to handle "unknown" e.g. 404 type page or "redirect" (e.g. display forword summary?)

                ).run('#/')
                @router.defaultCheckFormSubmission = @router._checkFormSubmission; 
                @router._checkFormSubmission = (form) =>
                    $form = $(form)
                    path = $form.attr("action")
                    verb = @router._getFormVerb($form)
                    if !path || (verb == "get" && !path.lastIndexOf('#', 0) == 0 )
                        return false
                    else
                        return @router.defaultCheckFormSubmission(form)

            @init = () =>
                @setUpRoutes()
            @init()

    $ ->
        window.QueQueApp or= new QueQue()
        ko.applyBindings window.QueQueApp