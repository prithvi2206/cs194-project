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

});
