# backend/urls.py

from django.contrib import admin
from django.urls import path, include
# Removed: from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tasks/', include('tasks.urls')),
    # Removed: path('', TemplateView.as_view(template_name='index.html')),
]