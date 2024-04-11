import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// date variable 
const m_names = ['January', 'February', 'March', 
'April', 'May', 'June', 'July', 
'August', 'September', 'October', 'November', 'December'];

//create blogPosts array
const blogPosts = [];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});

//render index page with date variables
app.use((req, res, next) => {
    const d = new Date();
    const m = m_names[d.getMonth()]; 
    const n = d.getDate(); 
    const y = d.getFullYear(); 
    app.locals.getFullDate = `${m} ${n}, ${y}`; //global variable
    next();
});

// render blog post array
app.get("/", (req, res) => {
    res.render("index.ejs", {blogPosts});
});

//render exisiting content from EJS template  
app.get("/febnine", (req, res) => {
  res.render("febnine.ejs");
});

//render compose EJS template 
app.get("/compose", (req, res) => {
    res.render("compose.ejs");
});

//handle form submission from compose EJS template
app.post("/compose", (req, res) => {
    const blogTitle = req.body["title"].trim(); 
    const blogContent = req.body["content"];
    const newPost = {
        title: blogTitle,
        content: blogContent,
        existing: true,
    };

    //store the new posts as object in the array
    blogPosts.push(newPost);

    res.redirect("/");
});

//render a specific post
app.get("/:blogTitle", (req, res) => {
    const blogTitle = decodeURIComponent(req.params.blogTitle).trim(); //remove spacing so naming convention matches 

    const post = blogPosts.find((post) => post.title === blogTitle && post.existing);

    if(!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("posts.ejs", {post});
});

//edit post 
app.get("/:blogTitle/edit", (req, res) => {
    const blogTitle = req.params.blogTitle;
    const post = blogPosts.find((post) => post.title === blogTitle && post.existing);

    if(!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("compose.ejs", {post, isEditing: true});
});

//delete post 
app.get("/:blogTitle/delete", (req, res) => {
    const blogTitle = req.params.blogTitle;
    const postIndex = blogPosts.findIndex((post) => post.title === blogTitle && post.existing);

    if (postIndex === -1) {
        res.status(404).send("Post not found");
            return;
        }

    blogPosts.splice(postIndex, 1);
    
    res.redirect("/"); 
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
