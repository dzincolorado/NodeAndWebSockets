var defaultActivity = "Twiddling my thumbs";
var model = new TrackerViewModel();
var emotionModel = new EmotionViewModel();
var categoryModel = new CategoryViewModel();

function Tracker(id, startMinute, endMinute, activity, emotion, emotionValue, addDate){
	var self = this;
	
	self.trackerId = id;
	self.startMinute = ko.observable(startMinute);
	self.endMinute = ko.observable(endMinute);
	self.activity = ko.observable(activity);
	self.emotion = ko.observable(emotion);
	self.emotionValue = ko.observable(emotionValue);
	self.addDate = ko.observable(addDate)
	
	self.formattedDate = ko.computed(function(){
		return new Date(self.addDate()).toDateString();
	});
	
	self.label = ko.computed(function(){
		return buildTrackerLabel(self.startMinute(), self.endMinute(), self.activity());
	});
}

function TrackerViewModel(){
	var self = this;
	
	self.trackers = ko.observableArray([]);
	
	self.addTracker = function(id, startMinute, endMinute, activity, emotion, emotionValue, addDate){
		
		self.trackers.push(new Tracker(id, startMinute, endMinute, activity, emotion, emotionValue, addDate));
	}
}

function Emotion(name, value, color){
	var self = this;
	
	self.name = ko.observable(name);
	self.value = ko.observable(value);
	self.color = ko.observable(color);
}

function EmotionViewModel(){
	var self = this;
	self.emotionValues = ko.observableArray([]);
}

function Category(name){
	var self = this;
	self.name = ko.observable(name);
}

function CategoryViewModel(){
	var self = this;
	self.categories = ko.observableArray([]);
}

function configureDataBindings(){
	ko.applyBindings(model, document.getElementById("olTrackers"));
	ko.applyBindings(emotionModel, document.getElementById("ddlEmotion"));
	ko.applyBindings(categoryModel, document.getElementById("ddlCategory"));
}