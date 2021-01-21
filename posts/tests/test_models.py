from django.test import TestCase
from posts.models import User, Category, Post, Question, Candidate, Answer, FeaturedMessage
import datetime


class UserPostTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        User.objects.create(username='testuser1', email='user1@test.com', password='user1')
        Category.objects.create(name='2020 presidential election')
        
    ### USER MODEL
    # username 
    def test_username_label(self):
        user1 = User.objects.get(pk=1)
        field_label = user1._meta.get_field('username').verbose_name
        self.assertEqual(field_label, 'username')

    ### FEATUREDMESSAGE MODEL
    # feature timestamp returns strftime
    def test_featuredMessage_returns_custom_timestamp(self):
        message1 = FeaturedMessage.objects.create(message='first message')
        expected_date = datetime.datetime.now().strftime('%b %-d, %Y')
        self.assertEqual(message1.new_date(), expected_date)

    ### CATEGORY MODEL
    # test category verbose name 
    def test_category_verbose_name(self):
        category = Category.objects.get(pk=1)
        expected_category_name = f'{category.name}'
        self.assertEqual(expected_category_name, str(category))


