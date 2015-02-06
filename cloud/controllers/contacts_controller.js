'use strict';

exports.main = function(req, res) {
	if (Parse.User.current()) {
		Parse.User.current().fetch();

		/* Contacts home */
		if(!req.params.op) {
			var ContactObj = Parse.Object.extend("Contact");
			var query = new Parse.Query(ContactObj);
			query.equalTo("userId", Parse.User.current());
			query.find({
				success: function(results) {
					res.render('pages/contacts', { 
						currentUser: Parse.User.current().getUsername(),
						title: "Contacts | inturn",
						contacts: results,
						page: "contacts"
					});
				},
				error: function(error) {
					console.log(error.message);
				}
			});

		}

		/* Add contact form */
		else if (req.params.op == "add") {
			res.render('pages/contacts_add', { 
				currentUser: Parse.User.current().getUsername() ,
				title: "Add New Contact | inturn",
				page: "contacts"
			});
		}
		else {
			res.redirect('pages/contacts');
		}


	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
}

exports.add = function(req, res) {
	if (Parse.User.current()) {

		Parse.User.current().fetch();

		var name = req.body.contact_name;
		var title = req.body.contact_title;
		var company = req.body.company;
		var email = req.body.email;
		var phone = req.body.phone;
		var notes = req.body.notes;

		console.log("Going to add contact " + name + ", " + title + ", at " + company);


		var ContactObj = Parse.Object.extend("Contact");
		var contact_entry = new ContactObj;
		contact_entry.set("userId", Parse.User.current());
		contact_entry.set("name", name);
		contact_entry.set("title", title);
		contact_entry.set("company", company);
		contact_entry.set("email", email);
		contact_entry.set("phone", email);
		contact_entry.set("notes", notes);
		contact_entry.save().then(function() { 
			console.log("new contact saved succesfully");
		}, function(error) {
			console.log("new app did not save properly");
		});

		res.redirect('/contacts');

	} else {
		res.render('pages/start', {
			message:null,
			title: "Welcome | inturn"
		});
	}
}