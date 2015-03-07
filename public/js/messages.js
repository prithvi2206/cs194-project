function renderMessage(name, email, subject, body) {
    var title = name + ' &lt;' + email + '&gt;';
    $('#messageTitle').html(title);
    $('#messageSubject').html(subject);
    $('#messageBody').html(body);
    $('#messageViewModal').modal('show');
}

function getMessages() {
    var app = document.forms["filterMessage"]["app"].value;
    if (app == 0) 
        return;

    $('#messagesList').html("loading...");

    /* Get filtered messages */
    $.get("/messages/get/"+app, function(response) {

        var newHTML = "";
        var data = response.data;

        for(var i=0; i<data.length; i++) {
            console.log(data[i]["dateSent"]["iso"]);
            var body = ""

            newHTML += "<a href='javascript:renderMessage(\"" + data[i]["senderName"] + "\", \"" + data[i]["senderEmail"] + "\", \"";
            newHTML += data[i]["subject"] + "\", \"" + body + "\")'"; 
            newHTML += " class=\"list-group-item\">";

            newHTML += "<div class=\"checkbox\"><label><input type=\"checkbox\"></label></div>";
            newHTML += "<span class=\"glyphicon glyphicon-star-empty\"></span>";
            newHTML += "<span class=\"name\" style=\"min-width: 120px; display: inline-block;\">" + data[i]["senderName"] + "</span>";
            newHTML += "<span class=\"\">" + data[i]["subject"] + "</span>";
            newHTML += "<span class=\"badge\">" + (new Date(data[i]["dateSent"]["iso"]).toDateString()) + "</span>";
            newHTML += "<span class=\"pull-right\">";
            newHTML += "<span class=\"glyphicon glyphicon-paperclip\"> </span></span>"
            newHTML += "</a>";
        }

        $('#messagesList').html(newHTML);

    });
}