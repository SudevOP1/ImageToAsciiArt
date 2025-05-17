from django.urls import path
from .views import *

urlpatterns = [
    path("get_ascii", get_ascii, name="get-ascii"),
]
