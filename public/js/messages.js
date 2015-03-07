function renderMessage(name, email, subject, body) {
    var title = name + ' &lt;' + email + '&gt;';
    $('#messageTitle').html(title);
    $('#messageSubject').html(subject);
    $('#messageBody').html(body);
    $('#messageViewModal').modal('show');
}

function fag() {
    console.log("grapist");
}