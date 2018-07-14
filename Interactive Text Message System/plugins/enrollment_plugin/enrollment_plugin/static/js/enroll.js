var getData = ""
var getParameterByName = function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};
$(document).ready(function(){
	var enrolment_id = getParameterByName("enrollment_id");
		  $.ajax({
			url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	data:JSON.stringify({"function_call": "fetch_enrolment_names","enrolment_id": enrolment_id}),
          	success:function(data){
	          //we can call the function to again load this and refresh the list of all the images it has
			  getData = data;
			  var rhtml = "";
			  rhtml += "<label>Name: </label> " + data["Enrolment_name"] + "<br />";
            	document.getElementById("fetch_name").innerHTML = rhtml;
          		
     		},
           	error:function(data){
             		alert(JSON.stringify(data));
           	}
   	});
	});


	
/*
function addParticipant() {
    //var plugin_id = $("#sel_plugin").find(":selected").val();
	console.log(getData);
	console.log("hi")
    var plugin_contact = $("#tb_contact").val();
    var plugin_name = $("#tb_name").val();
	var enrolment_id = getParameterByName("enrollment_id");
	var to_send = {
		"function_call": "push_participants",
        "enrolment_id": enrolment_id,
		"participant_id":parseInt(getData[0]) + 1,
		"enrolment_name":getData[1],
        "participant_name": plugin_name,
        "participant_contact_no": plugin_contact
    };
    $.ajax(
        {
            url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	data:JSON.stringify(to_send),
          	success:function(data){
     		},
           	error:function(data){
             		alert(JSON.stringify(data));
           	}
        }
    );
}
*/



function addParticipant() {
   if (confirm("Are you sure you want to save?")) {
	var plugin_contact = $("#tb_contact").val();
    var plugin_name = $("#tb_name").val();
	var enrolment_id = getParameterByName("enrollment_id");
	console.log(getData);
	enrolment_name = getData["Enrolment_name"];
	   $.ajax({
		url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
		type:'POST',
		crossDomain: true,
		contentType: 'application/json',
		dataType: 'json',
		data:JSON.stringify({"function_call": "fetch_participant_id"}),
		success:function(data){
		console.log(data)
			var to_send = {
		   "function_call": "push_participants",
		   "enrolment_id": enrolment_id,
		   "participant_id": data["Participant_Id"] + 1,
		   "enrolment_name": enrolment_name,
		   "participant_name": plugin_name,
		   "participant_contact": plugin_contact
	   };
	   console.log(JSON.stringify(to_send));
	   $.ajax(
		   {
				url: "https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
				type:'POST',
				crossDomain: true,
				contentType: 'application/json',
				dataType: 'json',
				data:JSON.stringify(to_send),
			   success: function(data) {
			   console.log(data),
				   // noinspection SillyAssignmentJS
				   document.location.href = document.location.href;
			   },
			   fail: function(data) {
			   console.log(data),
				   alert("Error occurred on saving of enrollment");
			   }
		   }
	   );
		},
		error:function(data){
				alert(JSON.stringify(data));
		}
	});
	   
   }
}


