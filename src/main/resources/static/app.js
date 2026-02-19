var stompClient = null;
var currentUser = null;
var currentRecipient = null; // Can be a username (private) or groupId (group)
var isGroupChat = false;

function register() {
    var username = $("#username").val();
    var password = $("#password").val();
    $.ajax({
        url: "/users/register",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username: username, password: password }),
        success: function (user) {
            alert("Registered! Please login.");
        },
        error: function (err) {
            alert("Error: " + err.responseText);
        }
    });
}

function login() {
    var username = $("#username").val();
    var password = $("#password").val();
    $.ajax({
        url: "/users/login",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ username: username, password: password }),
        success: function (user) {
            currentUser = user;
            $("#login-section").addClass("hidden");
            $("#dashboard-section").removeClass("hidden");
            $("#welcome-msg").text("Welcome, " + user.username);
            connect();
            loadFriends();
            loadPendingRequests();
            loadGroups();
        },
        error: function (err) {
            alert("Error: " + err.responseText);
        }
    });
}

function connect() {
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/user/queue/messages', function (message) {
            showMessage(JSON.parse(message.body));
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function sendMessage() {
    var content = $("#message-input").val();
    if (!content || !currentRecipient) return;

    if (isGroupChat) {
        stompClient.send("/app/group.send", {}, JSON.stringify({
            'sender': currentUser.username,
            'groupId': currentRecipient,
            'content': content
        }));
    } else {
        stompClient.send("/app/private.send", {}, JSON.stringify({
            'sender': currentUser.username,
            'receiver': currentRecipient, // Username
            'content': content
        }));
    }
    $("#message-input").val("");
}

function showMessage(message) {
    var display = "<div><strong>" + message.sender.username + ":</strong> " + message.content + "</div>";
    $("#chat-box").append(display);
    $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);
}

function searchAndAdd() {
    var query = $("#search-user").val();
    $.get("/users/search?username=" + query, function (users) {
        $("#search-results").empty();
        users.forEach(function (user) {
            if (user.id !== currentUser.id) {
                var btn = $('<button class="btn btn-sm btn-outline-primary ml-2">Add</button>').click(function () {
                    sendFriendRequest(user.id);
                });
                $("#search-results").append($("<div>").text(user.username).append(btn));
            }
        });
    });
}

function sendFriendRequest(receiverId) {
    $.post("/friends/request/" + currentUser.id + "/" + receiverId, function () {
        alert("Request sent!");
    }).fail(function (err) { alert(err.responseText); });
}

function loadPendingRequests() {
    $.get("/friends/pending/" + currentUser.id, function (requests) {
        $("#pending-requests").empty();
        requests.forEach(function (req) {
            var acceptBtn = $('<button class="btn btn-sm btn-success ml-2">Accept</button>').click(function () {
                respondToRequest(req.id, true);
            });
            var rejectBtn = $('<button class="btn btn-sm btn-danger ml-2">Reject</button>').click(function () {
                respondToRequest(req.id, false);
            });
            $("#pending-requests").append($("<li>").addClass("list-group-item").text("From: " + req.sender.username).append(acceptBtn).append(rejectBtn));
        });
    });
}

function respondToRequest(requestId, accept) {
    $.ajax({
        url: "/friends/respond/" + requestId + "?accept=" + accept,
        type: 'PUT',
        success: function () {
            loadPendingRequests();
            loadFriends();
        }
    });
}

function loadFriends() {
    $.get("/friends/list/" + currentUser.id, function (friends) {
        $("#friends-list").empty();
        $("#recipient-select").empty();
        $("#recipient-select").append(new Option("Select User...", ""));

        friends.forEach(function (friend) {
            // Add to list
            var li = $("<li>").addClass("list-group-item").text(friend.username).click(function () {
                selectRecipient(friend.username, false);
            });
            $("#friends-list").append(li);

            // Add to select dropdown
            $("#recipient-select").append(new Option(friend.username, friend.username));
        });
    });
}

$("#recipient-select").change(function () {
    var val = $(this).val();
    if (val) selectRecipient(val, false);
});

function selectRecipient(idOrName, isGroup) {
    currentRecipient = idOrName;
    isGroupChat = isGroup;
    $("#chat-box").empty();
    $("#chat-box").append("<div><em>Starting chat with " + (isGroup ? "Group " + idOrName : idOrName) + "</em></div>");

    if (isGroup) {
        // Subscribe to group topic
        stompClient.subscribe('/topic/group/' + idOrName, function (message) {
            showMessage(JSON.parse(message.body));
        });
    }
}

function createGroup() {
    var name = $("#group-name").val();
    $.ajax({
        url: "/groups/create",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ name: name, createdBy: currentUser.id }),
        success: function (group) {
            loadGroups();
            alert("Group created!");
        }
    });
}

function loadGroups() {
    $.get("/groups/list/" + currentUser.id, function (groups) {
        $("#groups-list").empty();
        groups.forEach(function (group) {
            var li = $("<li>").addClass("list-group-item").text(group.name + " (ID: " + group.id + ")").click(function () {
                selectRecipient(group.id, true);
            });
            $("#groups-list").append(li);
        });
    });
}
