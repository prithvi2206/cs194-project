var renderMessage = function(name, email, subject, body) {
    var title = name + ' &lt;' + email + '&gt;';
    $('#messageTitle').html(title);
    $('#messageSubject').html(subject);
    var body_parsed = jQuery('<div/>').append(body).find('body').html();
    $('#messageBody').html(body_parsed);
    $('#messageViewModal').modal('show');
}
