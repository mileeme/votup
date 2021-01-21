from django.contrib import admin
from .models import User, Category, Post, Question, Candidate, Answer, FeaturedMessage


@admin.register(FeaturedMessage)
class featuredMessageAdmin(admin.ModelAdmin):
    list_display = ['message', 'new_date', ]

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'user']
    ordering = ['category', 'title']


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'calculate_age', 'political_party']


class AnswerInline(admin.StackedInline):
    model = Answer
    list_display = ['post', 'title', 'candidate']
    # ordering = ['post', 'question', 'title', 'candidate']


class QuestionAdmin(admin.ModelAdmin):
    list_display = ['post', 'title',]
    ordering = ['post', 'title']
    inlines = [AnswerInline,]


admin.site.register(Answer)
admin.site.register(Question, QuestionAdmin)
admin.site.register(User)
admin.site.register(Category)
