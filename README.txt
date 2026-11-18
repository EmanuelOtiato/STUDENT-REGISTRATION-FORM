Student Registration System - registration form
================================================

How to run
----------
1. Unzip this folder.
2. Double-click index.html to open it in any modern browser.
   No server, install or internet connection is needed.

Files
-----
index.html      Page structure and the registration form
css/style.css   Layout, colours and validation styling
js/script.js    Validation, submit and cancel behaviour

Validation rules
----------------
Full name         Required, 2-60 characters, letters / spaces / hyphens / apostrophes
Admission number  Required, 4-20 characters, letters / numbers / "/" / "-", must be unique
Course            Required
Gender            Required

Notes
-----
- Submitted registrations are kept in the browser's localStorage so duplicate
  admission numbers can be detected. There is no backend: to store data
  permanently, send the "record" object in js/script.js to your server.
- To change the course list, edit the <option> items in index.html.
