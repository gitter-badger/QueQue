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
            console.log 'start app'
            @loading = ko.observableArray []
            @messages = ko.observableArray []
            @removeMessage = (message) =>
                @messages.remove(message)
            @context = {

                edition: ko.observable false
                subject: ko.observable false
            }
            @user = {
                number: ko.observable null
                qpos: ko.observable 0
            }
            @ticket = ko.observable false
            @queue = ko.observable 0
            @pastQueue = ko.observableArray []
            @queueMonitor = false
            @queueNumber = ko.observable -1
            @queueMax = ko.observable 0
            @currentPage = ko.observable "queue"
            console.log 'qn=', @queueNumber()
            @currentPage.subscribe (currentPage) =>
                console.log currentPage
                menu = @menuItems()
                for item in menu
                    if currentPage == item.handle
                        item.active true
                    else
                        item.active false

            @Access = ko.observable false
            @checkAccess = =>
                console.log 'checkAccess'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?access'
                    callback: (data) =>
                        if data.hasOwnProperty 'access'
                            @Access data.access
                },false)

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
                    dataType: 'json'
                    data: data
                    complete: (data) =>
                        @loading.pop()
                    success: options.callback
                    error: (e) =>
                        #if (e.status != 200)
                            # if (e.status == 401)
                            # if e.hasOwnProperty 'message'
                                # @messages.push({error: 0, error_description: e.responseJSON.message})
                        console.log e
                        @loading.pop()
                    headers: headers
                })

            @getCurrentQueue = =>
                console.log 'getCurrentQueue'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php'
                    callback: (data) =>
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                            if @user.qpos() > 0 && data.queue > @user.qpos()
                                @stopQueueMonitor()
                },false)
            @getPastQueue = =>
                console.log 'getPastQueue'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?history'
                    callback: (data) =>
                        console.log data
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                            if @user.qpos() > 0 && data.queue > @user.qpos()
                                @stopQueueMonitor()
                },false)
            @getCurrentQueueMax = =>
                console.log 'getCurrentQueueMax'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?max'
                    callback: (data) =>
                        if data.hasOwnProperty 'queue'
                            @queueMax data.queue
                },false)
            @getTicket = =>
                console.log 'getTicket'
                user = ko.toJS(@user)
                delete user.__ko_mapping__
                params = $.param(user)
                console.log params
                @ajaxRequest({
                    type: 'GET'
                    url: 'phone.php'
                    callback: (data) =>
                        console.log data
                        if data.hasOwnProperty 'qpos'
                            @user.qpos data.qpos
                        @ticket true
                },params)
            @nextNumber = =>
                console.log 'nextNumber'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?next'
                    callback: (data) =>
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                        if data.hasOwnProperty 'number'
                            @queueNumber data.number
                            $('#number-modal').modal()
                },false)

            @stopQueueMonitor = () =>
                clearInterval @queueMonitor
            @startQueueMonitor = () =>
                @getCurrentQueue()
                @getCurrentQueueMax()
                @getPastQueue()
                @queueMonitor = setInterval( =>
                    @getCurrentQueue()
                    @getCurrentQueueMax()
                    @getPastQueue()
                ,30000)


            @setUpRoutes = () =>
                @router = sammy( (context) =>

                    context.get '#/', =>
                        @startQueueMonitor()
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
                console.log 'qn',@queueNumber()
                console.log this
                @checkAccess()
                @setUpRoutes()
            @init()

    $ ->
        window.QueQueApp or= new QueQue()
        ko.applyBindings window.QueQueApp