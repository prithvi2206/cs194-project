function onDownload(data) {
    document.location = 'data:Application/octet-stream,' +
                         encodeURIComponent(data);
}

/* Sets value of edit contact modal
 * based on contact selected for editing *
 */
function prepEditContact(contact) {

    var name = document.forms["contactEditForm"]["name"];
    var title = document.forms["contactEditForm"]["title"];
    var app = document.forms["contactEditForm"]["appselect"];
    var company = document.forms["contactEditForm"]["company"];
    var notes = document.forms["contactEditForm"]["notes"];
    var email = document.forms["contactEditForm"]["email"];
    var phone = document.forms["contactEditForm"]["phone"];
    var id = document.forms["contactEditForm"]["contactId"];

    name.value = contact.name;
    title.value = contact.title;
    notes.value = (contact.notes) ? (contact.notes) : ""
    company.value = (contact.company) ? (contact.company) : ""
    email.value = (contact.email) ? (contact.email) : ""
    phone.value = (contact.phone) ? (contact.phone) : "";
    id.value = contact.objectId;
    app.value = (contact.appId.objectId) ? (contact.appId.objectId) : 0;

}

/* Validates URL 
 * used by job application add in /jobs
 */
function validateURL(textval) {
  var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}

/* Validates input of quick add events 
 * in view /events
 */
function validate_quick_add() {
    var summary = document.forms["quickAddForm"]["summary"];
    console.log(summary);
    if (summary.value == null || summary.value == "") {
        summary.parentNode.className += " " + "has-error";
        return false;
    } else {
        summary.parentNode.className  = "form-group";
        return true;
    }
}

/* Validates input of full featured add events
 * in view /events
 */
function validate_add_event() {

    var validate = 0;

    var summary = document.forms["newEventForm"]["summary"];
    var start = document.forms["newEventForm"]["start"];
    var end = document.forms["newEventForm"]["end"];

    if (summary.value == null || summary.value == "") {
        summary.parentNode.className += " " + "has-error";
        validate++;
    } else {
        summary.parentNode.className = "form-group";
    }

    if (start.value == null || start.value == "") {
        start.parentNode.className += " " + "has-error";
        validate++;
    } else {
        start.parentNode.className = "form-group";
    }

    if (end.value == null || end.value == "") {
        end.parentNode.className += " " + "has-error";
        validate++;
    } else {
        end.parentNode.className = "form-group";
    }

    return (validate == 0);
}

/* Validates input for adding a new job in
 * in view /jobs
 */
function validate_add_job() {

    var validate = 0;

    var name = document.forms["jobAddForm"]["company"];
    var position = document.forms["jobAddForm"]["position"];
    var url = document.forms["jobAddForm"]["url"];

    if (name.value == null || name.value == "") {
        name.parentNode.className += " " + "has-error";
        validate++;
    } else {
        name.parentNode.className = "form-group";
    }

    if (position.value == null || position.value == "") {
        position.parentNode.className += " " + "has-error";
        validate++;
    } else {
        position.parentNode.className = "form-group";
    }

    if (url.value == null || url.value == "" || !validateURL(url.value)) {
        url.parentNode.className += " " + "has-error";
        validate++;
    } else {
        url.parentNode.className = "form-group";
    }

    return (validate == 0);
}

/* Validates profile editing 
 * in view /profile
 */
function validate_profile() {

    var validate = 0;

    var password = document.forms["profileUpdateForm"]["password"];
    var password_conf = document.forms["profileUpdateForm"]["password_conf"];

    console.log(password.value)
    console.log(password_conf.value);

    if ((password.value != password_conf.value) || 
        password.value == "" || password_conf.value == "") {
        password.parentNode.className += " " + "has-error";
        password_conf.parentNode.className += " " + "has-error";
        validate++;
    } 

    return (validate == 0);
}

/* Validates contact adding 
 * in view /contacts
 */
function validate_add_contact(switch_add_edit) {

    if (switch_add_edit) {
        var div_name = "contactAddForm";
    } else {
        var div_name = "contactEditForm"
    }

    var validate = 0;

    var name = document.forms[div_name]["name"];
    var title = document.forms[div_name]["title"];
    var app = document.forms[div_name]["appselect"];
    var company = document.forms[div_name]["company"];

    if (name.value == null || name.value == "") {
        name.parentNode.className += " " + "has-error";
        validate++;
    }else {
        name.parentNode.className = "form-group";
    }

    if (title.value == null || title.value == "") {
        title.parentNode.className += " " + "has-error";
        validate++;
    } else {
        title.parentNode.className = "form-group";
    }

    if (app.value == null) {
        app.parentNode.className += " " + "has-error";
        validate++;
    } else {
        app.parentNode.className = "form-group";
    }


    if (app.value == "" && (company.value == "" || company.value == null)) {
        console.log("empty app");
        company.parentNode.className += " " + "has-error";
        validate++;
    } else {
        company.parentNode.className = "form-group";
    }

    return (validate == 0);
}

function appSelectListener() {
    var company = document.forms["contactAddForm"]["company"];
    var appSelect = document.forms["contactAddForm"]["appselect"];
    company.value = appSelect.options[appSelect.selectedIndex].value;
    if(appSelect.options[appSelect.selectedIndex].value) {
        company.value = appSelect.options[appSelect.selectedIndex].text.split(" at ")[1];
    }
}

/* Creates list group item
 * given news article returned
 * by feedzilla *
 */
function returnNewsItemDiv(article) {
    var html = ""
    html += "<div class=\"list-group-item\">";
    html += "<div class=\"list-group-item-heading\"><b>" + article.title + "</b></div>";
    html += "<p class=\"list-group-item-text\">"
    html += article.summary;
    html += "</p><p class=\"text-muted\" style=\"font-size: 11px;\">";
    html += "</p>";
    html += "</div>";

    return html;
}

function returnAllNewsDivs(articles) {
    var html = ""
    for (var i = 0; i < articles.length; i++) {
        html += returnNewsItemDiv(articles[i]);
    }
    return html;
    console.log(html);   
}

/* Populates newsfeed in dashboad
 * using feedzilla
 */
function populateNewsFeed() {
    // var total_jobs = 0;
    // var total_articles = 0;
    /* Get jobs list from db */
    $.get("/jobs/get", function(response) {
        var total = 0;
        var total_jobs = response.data.length;
        var count = 0;
        var results = []
        // var newHTML = "";
        var data = response.data;
        for(var i=0; i<data.length; i++) {  
            var company = data[i];
            // newHTML += "<p>" + data[i] + "</p>";
            // console.log(data[i]);
            var api_call = "http://api.feedzilla.com/v1/articles/search.json?q=" + encodeURIComponent(company.trim());
            
            $.get(api_call, function(response) {
                // total += articles.length;
                var articles = response.articles;
                total += articles.length;
                for (var j = 0; j < articles.length; j++) {
                    if(j >= 5) break;
                    var article = articles[j];
                    var articleObj = new Object;
                    // console.log(article);
                    articleObj.date = new Date(article.publish_date);                     
                    articleObj.title = article.title;
                    articleObj.summary = article.summary;
                    articleObj.url = article.url;
                    articleObj.source = article.source;
                    results.push(articleObj);
                    // if(i == data.length - 1 && j == articles.length - 1) {
                    console.log(results);
                    results.sort(function(a, b) {
                        if (a.date < b.date) return 1;
                        if (a.date > b.date) return -1;
                        return 0;
                    });

                    $('#newsfeed').html(returnAllNewsDivs(results));
                    // }
                };
                // company = encodeURIComponent(company.trim())
            });
        }
    });
}

$(function() { /* on document ready */

    $('.datepicker').datetimepicker();

    /* populate news feed on dashboard */
    if((window.location.href).indexOf("dashboard") > -1) {
        populateNewsFeed();
    }

    $('tr.document-entry').click(function() {
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        
        var document_id = this.id.split("doc-")[1];

        var revision_point = $('.revision-history-animation-container > a#rev-point-'+document_id)[0];
        if(revision_point) {
            $('.revision-history-animation-container div.active').removeClass('active');
            $(revision_point).find(".circle").addClass('active');

            $.post("/documents/preview", {document_id: document_id}, function(data) {
                $('#documentPreviewIFrame')[0].src = data.src
            });
        } else {
            $.get("/documents/select/"+document_id, function(response) {
                $('body').html(response);
            });
        }
    });

    $('a.revision-point').click(function(e) {
        var document_id = this.id.split("rev-point-")[1];
        var data = {
            document_id: document_id
        };

        $('.revision-history-animation-container div.active').removeClass('active');
        $(this).find(".circle").addClass('active');

        $('tr.selected').removeClass('selected');
        $('tr#doc-'+document_id).addClass('selected');

        $.post("/documents/preview", data, function(data) {
            $('#documentPreviewIFrame')[0].src = data.src
        });

        e.preventDefault();
    });

    $('#deleteFileButton').click(function(e) {
        var selected_tr = $('tr.selected')[0];
        var document_id = selected_tr.id.split("doc-")[1];

        $.get("/documents/delete/"+document_id, function(response) {
            window.location = "/documents";
        });
    });

    $('#addDocumentButton').click(function(e) {
        if($("#addDocumentModalContainer").html() == "") {
            $.get("/documents/all", function(response) {
                var documents = response.documents;
                var html = '<div class="modal fade" id="addDocumentModal" tabindex="-1" role="dialog">';
                html += '<div class="modal-dialog">';
                html += '<div class="modal-content">';
                html += '<form id="addDocumentToJobForm" role="form" method="post" action="/jobs/add_existing_document" enctype="multipart/form-data">';
                html += '<div class="modal-header">';
                html += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
                html += '<h4 class="modal-title">Add Document</h4>';
                html += '</div>';

                html += '<div class="modal-body">';
                html += '<div class="form-group">';
                html += '<label>Select From Existing Document</label>';
                html += '<select name="document_id" class="form-control">';
                for(var i = 0; i < documents.length; i++) {
                    html += '<option value="'+documents[i]["id"] +'">'+documents[i]["name"] +' (Version: '+documents[i]["version"]+')</option>';
                }
                html += '</select>';
                html += '</div>';

                html += '<div class="form-group">';
                html += '<input type="hidden" name="application_id" value="'+$("#addDocumentModalContainer").data("job-id")+'">';
                html += '</div>';

                html += '<div class="form-group">';
                html += '<label><strong>-- OR --</strong></label>';
                html += '</div>';

                html += '<div class="form-group">';
                html += '<a href="#" id="uploadNewDocumentButton">Upload New Document</a>';                    
                html += '</div>';

                html += '</div>';
                html += '<div class="modal-footer">';
                html += '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>';
                html += '<input id="addDocumentToJobButton" type="submit" class="btn btn-custom">';
                html += '</div>';
                html += '</form>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                $("#addDocumentModalContainer").html(html);
                $("#addDocumentModal").modal();
            });
}
});

$('#addDocumentModalContainer').on("click", '#uploadNewDocumentButton', function(e) {
    $('#addDocumentModal').modal('hide');
    $('#uploadDocumentModal').modal();
});

$('#documentUploadButton').click(function(e) {
    $('#inputFileName')[0].files


});
});
