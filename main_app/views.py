from django.forms import DateTimeField, DateTimeInput
from django.shortcuts import render, redirect
from django.core import serializers
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from .models import Event
import json
# Create your views here.
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse

from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm

from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

# Define the home view
def home(request):
    events = Event.objects.all()
    return render(request, 'events/index.html', { 'events': events })

def about(request):
    return render(request, 'about.html')

def events_index(request):
    events = Event.objects.all()
    return render(request, 'events/index.html', { 'events': events })

@login_required
def events_detail(request, event_id):
    event = Event.objects.get(id=event_id)
    return render(request, 'events/detail.html', { 'event': event })

class EventCreate(LoginRequiredMixin, CreateView):
    model = Event
    fields = ['name', 'location', 'event_time', 'event_date', 'details',]
#   '__all__'
    success_url = '/events/'

   

    def form_valid(self, form):
        event = form.save(commit=False)

        event.user = self.request.user
        event.lat = self.request.GET.get('lat', '')
        event.lng = self.request.GET.get('lng', '')
        # event.lng = json_stuff.lng
        #article.save()  # This is redundant, see comments.
        return super(EventCreate, self).form_valid(form)
    

class EventUpdate(UpdateView):
  model = Event
  fields = ['name', 'location', 'event_time', 'event_date', 'details',]

  #   '__all__'
  def form_valid(self, form):
        event = form.save(commit=False)
        event.user = self.request.user 
        return super(EventCreate, self).form_valid(form)

class EventDelete(LoginRequiredMixin, DeleteView):
  model = Event
  success_url = '/events/'

def event_to_JSON(event):
    dict = {}
    dict[""]

def get_JSON(request):
    events_JSON = Event.objects.all().values('id', 'user', 'name', 'location', 'event_time', 'event_date', 'details', 'lat', 'lng')
    return HttpResponse(events_JSON)

def create_JSON(request):
    pass


def signup(request):
    error_message = ""
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():

            user = form.save()
            login(request, user)
            return redirect('index')
        else:
            error_message = 'Invalid Credentials'

    form = UserCreationForm()
    context = {'form': form, 'error_message': error_message}
    return render(request, 'registration/signup.html', context)