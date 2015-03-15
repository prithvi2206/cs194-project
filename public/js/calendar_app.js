$.getScript('http://arshaw.com/js/fullcalendar-1.6.4/fullcalendar/fullcalendar.min.js',function(){

	/* Get events */
	$.get("/events/get", function(response) {

		var data = response.data;
		var events = [];

		for(var i=0; i < data.length; i++) {
			var event_i = {}
			event_i["title"] = data[i]["desc"];


			var start= new Date(data[i]["start"].iso);
			var end = new Date(data[i]["end"].iso);

			event_i["start"] = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
			event_i["end"] = new Date(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes());

			events.push(event_i);
		}

		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			editable: true,
			events: events
		});

	});

});
