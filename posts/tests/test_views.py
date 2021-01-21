from django.test import TestCase
from django.urls import resolve, reverse
from django.contrib import auth
from network.models import User, Category, Post, Question, Candidate, Answer, FeaturedMessage
import json, datetime

