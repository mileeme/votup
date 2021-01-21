from django.urls import path
from django.conf import settings
from django.conf.urls.static import static 
from . import views

app_name = 'posts'
urlpatterns = [
    path('', views.index, name='index'),
    path('post/<slug:slug>', views.post, name='post'),
    path('answer/<slug:slug>', views.answer, name='answer'),
    path('profile/<str:username>', views.profile, name='profile'),

    # login
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    path('register', views.register, name='register'),

    # api
    path('bookmark/<int:post_id>/<int:user_id>', views.bookmark, name='bookmark'),
    path('like/<int:question_id>/<int:answer_id>/<int:user_id>', views.like, name='like'),
    # path('update_like/<int:answer_id>', views.update_like, name='update_like'),
    path('update_answers/<int:post_id>', views.update_answers, name='update_answers'),
    path('result/candidate/<int:candidate_id>', views.result_candidate, name='result_candidate'),
    path('result/post/<int:post_id>', views.result_post, name='result_post'),
]

# only for debug mode
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIR)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
