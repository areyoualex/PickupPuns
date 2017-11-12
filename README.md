# Pickup Pundits
An online game to compete with friends on who has the best punny pickup lines!

## Overview
Make any minor changes to code on the dev branch. You can use the dev branch on git by using:
```
git checkout dev
```
Please push to dev only. We will finalize changes and merge with master branch once it's been tested and ready to deploy.
This way, Heroku isn't constantly re-deploying our app and complaining.

## How do I test code?!?!
Very good question. Please make sure you have [node.js](https://nodejs.org/en/download/) installed on your computer so you
can make local tests without pushing to master. </br></br>
Once you have it installed, open up a terminal, `cd` to the repository directory, and type:
```
npm install
node server.js
```
This will start up an instance of the server at [localhost:3000](http://localhost:3000)! Remember to close and restart the
server if you ever update the actual server code.
