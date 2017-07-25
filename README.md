# Test Result Dashboard
Test Result dashboard to maintain, view and analyse Test Reports.

Frontend Stack:
---------------
JavaScript + jQuery + HTML + CSS

Backend Stack:
---------------
NodeJS + MySQL

# How To Setup
1. Install Node JS(v6.11.1) and MySQL Database(5.7.19),
2. Clone the repo,
3. Update the 'config.js' with database hostname, password, and databae name,
4. Install all dependancies required for the Node JS runtime using the command,
`````
npm install
`````
5. Run the command
````
node app.js
````
6. Dashboard should be accessible on Port 8080 !!!!

# Configuring
Once the dashboard is accessible, navigate to 'Settings' and perform the following settings:

## Report Settings
To upload Test Reports it is required to enter some required information in the view 'Settings -> Report' , the server uses this information to parse the contents to read Pass Count, Fail Count, Failed Count.

1. Report Name, 
2. XPath of Pass from the reports html,
3. XPath of Fail from the reports html,
4. XPath of Skipped from the reports html,
5. Location of summary or index file,
6. Main HTML index file of the report.

## Release and Project Settings
To maintain reports specific to a release it is required to config them through the view 'Settings -> Release Settings'.

Projects are subset of a release Eg: Project A, Project B under Release v1.1, configure them through the view 'Settings -> Project Settings'.

Note: This is tied up with th Release, you could have one unique Project for a release

