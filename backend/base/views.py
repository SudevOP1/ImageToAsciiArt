from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os

from .ascii_generator.generator import get_ascii_text
from .models import *

# Create your views here.

@csrf_exempt
def get_ascii(request):
    if request.method == "POST":
        try:
            image = request.FILES.get("image")
            text_w = int(request.POST.get("text_w"))
            text_h = int(request.POST.get("text_h"))

            art_obj = Art.objects.create(
                image   = image,
                text_w  = text_w,
                text_h  = text_h,
            )
            
            ascii_text = get_ascii_text(art_obj.image.path, text_w, text_h)
            art_obj.ascii_text = ascii_text
            art_obj.save()
            return JsonResponse({"message":"success", "ascii_text": ascii_text})
        
        except Exception as e:
            if art_obj:
                if os.path.exists(art_obj.image.path): os.remove(art_obj.image.path)
                art_obj.delete()
            return JsonResponse({"message": "something went wrong", "error": str(e)}, status=400)
    return JsonResponse({"message": "Only POST requests allowed"}, status=405)
