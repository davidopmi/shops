#v3: add instant search 

## create the seed.js to clear out and then load fake data in database whenever project starts
create the seeds.js 
learn to use async to first clear out the categories and then clear out products and then add 3 categories with 3 products

## use the fuzzy search to make search functionality
1: create the routes in router/products.js:
router.post('/search'')
router.get('/search'')

create the search form in main/category.ejs: when click the search button, send a post request with req.body.q as search parameter
then it will be redirect('/search?q'+req.body.q) to the /search GET route with the query string
req.query.q

2: create views/main/search-result.ejs view to render the search results
refer to the category.ejs

3: add the search input and button to the navbar: views/partials/header.ejs
refer to the navbar:
http://getbootstrap.com/components/#navbar
<form class="navbar-form navbar-left" method="post" action="/search">
    <div class="form-group">
        <input type="text" class="form-control" name="q" placeholder="Search...">
    </div>
    <button type="submit" class="btn btn-default">Submit</button>
</form>

4: install package locus for debugging in backend: 
npm install locus --save

eval(require('locus')) ;    //your application stop at this line. then you could debug it. use exit command to leave
https://www.npmjs.com/package/locus

5:  fuzzy search with mongodb
http://stackoverflow.com/questions/38421664/fuzzy-searching-with-mongodb


## pagination ==== later
make changes to the router/products.js 's router.get('/'),

for pagination concept, refer to this link:
https://scalegrid.io/blog/fast-paging-with-mongodb/

.skip(perPage*(page-1))
.limit(perPage)
if you have lots of products, you dont want to let mongoDB to find all of them every single time.
so skip will ignore # of products and limit will only pick certain number of products from database

bootstrap pagination:
http://getbootstrap.com/components/#pagination


## use jquery to make instant search 
we need 3 things:
1) search API === this will be used by item 3 later
test it use postman 
endpoint: /api/search   post
search_term    computer  x-www-form-urlencoded


2) add search  on views/products/index.ejs
http://getbootstrap.com/css/#forms-inline
input-group: put in div to group input text and button 
form-control: to make the input text looks better
<span>button glyphicon </span> : use span to wrap button and glyphicon together. span is an inline control, so it will be on the same level of the input

<div class="container" style="margin-bottom: 10px;">
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="input-group col-md-12">
                <input type="text" class="form-control" name="search_term" placeholder="Search for a Product...">
                <span class="input-group-btn" >
                    <buttton type="submit" class="btn btn-primary"><i class="glyphicon glyphicon-search" style="font-size:1.5em;"></i></buttton>
                </span>
            </div>
        </div>
    </div>
</div>

input-group-btn: Easily extend form controls by adding text, buttons, or button groups on either side of textual <input>s.
https://v4-alpha.getbootstrap.com/components/input-group/

Bigger Glyphicons
http://stackoverflow.com/questions/18478365/bigger-glyphicons

3) custom JS file: on the client side, make ajax call to server
    -create public/js/custom.js file and refer it in the javascriptOnly.ejs 
    -give 3 ids in the products/index.ejs:   search  searchBtn searchResults
    -in the custom.js:
    make ajax call when keyup event is fired and check the chrome dev tool 
    refer to our adv jquery course note 12 the code example
    -in the success callback, re-write html for search results: 
        1: use .empty() clear out the content 
        2: use .append(html) for each product, draw the html
    - exact the ajax search functionality into a function to be used for button also 