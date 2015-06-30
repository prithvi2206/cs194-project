'use strict';

/* 
 * Returns true if array contains value
 */
var array_contains = function(arr, val) {
	for (var i = 0; i < arr.length; i++) {
		if(arr[i] == val) {
			return true;
		}
	}
	return false;
}

/* 
 * Removes duplicate contacts from an array of contacts
 */

var removed_duplicates = function(results) {
	var emails = [];
	var ret = [];
	for (var i = 0; i < results.length; i++) {
		// console.log(emails);
		var curr_email = results[i].get("email");
		if(curr_email == null || curr_email == "") {
			// console.log("simple email");
			ret.push(results[i]);
		} else {
			if(array_contains(emails, curr_email)) {
				// console.log("dup found");
			} else {
				ret.push(results[i]);
				emails.push(curr_email);
			}
		}
	};
	return ret;
}

/*
 * Gets applications for a contact and renders contact view
 */
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

/* 
 * Controller for route /contacts
 */
exports.main = function(req, res) {
	Parse.User.current().fetch();

	var ContactObj = Parse.Object.extend("Contact");
	var query = new Parse.Query(ContactObj);
	query.equalTo("userId", Parse.User.current());
	query.find({
		success: function(results) {
			results = removed_duplicates(results);
			get_apps_and_render_main_page(results, res);
		},
		error: function(error) {
			console.log(error.message);
		}
	});
}


/* 
 * Obtains the app object requested and 
 * includes it in the contact entry
 * Saves contact entry to Parse
 */
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

/* Adds contact to Parse db
 * controller for POST /contact/add
 */
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

/* Edits contact to Parse db
 * controller for POST /contact/add
 */
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