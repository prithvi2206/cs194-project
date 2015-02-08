$(function() {
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
            $.get("/documents/"+document_id, function(response) {
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
});
