define(["Test", "Tone/core/Timeline"], function (Test, Timeline) {

	describe("Timeline", function(){

		it ("can be created and disposed", function(){
			var sched = new Timeline();
			sched.dispose();
			Test.wasDisposed(sched);
		});

		it ("accepts events into the timeline", function(){
			var sched = new Timeline();
			sched.addEvent({
				"state" : "A",
				"time"  : 0
			});
			sched.addEvent({
				"state" : "B",
				"time"  : 1
			});
			sched.addEvent({
				"state" : "C",
				"time"  : 2
			});
			sched.dispose();
		});

		it ("can insert events in the timeline in the right order", function(){
			var sched = new Timeline();
			sched.addEvent({
				"time"  : 0
			});
			sched.addEvent({
				"time"  : 2
			});
			sched.addEvent({
				"time"  : 1
			});
			expect(sched._timeline[0].time).to.equal(0);
			expect(sched._timeline[1].time).to.equal(1);
			expect(sched._timeline[2].time).to.equal(2);
			sched.dispose();
		});

		it ("can get the length of the timeline", function(){
			var sched = new Timeline();
			expect(sched.length).to.equal(0);
			sched.addEvent({
				"time"  : 0
			});
			expect(sched.length).to.equal(1);
			sched.dispose();
		});

		it ("can remove items from the timeline", function(){
			var sched = new Timeline();
			var obj = {"time" : 0};
			sched.addEvent(obj);
			sched.addEvent({
				"time" : 2
			});
			expect(sched.length).to.equal(2);
			sched.removeEvent(obj);
			expect(sched.length).to.equal(1);
			sched.dispose();
		});

		it ("can search for events in the timeline by time", function(){
			var sched = new Timeline();
			sched.addEvent({
				"time"  : 0
			});
			sched.addEvent({
				"time"  : 2
			});
			sched.addEvent({
				"time"  : 1
			});
			expect(sched._search(0)).to.equal(0);
			expect(sched._search(0.01)).to.equal(0);
			expect(sched._search(1)).to.equal(1);
			expect(sched._search(1.01)).to.equal(1);
			expect(sched._search(20000)).to.equal(2);
			expect(sched._search(-1)).to.equal(-1);
			sched.dispose();
		});

		it ("can get the scheduled event at the given time", function(){
			var sched = new Timeline();
			sched.addEvent({
				"state" : "A",
				"time"  : 2
			});
			sched.addEvent({
				"state" : "C",
				"time"  : 9.4
			});
			sched.addEvent({
				"state" : "B",
				"time"  : 6
			});
			expect(sched.getEvent(0)).is.null
			expect(sched.getEvent(2).state).is.equal("A");
			expect(sched.getEvent(5.9).state).is.equal("A");
			expect(sched.getEvent(6.1).state).is.equal("B");
			expect(sched.getEvent(12).state).is.equal("C");
			sched.dispose();
		});

		it ("puts the second scheduled event after if two events are scheduled at the same time", function(){
			var sched = new Timeline();
			sched.addEvent({
				"name" : "A",
				"time"  : 0
			});
			sched.addEvent({
				"name" : "B",
				"time"  : 0
			});
			expect(sched.getEvent(0).name).is.equal("B");
			sched.addEvent({
				"name" : "C",
				"time"  : 0
			});
			expect(sched.getEvent(0).name).is.equal("C");
			sched.dispose();
		});

		it ("can the next event after the given time", function(){
			var sched = new Timeline();
			sched.addEvent({
				"state" : "A",
				"time"  : 0.1
			});
			sched.addEvent({
				"state" : "B",
				"time"  : 1.1
			});
			sched.addEvent({
				"state" : "C",
				"time"  : 2.1
			});
			expect(sched.getNextEvent(0).state).is.equal("A");
			expect(sched.getNextEvent(1).state).is.equal("B");
			expect(sched.getNextEvent(3)).is.null;
			sched.dispose();
		});

		it ("can clear items after the given time", function(){
			var sched = new Timeline();
			for (var i = 5; i < 100; i++){
				sched.addEvent({"time" : i});
			}
			sched.clear(10);
			expect(sched.length).to.equal(5);
			sched.clear(0);
			expect(sched.length).to.equal(0);
			sched.dispose();
		});

		it ("can clear items before the given time", function(){
			var sched = new Timeline();
			for (var i = 0; i < 100; i++){
				sched.addEvent({"time" : i});
			}
			sched.clearBefore(9);
			expect(sched.length).to.equal(90);
			sched.clearBefore(10.1);
			expect(sched.length).to.equal(89);
			sched.clearBefore(100);
			expect(sched.length).to.equal(0);
			sched.dispose();
		});

		it ("has no problem with many items", function(){
			var sched = new Timeline();
			for (var i = 0; i < 10000; i++){
				sched.addEvent({
					"time" : i
				});
			}
			for (var j = 0; j < 10000; j++){
				expect(sched.getEvent(j).time).to.equal(j);
			}
			sched.dispose();
		});

		context("Iterators", function(){

			it("iterates over all items and returns and item", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0});
				sched.addEvent({"time" : 0.1});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.3});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEach(function(event){
					expect(event).to.be.an.object;
					count++;
				});
				expect(count).to.equal(5);
				sched.dispose();
			});

			it("iterates over all items before the given time", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0});
				sched.addEvent({"time" : 0.1});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.3});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEachBefore(0.3, function(event){
					expect(event).to.be.an.object;
					expect(event.time).to.be.at.most(0.3);
					count++;
				});
				expect(count).to.equal(4);
				sched.dispose();
			});

			it("handles time ranges before the available objects", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0.1});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.3});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEachBefore(0, function(){
					count++;
				});
				expect(count).to.equal(0);
				sched.dispose();
			});

			it("iterates over all items after the given time", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0});
				sched.addEvent({"time" : 0.1});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.3});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEachAfter(0.1, function(event){
					expect(event).to.be.an.object;
					expect(event.time).to.be.above(0.1);
					count++;
				});
				expect(count).to.equal(3);
				sched.dispose();
			});

			it("handles time ranges after the available objects", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0.1});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.3});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEachAfter(0.5, function(){
					count++;
				});
				expect(count).to.equal(0);
				sched.dispose();
			});

			it("iterates over all items at the given time", function(){
				var sched = new Timeline();
				sched.addEvent({"time" : 0});
				sched.addEvent({"time" : 0});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.2});
				sched.addEvent({"time" : 0.4});
				var count = 0;
				sched.forEachAtTime(0.1, function(event){
					count++;
				});
				expect(count).to.equal(0);
				//and with an actual time
				sched.forEachAtTime(0.2, function(event){
					expect(event.time).to.equal(0.2);
					count++;
				});
				expect(count).to.equal(2);
				sched.dispose();
			});

			it("can remove items during iterations", function(){
				var sched = new Timeline();
				for (var i = 0; i < 1000; i++){
					sched.addEvent({"time" : i});
				}
				sched.forEach(function(event){
					sched.removeEvent(event);
				});
				expect(sched.length).to.equal(0);
				sched.dispose();
			});
		});
	});
});