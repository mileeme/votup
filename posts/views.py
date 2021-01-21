import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required 
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse 
from .models import User, Category, Post, Question, Candidate, Answer, FeaturedMessage
from datetime import date
from random import shuffle


# bookmark
def bookmark(request, post_id, user_id): 
    try: 
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({'message': 'post not found.'}, status=404)

    # check if request.user in post.bookmarks
    if request.method == 'GET': 
        bookmark = post.bookmarks.filter(id=user_id).count()
        return JsonResponse(bookmark, safe=False)

    # update bookmark
    elif request.method == 'PUT':
        json_data = json.loads(request.body)
        if json_data.get('bookmarks') is not None:
            if (request.user in post.bookmarks.all()):
                post.bookmarks.remove(json_data['bookmarks'])
            else: 
                post.bookmarks.add(json_data['bookmarks'])
        return JsonResponse({'message': 'update successful.'}, status=201)
    else:
        return JsonResponse({'message': 'request response error.'}, status=400)

# like
def like(request, question_id, answer_id, user_id):
    # get question
    try: 
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        return JsonResponse({'message': 'Question not found.'}, status=404)
    # get answer
    try:
        answer = Answer.objects.get(pk=answer_id)
    except Answer.DoesNotExist:
        return JsonResponse({'message': 'Answer not found.'}, status=404)

    if request.method == 'GET':
        return JsonResponse(answer)
    elif request.method == 'PUT':
        json_data = json.loads(request.body)
        if json_data.get('likes') is not None:
            # loop through all answers in question
            for i in question.answer_question.all():
                # toggle like/unlike between answers
                if i.id == answer_id: 
                    i.likes.add(json_data['likes'])
                else: 
                    i.likes.remove(json_data['likes'])
        return JsonResponse({'message': 'update successful'}, status=201)
    else: 
        return JsonResponse({'message': 'request response error.'}, status=400)

# # answer results
# def update_like(request, answer_id):
#     user = User.objects.get(pk=request.user.id)
#     user_like = user.answer_likes.get(pk=answer_id)
#     if request.method == 'GET':
#         return JsonResponse(user_like.serialize())
#     else:
#         return JsonResponse({'message': 'request response error.'}, status=400)


# update answers
def update_answers(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        answers = post.answer_post.filter(likes=request.user.id)
    except Post.DoesNotExist:
        return JsonResponse({'message': 'Post not found.'}, status=404)

    # get all answers user liked
    liked_answers = []
    for answer in answers:
        liked_answers.append({
            'id': answer.id,
            'question': answer.question.title,
            'candidate': answer.candidate.f_name + ' ' + answer.candidate.l_name,
            'title': answer.title,
            'description': answer.description,
        })

    if request.method == 'GET':
        return JsonResponse(liked_answers, safe=False)
    else:
        return JsonResponse({'message': 'request response error.'}, status=400)


# most liked candidate
def result_candidate(request, candidate_id):
    # get answer
    try:
        candidate = Candidate.objects.get(pk=candidate_id)
    except Candidate.DoesNotExist:
        return JsonResponse({'message': 'Candidate not found.'}, status=404)
    
    if request.method == 'GET':
        return JsonResponse(candidate.serialize())
    else:
        return JsonResponse({'message': 'request response error.'}, status=400)


# user post result
def result_post(request, post_id):
    post = get_object_or_404(Post, pk=post_id)
    questions = post.question_post.all()
    answers = post.answer_post.all()
    
    # get candidates in post
    candidate_list = []
    for answer in answers:
        # omit duplicates
        if answer.candidate not in candidate_list:
            candidate_list.append(answer.candidate)

    # get total user likes per candidate
    user_picks = []
    for candidate in candidate_list:
        user_picks.append({
            'post_id': post_id,
            'total_questions': questions.count(),
            'user_answered': answers.filter(likes=request.user.id).count(),
            'id': candidate.id,
            'candidate': candidate.l_name,
            'total_likes': candidate.answer_candidate.filter(likes=request.user.id).count(),
            'likes_percentage': int(((candidate.answer_candidate.filter(likes=request.user.id).count()) / questions.count()) * 100),
        })

    user_answered = answers.filter(likes=request.user.id).count()
    # get candidate with most likes
    if request.method == 'GET':
        if (user_answered == questions.count()):
            user_candidate_pick = user_picks[max(range(len(user_picks)), key=lambda index: user_picks[index]['total_likes'])]
        else:
            user_candidate_pick = {
            'post_id': post_id,
            'candidate': None,
            'likes_percentage': int(0),
        }

        return JsonResponse(user_candidate_pick, safe=False)
    else:
        return JsonResponse({'message': 'user pick not found.'}, status=400)


# home page
def index(request):
    posts = Post.objects.all()
    featured_post = posts.filter(featured=True)
    featured_messages = FeaturedMessage.objects.filter(featured=True)


    context = {
        'posts': posts,
        'featured_post': featured_post,
        'featured_messages': featured_messages,
    }
    return render(request, 'posts/index.html', context)


# post page
def post(request, slug):
    post = get_object_or_404(Post, slug=slug)
    related_posts = Post.objects.filter(category=post.category).exclude(pk=post.id).order_by('-timestamp')[:3]
    questions = post.question_post.all()
    answers = post.answer_post.all()
    user_answers = answers.filter(likes=request.user.id)

    # get candidates in post 
    candidate_list = []
    for answer in answers:
        # omit duplicates
        if answer.candidate not in candidate_list:
            candidate_list.append(answer.candidate)

    # get total user likes per candidate
    user_picks = []
    for candidate in candidate_list:
        user_picks.append({
            'id': candidate.id,
            'candidate': candidate, 
            'age': int((date.today() - candidate.birthday).days / 365.25),
            'political_party': candidate.political_party,
            'profile_photo': candidate.profile_photo,
            'website': candidate.website,
            'bio': candidate.bio,
            'total_likes': candidate.answer_candidate.filter(post=post, likes=request.user.id).count(),
            'likes_percentage': int(((candidate.answer_candidate.filter(likes=request.user.id).count()) / questions.count()) * 100),
        })
    
    # get candidate with most likes 
    if (user_picks):
        # check if user completed answers
        total_questions = questions.count()
        total_answered = user_answers.count()

        user_candidate_pick = user_picks[max(range(len(user_picks)), key=lambda index: user_picks[index]['total_likes'])]

        context = {
            'post': post,
            'questions': questions,
            'user_picks': user_picks,
            'total_questions': total_questions,
            'total_answered': total_answered,
            'user_answers': user_answers,
            'user_candidate_pick': user_candidate_pick,
            'related_posts': related_posts,
        }
    else:
        context = {
            'post': post,
            'questions': questions,
            'user_picks': user_picks,
            'user_answers': user_answers,
            'related_posts': related_posts,
        }
    return render(request, 'posts/post.html', context)

# answer page
def answer(request, slug):
    answer = Answer.objects.get(slug=slug)
    context = {
        'answer': answer,
    }
    return render(request, 'posts/answer.html', context)

# profile page
def profile(request, username):
    profile_user = User.objects.get(username=username)
    posts = profile_user.post_user.all()
    bookmarks = profile_user.post_bookmark.all()
    answers = profile_user.answer_likes.all()

    context = {
        'profile_user': profile_user,
        'posts': posts,
        'bookmarks': bookmarks,
        'answers': answers,
    }
    return render(request, 'posts/profile.html', context)

def login_view(request):
    if request.method == 'POST':

        # attemp to in sign in users
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        # check if authentication is successful
        if user is not None:
            login(request, user)
            return redirect('posts:index')
        else:
            return render(request, 'posts/login.html', {'message': 'invalid username and/or password.'})
    else: 
        return render(request, 'posts/login.html')

def logout_view(request):
    logout(request)
    return redirect('posts:index')

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        # organization = request.POST['organization']
        # logo = request.POST['logo']
        # description = request.POST['description']
        # website = request.POST['website']

        # ensure password matches confirmation
        password = request.POST['password']
        confirmation = request.POST['confirmation']
        if password != confirmation: 
            return render(request, 'posts/registration.html', {'message': 'password does not match.'})
        
        # attempt to create new user
        try: 
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, 'posts/register.html', { 'message': 'username already exists.'})
        
        login(request, user)
        return redirect('posts:index')
    else:
        return render(request, 'posts/register.html')
