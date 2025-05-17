from django.db import models
import uuid

# Create your models here.

class Art(models.Model):
    unique_id   = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    image       = models.ImageField(blank=False)
    datetime    = models.DateTimeField(auto_now_add=True)
    ascii_text  = models.TextField()
    text_w      = models.IntegerField(blank=False)
    text_h      = models.IntegerField(blank=False)

    def __str__(self):
        return f"Art {self.datetime} - {self.unique_id}"
