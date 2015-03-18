'use strict';

var get_apps_and_render_main_page = function(contacts_list, res) {

	var AppObj = Parse.Object.extend("Application");
	var query = new Parse.Query(AppObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			
			res.render('pages/contacts/main', { 
				currentUser: Parse.User.current(),
				title: "Contacts | inturn",
				contacts: contacts_list,
				apps: results,
				page: "contacts"
			});	
		},
		error: function(error) {
			console.log(error.message);
		}
	});

}

exports.main = function(req, res) {
	Parse.User.current().fetch();

	var ContactObj = Parse.Object.extend("Contact");
	var query = new Parse.Query(ContactObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			get_apps_and_render_main_page(results, res);
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

var addAppAndSend = function(res, contact_entry, id) {
	var AppObj = Parse.Object.extend("Application");
	var query = new Parse.Query(AppObj);
	query.equalTo("objectId", id);
	query.find({
		success: function(results) {
			console.log("found contact");
			console.log("app is " + results[0]);
			contact_entry.set("appId", results[0]);
			contact_entry.save().then(function() { 
				console.log("new contact saved succesfully");
			}, function(error) {
				console.log("new app did not save properly");
			});
			res.redirect('/contacts');
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}

exports.add = function(req, res) {

	Parse.User.current().fetch();

	var name = req.body.name;
	var title = req.body.title;
	var company = req.body.company;
	var email = (req.body.email) ? (req.body.email).toLowerCase() : (req.body.email);
	var phone = req.body.phone;
	var notes = req.body.notes;
	var app = req.body.appselect;
	if(!company) {
		company = "";
	}
	console.log("Going to add contact " + name + ", " + title + ", at " + company);


	var ContactObj = Parse.Object.extend("Contact");
	var contact_entry = new ContactObj;
	contact_entry.set("userId", Parse.User.current());
	contact_entry.set("name", name);
	contact_entry.set("title", title);
	contact_entry.set("company", company);
	contact_entry.set("email", email);
	contact_entry.set("phone", phone);
	contact_entry.set("notes", notes);
	console.log("calling function");
	addAppAndSend(res, contact_entry, app);
	
}

exports.edit = function(req, res)  {

	/* Retriev params from req */
	var name = req.body.name;
	var title = req.body.title;
	var company = req.body.company;
	var email = req.body.email.toLowerCase();
	var phone = req.body.phone;
	var notes = req.body.notes;
	var app = req.body.appselect;
	var contactId = req.body.contactId;

	/* retriev contact object */
	var ContactObj = Parse.Object.extend("Contact");

	var query_contact = new Parse.Query(ContactObj);
	query_contact.equalTo("objectId", contactId);
	query_contact.find({
		success: function(results) {

			if (results.length == 0) {
				res.redirect("/contacts/");
			}

			var contact_entry = results[0];

			contact_entry.set("userId", Parse.User.current());
			contact_entry.set("name", name);
			contact_entry.set("title", title);
			contact_entry.set("company", company);
			contact_entry.set("email", email);
			contact_entry.set("phone", phone);
			contact_entry.set("notes", notes);
			console.log("calling function");
			addAppAndSend(res, contact_entry, app);


		},
		error: function(error) {
			console.log(error.message);
			alerts.error("failed to edit application");
		}
	});
}