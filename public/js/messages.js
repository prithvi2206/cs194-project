var renderMessage = function(data) {
    var title = data['senderName'] + ' &lt;' + data['senderEmail'] + '&gt;';
    $('#messageTitle').html(title);
    $('#messageSubject').html(data['subject']);
    $('#messageViewModal').modal('show');
}