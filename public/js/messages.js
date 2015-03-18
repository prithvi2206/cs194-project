var BASE64_MARKER = ';base64,';
 
function convertDataURIToBinary(dataURI) {
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
 
  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function refreshMessages() {
    $.get("/messages/refresh/", function(response) {
        return;
    });
}

function renderMessage(id, name, email, subject, body) {
    var title = name + ' &lt;' + email + '&gt;';
    $('#messageTitle').html(title);
    $('#messageSubject').html(subject);
    $('#messageBody').html( $('<div />').html(body).text());
    $('#messageViewModal').modal('show');

    getAttachmentIds(id);
}

function downloadAttachment(id) {
    $.get("/attach/get/"+id, function(response) {
        var data = response.data;
        var url = "data:application/pdf;base64," + data;
        window.open(url);
        // var pdfAsArray = convertDataURIToBinary(url);
        // PDFJS.getDocument(pdfAsArray)
    });
    
}

function getAttachmentIds(messageId) {
    $('#messageAttach').html("Loading...");

    /* Get filtered messages */
    $.get("/attach/getall/"+messageId, function(response) {
        var data = response.data;
        var html = "";

        if (data.length == 0) {
            $('#messageAttach').html("None");
            return;
        } else {
            for (var i in data) {
                html += "<a href='javascript:downloadAttachment(\"" + data[i].attachmentId + "\")'>" + data[i].filename + "</a><br>";
            }
            $('#messageAttach').html(html);
        }

    });
}

function getMessages() {
    var app = document.forms["filterMessage"]["app"].value;

    $('#messagesList').html("loading...");

    /* Get filtered messages */
    $.get("/messages/get/"+app, function(response) {

        var newHTML = "";
        var data = response.data;
        var html = response.msgHtml;

        for(var i=0; i<data.length; i++) {

            var body = html[i];

            newHTML += "<a href='javascript:renderMessage(\"" + data[i]["gmailId"] + "\", \"" + data[i]["senderName"] + "\", \"" + data[i]["senderEmail"] + "\", \"";
            newHTML += data[i]["subject"] + "\", \"" + body + "\")'"; 
            newHTML += " class=\"list-group-item\">";

            // newHTML += "<div class=\"checkbox\"><label><input type=\"checkbox\"></label></div>";
            // newHTML += "<span class=\"glyphicon glyphicon-star-empty\"></span>";
            newHTML += "<span class=\"name\" style=\"min-width: 120px; display: inline-block;\">" + data[i]["senderName"] + "</span>";
            newHTML += "<span class=\"\">" + data[i]["subject"] + "</span>";
            newHTML += "<span class=\"badge\">" + (new Date(data[i]["dateSent"]["iso"]).toDateString()) + "</span>";
            newHTML += "<span class=\"pull-right\">";
            if (data[i]["has_attachment"]) newHTML += "<span class=\"glyphicon glyphicon-paperclip\"> </span>"
            newHTML += "</span></a>";
        }

        $('#messagesList').html(newHTML);

    });
}