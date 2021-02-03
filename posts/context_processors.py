from .models import Post

def posts_nav(request):
    posts = Post.objects.all()
    return {"posts": posts}