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

function validateURL(textval) {
  var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}

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

function populateNewsFeed() {
    /* Get jobs list from db */
    $.get("/jobs/get", function(response) {

        var newHTML = "";
        var data = response.data;
        for(var i=0; i<data.length; i++) {  
            newHTML += "<p>" + data[i] + "</p>";
            console.log(data[i]);
        }

        $('#newsfeed').html(newHTML);

    });
}

$(function() { /* on document ready */

    populateNewsFeed();

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
                console.log(documents);
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
                    html += '<option value="'+documents[i].objectId+'">'+documents[i].name+' (Version: '+documents[i].version+')</option>';
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
