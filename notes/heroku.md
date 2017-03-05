## deploy: run our app 24*7 on heroku
amazon aws/ heroku/Nodejitsu/digital ocean: platform-as a-service
Its generally not a good idea to have the same copy of program that you working on and deployed:
whenever you are working on new feature, 1) you are risking breaking your app. 2) you need to stop the server
--- there is a service gap


* learn how to deploy your app to heroku:
1: sign up https://signup.heroku.com/login
2: then go to docs:
https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction
3: set up: c9 already have it, so no need to download; if you are using local machine, make sure you download and install
also, you need npm, node, and git installed on your machine(c9 have them all!!!)
after download and install, type $ heroku   -to check successfully installed

4: login $ heroku login
5: write your app start script! otherwise heroku do not know how to start your app!
in package.json, write:
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js"
  },
  note: every time we push to heroku, it will: 1) run npm install 2) run npm start
6: make sure you are using git in the project directory:
    $ git status      if not then run $ git init
    $ git add .  ---pick up the files you want to push to heroku
    $ git commit -m "xxx"
7: Create an app on Heroku, which prepares Heroku to receive your source code in your directory.
    $ heroku create  -- this will create an empty app on heroku. you will then push your code to there
    $ git remote -v    -- note the fetch and push for origin(named heroku) already setup. waiting for you to push to
8: git push heroku master   -- will push your master branch to the heroku(your origin)
    note: heroku will automatically download the dependencies for you. its very important that you use npm install --save !!!!

9: check the logs for error: $ heroku logs --tail     -- control+C to stop
10: run command on heroku: $ heroku run ls   ----run the ls command on heroku machine

* learn the reason why deployed app not working: could not access local db

2017-02-17T03:05:52.369603+00:00 app[web.1]: /app/node_modules/mongoose/node_modules/mongodb/lib/server.js:265
2017-02-17T03:05:52.369604+00:00 app[web.1]:         process.nextTick(function() { throw err; })
2017-02-17T03:05:52.369605+00:00 app[web.1]:                                       ^
2017-02-17T03:05:52.371854+00:00 app[web.1]: MongoError: failed to connect to server [localhost:27017] on first connect

* sign up mongoLab and create database, then add user, get the connection string
we need a server to run mongoDB and then we use the connection string in our app, so that our app could talk to mongoDB server
sign up:https://mlab.com/home
have to verify your email address
first set up the database:
create new, choose cloud provider(aws), plan: single node- sandbox(free), put the name for your database, hit the create button
then add users to have access to this database: this is not for app or mlab
 "A database user is required to connect to this database. To create one now, visit the 'Users' tab and click the 'Add database user' button."


* apply the connection string to app.js.
mongoose.connect("mongodb://david:123@ds157278.mlab.com:57278/camps") ;
 then run your app locally, try add new user, add new camp, and refer to mlab see the collections changed

* remember to add "start":"node app.js" to package.json

* git add, git commit, git push heroku master
now your app should runs fine on heroku

* environment variable settings:
 1:  set the port of our application: do this especially for local app(otherwise will see errors!)
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("camps is up!") ;
});


2: now the local app and deployed app use the same database. this is not a good idea. you could easily break your production.
in local project command line: create the environment variable:
$ export DATABASEURL=mongodb://localhost/camp_v16    --to set/update env. var
$ echo $DATABASEURL    ---to check env. var value
you could see the result in app:
console.log(process.env.DATABASEURL)
then use it for mongoose.connect:

now go to heroku, do the same setting
method 1: do it on the heroku web page(recommended)
go to your app setting page, click "Reveal Config Vars" and then add:
DATABASEURL     mongodb://david:123@ds157278.mlab.com:57278/camps



method 2: do it in the command line
heroku config:set DATABASEURL=mongodb://david:123@ds157278.mlab.com:57278/camps

and then add another layer of protection in your app to make sure the setting always there:
var url = process.env.DATABASEURL || "mongodb://localhost/camp_v16" ;
mongoose.connect(url) ;

similar to what we did for port number
var port = process.env.PORT || 3000;
app.listen(port, process.env.IP, function () {
    console.log("camps is up!") ;
});


the benefit of using env. variable for database url is to hide your database url from public(especially through github):
paypal, strip api, etc...

env. variable is a common concept for all programming languages....


# set up custom domain
1: go to heroku setting, in order for custom domain, you need to be verified(add credit card info)
2: once verified, go to settings, add domain
   or use command line: heroku domains: add www.davidyang2007.com
3: go to godaddy, domain DNS management,
delete everything except NS(name server), and then add
type: CNAME  | Name: www   |value:  sheltered-sea-75329.herokuapp.com  TTL|1 Hour
4: in godaddy, set up the forwarding: so that davidyang2007.com will be forward to www.davidyang2007.com
click forwarding: DOMAIN:
FORWARD TO
http://    davidyang2007.com
FORWARD TYPE: Permanent(301)
SETTINGS:
forward only
check "Update my nameservers and DNS settings to support this change."


godaddy DNS Records
Type	Name	Value	                            TTL	Actions
================================================================
CNAME	www	    sheltered-sea-75329.herokuapp.com	    1 Hour
NS	     @	    ns65.domaincontrol.com	                1 Hour
NS	     @	    ns66.domaincontrol.com	                1 Hour