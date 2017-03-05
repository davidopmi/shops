#RESTFUL api convention: 7 url best practice
=============RESTFUL API============
#name    #Path              #HTTP Verb   #purpose                                  #Mongoose Method
index    '/camps'           GET        list all camps                              Camp.find()
new      '/camps/new'       GET        show new camp form                          N/A
create   '/camps'           POST       create a new camp, then redirect the index   Camp.create()
Show     '/camps/:id'       GET        show info about one specific camp           Camp.findById()

Edit     '/camps/:id/edit'  GET        show edit form for one specific camp        Camp.findById()
Update   '/camps/:id'       PUT         Update a particular Camp then redirect     Camp.findByIdAndUpdate()
Destroy  '/camps/:id'       DELETE      Delete a particular Cam then redirect      Camp.findByIdAndRemove()
