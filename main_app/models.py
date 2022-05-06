from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from datetime import date
from datetime import time
# Create your models here
# class User(models.Model):
#     name = models.CharField(max_length=100)

EVENT_TYPE_CHOICES = (
    ('Meet Up', 'meet up'),
    ('Party', 'party'),
    ('Music', 'music'),
    ('Community', 'community'),
    ('Professional', 'professional'),
    ('Social', 'social'),
    ('Sport', 'sport'),
    ('Lifestyle', 'lifestyle'),
    ('Religious', 'religious'),
)

class Event(models.Model):
    name = models.CharField(max_length=101)
    location = models.CharField(max_length=300)
    lat = models.CharField(max_length=101)
    lng = models.CharField(max_length=101)
    event_time = models.TimeField(null=True)
    event_date = models.DateField(null=True)
    time_created = models.TimeField(null=True)
    date_created = models.DateField(null=True)
    event_type = models.CharField(max_length=30, choices=EVENT_TYPE_CHOICES, default=EVENT_TYPE_CHOICES[0])
    details = models.CharField(max_length=1000)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fields = ['event_date', 'event_time']

    def __str__(self):
        return f"The event named {self.name} has id of {self.id}"
    

  # Add this method
    def get_absolute_url(self):
        return reverse('detail', kwargs={'event_id': self.id})
    


# class UserProfile(models.Model):
# 	'''
# 	Our UserProfile model extends the built-in Django User Model
# 	'''
# 	timestamp = models.DateTimeField(auto_now_add=True)
# 	updated = models.DateTimeField(auto_now=True)
# 	user = models.OneToOneField(User, on_delete=models.CASCADE)
	
# 	address = models.CharField(verbose_name="Address",max_length=100, null=True, blank=True)
# 	town = models.CharField(verbose_name="Town/City",max_length=100, null=True, blank=True)
# 	county = models.CharField(verbose_name="County",max_length=100, null=True, blank=True)
# 	post_code = models.CharField(verbose_name="Post Code",max_length=8, null=True, blank=True)
# 	country = models.CharField(verbose_name="Country",max_length=100, null=True, blank=True)
# 	longitude = models.CharField(verbose_name="Longitude",max_length=50, null=True, blank=True)
# 	latitude = models.CharField(verbose_name="Latitude",max_length=50, null=True, blank=True)

# 	captcha_score = models.FloatField(default = 0.0)
# 	has_profile = models.BooleanField(default = False)
	
# 	is_active = models.BooleanField(default = True)

# 	def __str__(self):
# 		return f'{self.user}'
