#inturn.io

**Authors: Prithvi Ramakrishnan, Aditya Dev Gupta, Ricky Tran**

*CS194 Senior Project Submission at Stanford University, Winter 2015*

*inturn.io* is a web and mobile solution for college students to manage the various facets of their internship or job recruitment process through a centralized cloud-hosted platform. Centered around an efficient, easy-to-use dashboard, the product allows students to streamline the recruiting process for all their positions, providing tools for managing resumes, cover letters, contacts from networking events, job-related events, and interviews. Furthering its utility, the solution features integrations into various popular tools commonly used to help manage the job recruitment platform, such as Gmail and Google Calendar. 

### Installation
To save the project locally and install all relevant dependencies, run 
``` sh
$ git clone https://github.com/prithvi2206/cs194-project.git
$ cd cs194-project
$ sudo npm install
```

### Usage
To run the node.js server backend, run 
``` sh
$ node server.js
```
from the project home directory.

### Features
To enhance the utility of our product, we had several features spread out between our web app and our iOS app. Among them, we have 
  - A centralized dashboard that shows aggregate information about jobs, messages, and events.
  - A jobs page that shows a list of jobs that the user has applied to, color coded by the status of the job (applied, offer, interview, etc)
  - A detailed jobs page, which shows more information about a single application, such as messages sent by contacts associated with that application, upcoming events, the deadline of the application, contacts associated with that application, and documents (such as a resume or a cover letter) associated with that application. From this page, a user can also add a document, view a message, and view a contact.
  - Integration with GMail. GMail integration allows users to manage their recruiting related emails directly from inturn.io. Messages that are recruiting related are filtered into inturn's Parse database. This happens from two filters. One filters all emails from contacts associated with an application. The other filters from all emails whose sender's email's domain is associated with an application. Once emails are loaded into Parse's database, user's can view emails, view attachments, and filter emails by job. 
  - Integration with Google Calendar, in our Events feature. With the integration to Google Calendar, events that mention the name of a company applied to, or include the url of a company, get filtered into the Parse database. The calender in the events page then lets users view events either in a Month view, a Week view, and a Day view, for different levels of granularity. From the Events page, the user can also add events, which gets saved to both the inturn.io calendar, and the Google Calendar, under a special Calendar specifically meant for inturn.io created messages.
  - A documents viewer, that supports different versions. Users can add documents, such as resumes and cover letters, associate them with applications, and create different versions of a document (by adding the document with the same name). 
  
### Dependencies
The backend of our project is hosted on [Parse] 

<!---
Include some shit about those struggz we faced with using Parse for the backened with having additional node modules. 
-->

The program uses on the following APIs:
  - Google API (Calendar and Mail)
  - Feedzilla API for Dashboard News Feed

A list of the most heavily leveraged Node.js modules used by inturn.io is given below. A complete list can be found in `package.json`.
  - [passport], for google authentication with OAuth2.0.
  - [google-calendar], a minimal wrapper around Google's Calendar API, to form requests more easily.
  - [node-gmail-api], a wrapper around Google's Mail API, to handle batch requests more easily. 

### Data Model Structure and Backend Design

We created tables for *User*, *Application*, *Attachment*, *Contact*, *Document*, *Event*, and *Message*.

##### 1. User
User model. Stores personal information, along with google auth information.
```
objectId     : (String) unique user identifier generated by Parse
username     : (String) the email address corresponding to the Google 
               account the user signed up with.
password     : (String) a hash (hashed by Parse via bcrypt) of the 
               password set during onboarding.
firstName    : (String) set after Google Authentication
lastName     : (String) set after Google Authentication
googleId     : (String) unique ID allocated by Google for authentication
calId        : (String) ID of the "inturn" calendar that the software
               automatically creates upon account creation
googleToken  : (String) Google auth token
refreshToken : (String) refreshToken, used whenever Google needs to 
               refresh the authentication (usually every 15 mins)
passwordSet  : (Boolean) a simple flag to store the state of onboarding
```

##### 2. Application
The Application Model is the central model. Most other models have pointers to Applications as an attribute. It represents an application by a particular user to a particular job (title) at a particular company. For example, it represents the entity of Student A applying for a job as a Software Engineer at Google. 

```
objectId    : (String) unique identifier for the application 
userId      : (User*) Pointer to a User object, the user applying to the job
title       : (String) Title of the job applied to
company     : (String) Company applied to
deadline    : (Date) Deadline of the application (optional)
description : (String)
status      : (String) Possible values: "not_applied", "interview", "offer", 
              "no_offer"
url         : (String) URL of the company's website. (required, because this field
              powers several of the automated features in Messages and Calendar)
```
##### 3. Contact
Stores details associated with a particular contact. Contacts can be created in one of three ways:
  - The user manually adds a contact
  - The user imports mail, in which case Contacts will be created automatically for all emails imported when the sender's email address is from a mail domain equal to the url of some Application
  - The user imports contacts from the iOS application
  
```
objectId   : (String) unique identifier for the contact
name       : (String) name of the contact
appId      : (Application*) Application the contact is associated with (optional)
userId     : (User*) User this contact belongs to
title      : (String) Title of the contact at the company
company    : (String) Name of the company (equal to the company of the Application
             specified in appId, if appId is not null)
email      : (String)
phone      : (String)
flags      : (String) a set of flags, such as "from_iphone" and "from_email"
notes      : (String)
```
##### 4. Message
Messages are emails sent from Contacts to the email address corresponding to the Google account the user signed up with. Message objects are created whenever the `update_messages` function is called in `/cloud/util.mail.js` is called, which searches through the User's GMail inbox, and searches for all messages that are either from a contact in the Contacts data model or are from a sender whose email address has a domain that is a URL for some Application. A Message object is created for each of these messages found, by parsing the MIME message format and extracting the relevant sections.
```
objectId    : (String) unique identifier on Parse for the message
gmailId     : (String) unique identifier for the message allocated by GMail 
              (used for checking against adding duplicate messages)
userId      : (User*) User this message belongs to
contactId   : (Contact*) Contact of the sender
appId       : (Application) Application this message corresponds to (is null only 
              if it was imported from a contact that doesn't have an App assigned)
senderName  : (String)
senderEmail : (String)
dateSent    : (Date)
subject     : (String)
snippet     : (String) A text snippet (with whitespace removed) of the beginning 
              of the body
bodyText    : (String) Plaintext version of the body. Only used if the HTML 
              version cannot be used or does not exist for some reason 
bodyHTML    : (String) HTML formatted version of the body. Should be used by default.
flags       : (String) Flags provided by GMail. Only one currently being used is 
              the UNREAD flag, for formatting in the Messages view.
```
##### 5. Event
Events are created either by a user on Parse or are created automatically by going through the user's Google Calendar and importing any events that reference a company in an Application by name. 
```
objectId    : (String) unique identifier on Parse for the message
googleId    : (String) unique identifier for the event allocated by Google 
              (used for checking against adding duplicate events)
userId      : (User*) User this event belongs to
appId       : (Application*) Application this message corresponds to (this is 
              never null, because specifying an Application is required when 
              creating an event)
desc        : (String) Description/summary of the event
location    : (String)
start       : (Date) start date/time
end         : (Date) end date/time
```
##### 6. Document
Documents refer to either resumes or cover letters corresponding to a particular application or group of applications.
```
objectId    : (String) unique identifier for the document
userId      : (String) user the document belongs to
appIds      : (Application*[]) Array of Applications corresponding to the file
file        : (File) actual file contents, stored by Parse
name        : (String) filename
extension   : (String) eg. "pdf", "docx"
size        : (String) display-ready string representing size of file 
version     : (Number) version number, indexed at 1
```
##### 7. Attachment
Attachments from emails that were imported. Attachments themselves aren't stored, just all the information necessary to download them from Google on demand.
```
objectId    : (String) unique identifier on Parse for the message
messageId   : (String) unique identifier allocated by GMail for the message
attachmentId: (String) unique identifier allocated by GMail for the attachment. 
              This, along with messageId, is enough to make a request for the 
              attachment from Google, when requested by a user
userId      : (User*) User this attachment belongs to.
filename    : (String) Name of the file, to be displayed before being downloaded
```
### Codebase Structure
##### Backend
###### Hosting and Node Modules
Parse.com provides hosting of Parse projects, although the service imposes limitations on the node modules that can be used. Specifically, Parse does not allow one to install arbitrary node modules and push to its cloud hosting service; one is limited to a small set of modules referred to as [Cloud Modules]. 

This limitation was unreasonable because our inturn relies on data from GMail and Google Calendar, as well as helper modules that make it easier to connect to and work with the Google API. Therefore, we decided to use [parse-develop] to deploy locally.

we adapted this script to for hosting on Heroku, `server.js`, although it is highly derivative of the code found in the above respository, so we are citing it as a reference. The script `server.js` points to imports in `lib/`

##### Directory Structure
The overall directory structure was created by following Parse's [Hosting Guide], and began by invoking `parse new inturn` and `parse generate express` to create the directory structure inside the `cloud` folder.

We used Parse Cloud Code and Express to build a multi-page dynamic web app. With the Express framework, we had access to request routing, cookie handling, and template rendering. With Cloud Code, we were able to access functionality such as interacting with Parse data and sending HTTP requests.

The top-level entry point for the app is `cloud/app.js`, where the app is initialized, and the request paths are hooked up to corresponding logic through the Express routing API.

We now discuss the purposes of the various folders within /cloud. We have attempted to decompose by functionalities/competencies (such as jobs, messages, events, etc) as far as possible, and also keeping in mind ease of debugging to pinpoint exactly what point of the MVC stack is problematic. 

`cloud/routes` - This folder contains modules exporting routes/request handling. We have decomposed this into separate modules handling routes for authentication, dashboard, and the high level data models jobs, messages, events, documents, and contacts. 

The canonical format for our routing modules is:

```
var {var} = require("../controllers/{var}_controller.js");
var session = require("../util/session.js");`

module.exports = function(app) {
    app.get('/{route}', session.isLoggedIn, {var}.route_action);
    ...
}
```

Therefore, every routing module invokes `{var}.route_action` after checking session state, through the local session module it owns. 

`cloud/controllers/` - This folder contains controller modules, exporting public functions used by the routing modules. Most of these controller files are tailored to the high level function they are performing, but all of them require `var alerts = require("../util/alerts.js");` -- this is our own messaging system we use for in app alerts/notifications. 

`cloud/util/` - 

1. `alerts.js` -- This is our simple messaging/notification service that keeps track of messages of the following types: ["info", "warning", "success", "error"]. These represent bootstrap classes for the appearance of an alert modal. The alerts.js module keeps track of the message to be rendered for a particular sentiment, for a controller. The templates use the alert object passed by the controller to determine the type of message to display. We use alerts.reset() to clear the messages when done rendering a template.

2. `documents.js, events.js, mail.js` - modules that export helper functions for document processing, event-mail retrieval and parsing from Google API that we didn't feel belonged in the controller because they didn't represent the high level functionality that the controller takes care of.

3. `session.js` - this is an essential module whose primary function `exports.isLoggedIn = function(req, res, next)` is called before rendering any route. Ensures that the session object contains an authenticated user and returns the function next upon success (specified by the route/controller), and redirects to the start splash screen upon failure to let the user sign up or log in. This module also refreshes the Google API token based on a constant refresh time, and also pulls emails and events from Google based on a constant refresh time.

`cloud/views` - 
````
-cloud/
  -views/
    -contacts/
    -documents/
    ...
  -partials/
    ..
````
This folder contains all the views and partial templates for the entirety of the web app. It has been organized into main pages and partial pages (ejs reused as components of multiple pages).

The template [Bootstrap SB Admin] served as a starting point for the partial templates (header, footer, etc). This template is based on Twitter Bootstrap.

The components, buttons, panels, form fields, and fonts are imported from Twitter Bootstrap. Other miscellaneous components, such as the datepicker and calendar, are publicly available templates cited below:

1. [Bootstrap 3 Datepicker], used for input fields requiring DateTime input
2. [FullCalendar], used for calendar display on the Events page

`config/` - Contains essential app constants for Parse and Google API, as well as Google API authentication strategy using `passport.js`

1. `auth.js` - module exports Google API app constants such as clientID, secret, callback, scope
2. `global.json` - Parse.com app credentials including appId, masterKey and javascriptKey
3. `passport.js`- This is an important module that uses the Google API credentials in `auth.js` to authenticate a new user and store credentials in the Parse.com db. 


`node_modules/` - Contains all the node modules; this folder is included in the .gitignore since we don't want to push dependencies to the repo. Once again, these can be installed locally be invoking [sudo npm install]. 

`public/` - This folder contains all the CSS, JavaScript, and fonts to be used on the client side. Most of these files are self explanatory imports from Bootstrap and other templates previously discussed.Some noteworthy files are described below:

1. `public/js/inturn.js` -
This file contains the main document on ready function that document retrieval, processing, and previewing for the Document viewer. Apart from that inturn.js also includes various form validation functions and the functionality for populating the news feed on the Dashboard page.

2. `public/js/messages.js` -
This file contains client-side JavaScript for message handing on the Messages page. Functions include the ability to filter messages by application, render the message body in a pop up modal and downloading attachments.  

### iOS
Native iOS application coded in swift to complement inturn's web application.

Features include:
  - viewing of job applications, messages, events, documents, and contacts
  - filter elements based on specified job application
  - creation of new events as well as exporting events from inturn to iOS calendar
  - creation of new contacts and the importing and exporting of contact to and from the iOS address book
  - documents previewer to preview uploaded documents on the go

#### File Structure:
All of the following files can be found under `iOS/ParseStarterProject/`

Login and Navigation:
  - `LoginViewController.swift` - controls basic login flow
  - `NavigationController.swift` - controls the navigation throughout the application

Jobs:
  - `JobDetailTableViewController.swift`  - zoomed in view of the details of a pending job application; enables navigation to to other items filtered by selected job application (events, contacts, documents, etc.)
  - `JobsTableViewController.swift` - controls the selection of job application
  - `JobTableViewCell.swift` - custom cell to display job 

Events
  - `JobEventSelectionTableViewController.swift` - selects which application to link an event
  - `NewEventTableViewController` - form that handles the creation of a new event item
  -  `EventDetailTableViewController` - zoomed in view of the details of an event. Also 
  provides the capability to save the event to your iOS calendar
  - `EventTableViewCell` - custom table cell to display event
  - `EventsTableViewController` - table that displays all events

Messages:
  - `MessageDetailTableViewController` - zoomed in view of the details of a message
  - `MessagesTableViewController` - table that displays all messages
  - `MessageTableViewCell` - custom table cell to display message on table

Documents
  - `DocumentViewController` - UIWebview used to preview documents
  - `DocumentsTableViewController` - table that displays all documents
  - `DocumentTableViewCell` - custom table cell to display document item on table

Contacts
  - `JobSelectionTableViewController` - controls the selection of an application to link
  to a specific contact
  - `NewContactTableViewController` - form that handles the creation of a new contact
  including importing from the iOS device
  - `ContactsTableViewController` - table that displays all contacts
  - `ContactDetailTableViewController` - zoomed in view of the details of a contact. also given the option to save the current contact to your iOS device

### Known Bugs
We have attempted to address all significant issues to give users the experience we envisaged in our project proposal. That being said, a few known issues still remain. We address these issues and suggest workarounds to prevent these from being a hindrance to the user experience.

  - In the Messages view, as well as the Messages modal within `jobs/view/:id`, we are at this time unable to provide a download of attachments within a message. 
  - Due to a jQuery issue, FullCalendar is unable to open details for an event listed in the Events view, although event details can be seen in the view for the job application the event is associated with
  - Session issues sometimes cause the server to crash. Simply terminate the instance with `ctrl+c` and restart with

  ```
  $ node server.js
  ```

### Future work
We enjoyed working on this project and were happy to receive considerable positive feedback. Based on our conversations with students and our personal experiences, we believe this tool is valuable in allowing people to project manage and centralize their job recruitment process. 

We hope to continue development on inturn.io, beginning with code refactoring and user testing.


[passport]:https://github.com/jaredhanson/passport-google-oauth
[google-calendar]:https://github.com/wanasit/google-calendar
[node-gmail-api]:https://github.com/SpiderStrategies/node-gmail-api
[Parse]:https://parse.com/
[Cloud Modules]:https://parse.com/docs/cloud_modules_guide
[parse-develop]:https://github.com/flovilmart/parse-develop
[Hosting Guide]:https://parse.com/docs/hosting_guide
[Bootstrap SB Admin]:http://startbootstrap.com/template-overviews/sb-admin/
[Bootstrap 3 Datepicker]:http://eonasdan.github.io/bootstrap-datetimepicker/
[FullCalendar]:http://fullcalendar.io/