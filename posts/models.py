from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
from django.utils.text import slugify


class User(AbstractUser):
    organization = models.CharField(max_length=60, blank=True, null=True, default='')
    profile_photo = models.ImageField(upload_to='posts', blank=True, null=True)
    description = models.TextField(max_length=1500, blank=True, null=True, default='')
    website = models.URLField(blank=True, null=True, default='')

class FeaturedMessage(models.Model):
    message = models.CharField(max_length=250, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    featured = models.BooleanField(default=False)

    def new_date(self):
        return self.timestamp.strftime('%b %-d, %Y')

class Category(models.Model):
    name = models.CharField(max_length=60, blank=True, null=True)
    hero_img = models.FileField(
        max_length=255, upload_to='posts', blank=True, null=True)
    
    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "categories"

class Post(models.Model):
    category = models.ForeignKey(Category, blank=True, null=True, on_delete=models.PROTECT, related_name='post_category')
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name='post_user')
    main_question = models.CharField(max_length=250, blank=True, null=True, default='')
    title = models.CharField(max_length=250, blank=True, null=True, default='')
    image_link = models.URLField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True, upload_to='posts')
    image2x = models.ImageField(blank=True, null=True, upload_to='posts')
    description = models.TextField(max_length=1500, blank=True, null=True)
    feature_summary = models.TextField(max_length=350, blank=True, null=True, default='')
    timestamp = models.DateTimeField(auto_now_add=True)
    slug = models.SlugField(default='', blank=True, null=True)
    bookmarks = models.ManyToManyField(User, blank=True, default='', related_name='post_bookmark')
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def date(self):
        return self.timestamp.strftime('%b %-d, %Y')

    def save(self, *args, **kwargs):
        if not self.pk: 
            self.slug = slugify(self.title)
        super(Post, self).save(*args, *kwargs)

    def serialize(self):
        return {
            'id': self.id,
            'category': self.category.name,
            'user': self.user.organization,
            'title': self.title,
            'image_link': self.image_link,
            'image': self.image,
            'description': self.description,
            'timestamp': self.timestamp.strftime('%b %-d, %Y'),
            'slug': self.slug,
            'bookmarks': self.bookmarks.count(),
        }


class Question(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='question_post')
    title = models.CharField(max_length=250, blank=True, null=True)
    description = models.TextField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title

    def serialize(self):
        return {
            'post': self.post, 
        }
    

class Candidate(models.Model):
    PartyAssociation = models.TextChoices('partyassociation', 'republican democrat independent')
    f_name = models.CharField(max_length=60, blank=True, null=True)
    l_name = models.CharField(max_length=60, blank=True, null=True)
    birthday = models.DateField(default=date.today, blank=True, null=True)
    political_party = models.CharField(max_length=20, choices=PartyAssociation.choices, blank=True, null=True, default='')
    profile_photo = models.ImageField(upload_to='posts', blank=True, null=True)
    website = models.URLField(max_length=255, blank=True, null=True, default='')
    bio = models.TextField(max_length=500, blank=True, null=True)

    def calculate_age(self):
        return int((date.today() - self.birthday).days / 365.25)
    age = property(calculate_age)

    def __str__(self):
        return f'{self.f_name} {self.l_name}'

    def image_path(self):
        return f'/media/{self.profile_photo.name}'

    def serialize(self):
        return {
            'full_name': f'{self.f_name.capitalize()} {self.l_name.capitalize()}',
            'age': self.calculate_age(),
            'political_party': self.political_party.capitalize(), 
            'profile_photo': self.image_path(),
            'website': self.website,
            'bio': self.bio,
        }

class Answer(models.Model):
    post = models.ForeignKey(Post, blank=True, null=True, default='', on_delete=models.CASCADE, related_name='answer_post')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answer_question')
    candidate = models.ForeignKey(Candidate, blank=True, null=True, default='', on_delete=models.CASCADE, related_name='answer_candidate')
    title = models.CharField(max_length=250, blank=True, null=True, default='')
    description = models.TextField(max_length=1500, blank=True, null=True, default='')
    image = models.URLField(blank=True, null=True)
    slug = models.SlugField(default='', blank=True, null=True)
    likes = models.ManyToManyField(User, blank=True, default='', related_name='answer_likes')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = slugify(self.title)
        super(Answer, self).save(*args, *kwargs)

    def serialize(self):
        return {
            'question': self.question.id,
            'candidate': self.candidate.id,
            'title': self.title,
            'description': self.description,
            'image': self.image,
            'likes': self.likes.count(),
        }

    # class Meta:
    #     ordering = ['slug']
