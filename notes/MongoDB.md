#mongoDB cheat-sheet:
run mongodb on mac:
start the server: control + c to stop it
mongod --dbpath /Users/david/data/db
start the client: control + c to stop it
mongo
set up: require mongoose, create schema, and create model
var mongoose = require('mongoose') ;
var campSchema = new mongoose.Schema({ xxx
    }]
});
var Camp = mongoose.model('Camp', campSchema);

create and save: C
var camp1 = new Camp({name: xxx , image: xxx}) ;
camp1.save(function(err, savedCamp){}) ;

Camp.create({name:"", image:""}, function(err, savedCamp){}) ;

find: R
Camp.findOne({name:""}, function(err, foundCamp){}) ;
Camp.findById(id).populate("comments").exec(function(err,foundCamp){})

update: U
find, make changes, and then save!

delete: D
Camp.remove({}, function(err){})

data association:
method 1: data embed: note: have to define the embedded model before the master model
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [commentSchema]
});

method 2: object reference:
var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Comment"
    }]
});
working logic: when you create a new comment:
1: create the comment
2: find the camp related by using id
3: push the comment into the found camp
4: remember to save the camp! otherwise it wont be saved in database

#of items in collection:
Camp.count().exec(function(err, countNum){})

# find and sort items in collection
1: specifies that the field should be sorted in ascending order
-1: specifies that the field should be sorted in descending order
db.car.find().sort({speed:-1,name:1}).exec(function(err, sortedData){})


#install mongodb on cloud9:
https://community.c9.io/t/setting-up-mongodb/1717
go to the root level of your workspace: $ cd ~
1: sudo apt-get install -y mongodb-org
2: $ mkdir data
   $ echo 'mongod --bind_ip=$IP --dbpath=data --nojournal --rest "$@"' > mongod
   $ chmod a+x mongod
3: to start the server, go to the root level and then $ ./mongod
4: to start the client,  $ mongo



#mongodb error fix:
1: unclean shutdown:
if you see the following error: when you start ./mongod
**************
Unclean shutdown detected.
Please visit http://dochub.mongodb.org/core/repair for recovery instructions.
*************
please try the following:
cd ~
./mongod --repair
./mongod

2: insufficient free space for journal files:
2016-10-06T16:15:04.853+0000 [initandlisten] ERROR: Insufficient free space for journal files
2016-10-06T16:15:04.853+0000 [initandlisten] Please make at least 3379MB available in /data/db/journal or use --smallfiles
the reason: journal occupies predefined space. Somewhere near 1 - 2 GB.
fix:
./mongod --smallfiles   --nojournal

close mongoDB process:
in mongo client:
use admin
db.shutdownServer()

