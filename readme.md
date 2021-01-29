# Votup

## Summary
Votup is a hybrid publication and quiz platform that lets users compare candidates up for election.

### Problem

Policies are complex and politics has become even more divisive accelerated by misinformation spread across social media. In fact, among non-voters, nearly 40% cite lack of understanding and apathy of campaign issues as a reason for not voting. Most organizations focus on the later stage of the voting pipeline and reliable media content is often hidden behind a paywall. 

### Project

Votup allows publishers to create quizzes and users to view a side-by-side comparison of candidate's views under popular topics, view summary of their quiz results per category and post. Users can also bookmark posts.

### Mobile-responsive design
<div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 3px;">
  <div style="display:row;">
    <img src="posts/static/image/posts/votup_home.png" alt="votup home">
    <img src="posts/static/image/posts/profile.png" alt="votup profile">
  </div>
  <div style="display:row;">
    <img src="posts/static/image/posts/post.png" alt="votup post">
    <img src="posts/static/image/posts/post_result.png" alt="votup post result">
  </div>
</div>

<div style="display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 3px;">
    <img src="posts/static/image/posts/votup_home_mobile.png" alt="votup home responsive">
    <img src="posts/static/image/posts/votup_profile_mobile.png" alt="votup profile responsive">
    <img src="posts/static/image/posts/votup_post_mobile.png" alt="votup post responsive">
    <img src="posts/static/image/posts/votup_post_result_mobile.png" alt="votup post result responsive">
</div>

---
## Database schema 
<img src="posts/static/image/posts/votup_database_schema.png" alt="votup database">


## Installation guide
```terminal
# clone git repository
$ git clone <git repository>

# go into project root
$ cd votup project

# install dependency manager
$ pip install pipenv

# create virtual environment
$ pipenv shell

# install project dependencies in Pipfile
# pipenv install <dependency_name>
```

## Usage
- Admin can create posts and quizzes
- Users can take quizzes, review quiz results, and bookmark posts