$(function() {
    $('a.document-list-item').click(function() {
        $('.list-group > a.active').removeClass('active');
        $(this).addClass('active');

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

        $('.list-group > a.active').removeClass('active');
        $('.list-group > a#doc-'+document_id).addClass('active');

        $.post("/documents/preview", data, function(data) {
            $('#documentPreviewIFrame')[0].src = data.src
        });

        e.preventDefault();
    });
});
