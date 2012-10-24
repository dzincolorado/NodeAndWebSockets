var db = require("mongojs").connect(process.env.MONGOLABLIFE_URI || "mongodb://localhost/trackers");

exports.up = function(next){
	console.log("migrate DB conn: " + process.env.MONGOLABLIFE_URI);
	db.createCollection("category", function(err, collection){
		if(!err)
			{
			var docs = [];
			docs.push(
				{
					name: "Education",
					description: "Education related; reading self-help books, classes, online courses, etc.",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Work",
					description: "Work related",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Mental Training",
					description: "Puzzles, Sodoku, MineSweeper",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Chore",
					description: "Plain ole chores",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Health",
					description: "Cross Training, running, swimming, exercise",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Self Defense",
					description: "Martial Arts, boxing",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Family",
					description: "Hanging with the fam",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Rest & Relaxation",
					description: "Nap, sleep, massage",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Meditation",
					description: "Meditating, praying, painting",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Commuting",
					description: "Bus, car, bike, skateboard",
					addDate: new Date()
				}
			);
			
			docs.push(
				{
					name: "Social",
					description: "Book club, beer night, poker night, chatting on the phone",
					addDate: new Date()
				}
			);
			
			console.log(docs);
			
			collection.insert(docs);
			next();
		}
		else{
			console.log(err);
		}
	})
};

exports.down = function(next){
  next();
};
