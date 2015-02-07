$(function() {
    $('tr.document-entry').click(function() {
        $('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        var data = {
            document_id: this.id.split("doc-")[1]
        };

        $.post("/documents/preview", data, function(data) {
            $('#documentPreviewIFrame')[0].src = data.src
        });
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
});
