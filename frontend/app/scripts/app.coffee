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
            API: "http://b.dhsupport.se/"
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
            @session = ko.observable false, {persist: 'session'}
            @user = {
                number: ko.observable null, {persist: 'user.number'}
                qpos: ko.observable -1, {persist: 'user.qpos'}
            }
            @auth = {
                password: ko.observable null
                authenticated: ko.observable false
            }
            # @auth.authenticated.subscribe (authenticated) =>
            #     if authenticated
            #         @startQueueMonitor()
            #         @adminQueueMonitor()

            @ticket = ko.observable false, {persist: 'ticket'}

            @menuItems = ko.observableArray [
                {group: "left", path: "#/admin", requireAdmin: true, name: "ADMIN", handle: "admin", active: ko.observable false}
            ]
            @queue = ko.observable -1
            @upcomingQueue = ko.observableArray []
            @pastQueue = ko.observableArray []
            @queueMonitor = false
            @queueNumber = ko.observable -1
            @queueMax = ko.observable 0
            @currentPage = ko.observable "queue"
            console.log 'qn=', @queueNumber()
            @currentPage.subscribe (currentPage) =>
                menu = @menuItems()
                for item in menu
                    if currentPage == item.handle
                        item.active true
                    else
                        item.active false

            @tabs = ko.observableArray [
                {
                    id: "en"
                    menu: "English"
                    title: "Read Me"
                    content: "<p>Please enter a valid phone number where we can reach you, your phone number will be used to identify you once it is your turn.</p>
                                <p>If you leave this page open once you have signed up for the queue it will auto refresh the queue position and notify you of progress, keeping track of how many numbers are in front of you and who is being processed.</p>
                                <p>Typing in your number again while still in the queue will return the same queue number, if you forgot it or just want to reactivate the auto tracker. If you have been helped and type in your number again you will get a new number.</p>"
                }
                {
                    id: "sv"
                    menu: "Svenska"
                    title: "Läs Mig"
                    content: "<p>Fyll i ett telefonnummer som vi kan få tag i dig på för att få en kölapp, det kommer att användas för att identifiera dig när det är din tur.</p>
                                <p>Om du lämnar den här sidan öppen när du skrivit upp dif så kommer den automatiskt uppdateras med köstatus.</p>
                                <p>Skriver du in samma telefonnummer igen kommer du att få samma kölapp om ditt nummer inte har passerat, på så sätt kan du få fram vilken kölapp du har även efter att ha stängt fönstret. Har din kölapp redan passerats och du skriver in ditt telefonnummer igen så får du en ny kölapp.</p>"
                }
            ]
            @selectedTab = ko.observable()

            @Access = ko.observable false
            @checkAccess = (callback) =>
                console.log 'checkAccess'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?access'
                    callback: (data) =>
                        if data.hasOwnProperty 'access'
                            @Access data.access
                            if data.access == true
                                if typeof callback == 'function'
                                    callback()
                            else
                                @logout()
                },false)
            @logout = =>
                console.log 'logout'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?login'
                },false)
                $('#login-modal').modal({backdrop: 'static'})
            @login = =>
                console.log 'login'
                authen = ko.toJS(@auth)
                reqData = {'login': authen.password}
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php'
                    callback: (data, status, xhr) =>
                        if data.status == "OK"
                            @session data.session
                            @auth.authenticated true
                            @adminQueueMonitor()
                            $('#login-modal').modal('hide')
                        else
                            @auth.authenticated false
                            @stopQueueMonitor()
                            @logout()
                },reqData)

            @closeModal = ->
                $('.modal').modal('hide')
                $('body').removeClass('modal-open')
                $('.modal-backdrop').remove()

            @ajaxRequest = (options, data) =>
                @loading.push('ajax')
                # headers = $.extend({}, options.headers)
                url = this.options.API + options.url
                console.log @session()
                if @session()
                    separator = '?'
                    if url.indexOf('?') > -1
                        separator = '&'
                    
                    url += separator+"session="+@session()
                console.log url 
                $.ajax({
                    type: options.type
                    url: url
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
                    # headers: headers
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
                        if data.hasOwnProperty 'history'
                            @pastQueue []
                            data.history.reverse()
                            for item in data.history
                                @pastQueue.push item
                },false)
            @getUpcomingQueue = =>
                console.log 'getUpcomingQueue'
                @ajaxRequest({
                    type: 'GET'
                    url: 'queue.php?upcoming'
                    callback: (data) =>
                        console.log data
                        if data.hasOwnProperty 'queue'
                            @queue data.queue
                            if @user.qpos() > 0 && data.queue > @user.qpos()
                                @stopQueueMonitor()
                        if data.hasOwnProperty 'upcoming'
                            @upcomingQueue []
                            for item in data.upcoming
                                @upcomingQueue.push item
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
                            @user.number null
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
                        @getPastQueue()
                },false)

            @stopQueueMonitor = () =>
                clearInterval @queueMonitor
            @startQueueMonitor = () =>
                @stopQueueMonitor()
                @getCurrentQueue()
                @getCurrentQueueMax()
                @queueMonitor = setInterval( =>
                    @getCurrentQueue()
                    @getCurrentQueueMax()
                ,30000)
            @adminQueueMonitor = () =>
                @stopQueueMonitor()
                @getCurrentQueue()
                @getCurrentQueueMax()
                @getUpcomingQueue()
                @getPastQueue()
                @queueMonitor = setInterval( =>
                    @getCurrentQueue()
                    @getCurrentQueueMax()
                    @getUpcomingQueue()
                    @getPastQueue()
                ,30000)

            @setUpRoutes = () =>
                @router = sammy( (context) =>

                    context.get '#/', =>
                        @startQueueMonitor()
                        @currentPage "queue"
                    context.get '#/tv', =>
                        @startQueueMonitor()
                        @currentPage "tv"
                    context.get '#/admin', =>
                        @checkAccess @adminQueueMonitor
                        @currentPage "admin"

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
                # @checkAccess()
                @setUpRoutes()
                if (@session())
                    @auth.authenticated true
                @selectedTab(@tabs()[0]);
            @init()

    $ ->
        window.QueQueApp or= new QueQue()
        ko.applyBindings window.QueQueApp