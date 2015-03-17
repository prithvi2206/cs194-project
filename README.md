#inturn.io

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

### Dependencies
The backend of our project is hosted on [Parse] 

<!---
Include some shit about those struggz we faced with using Parse for the backened with having additional node modules. 
-->

The program uses on the following APIs:
  - Google API (Calendar and Mail)
  - Feedzilla API for Dashboard News Feed
  - keep going

A list of the most heavily leveraged Node.js modules used by inturn.io is given below. A complete list can be found in `package.json`.
  - [passport], for google authentication with OAuth2.0.
  - [google-calendar], a minimal wrapper around Google's Calendar API, to form requests more easily.
  - [node-gmail-api], a wrapper around Google's Mail API, to handle batch requests more easily. 
  - keep going

### Database Structure and Backend Design

### Codebase structure and Navigation

### Known bugs

### Future work





[passport]:https://github.com/jaredhanson/passport-google-oauth
[google-calendar]:https://github.com/wanasit/google-calendar
[node-gmail-api]:https://github.com/SpiderStrategies/node-gmail-api
[Parse]:https://parse.com/