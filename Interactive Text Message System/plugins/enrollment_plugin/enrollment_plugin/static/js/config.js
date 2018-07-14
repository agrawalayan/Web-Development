$(document).ready(function() {
    $("#btn_back").click(function() {
		$("#config_home").show();
        $("#config_wizard").hide();
		//$("#config_home_metadata").hide();
		$("#config_wizard_metadata").hide();
        
    });
	$("#btn_back_1").click(function() {
		$("#config_home").show();
        $("#config_wizard").hide();
		//$("#config_home_metadata").hide();
		$("#config_wizard_metadata").hide();
        
    });

    $("#btn_save").click(function() {
       if (confirm("Are you sure you want to save?")) {
		   $.ajax({
			url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	data:JSON.stringify({"function_call": "fetch_enrolment_id"}),
          	success:function(data){
				var to_send = {
			   "function_call": "push_enrolment_data",
			   "enrolment_id": data["Enrolment_Id"] + 1,
               "enrolment_name": $("#tb_name").val(),
               "enrolment_open": $("#dp_open").val(),
               "enrolment_close": $("#dp_close").val(),
               //"expires": $("#cb_expires").is(":checked"),
               "enrolment_expiry": $("#dp_expires").val(),
               //"plugin_id": $("#plugin_id").html()
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
                   success: function() {
                       // noinspection SillyAssignmentJS
                       document.location.href = document.location.href;
                   },
                   fail: function() {
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
    });

    $("#cb_expires").change(function(){
        if ($(this).is(":checked")) {
            $("#dp_expires").prop("disabled", false);
        } else {
            $("#dp_expires").prop("disabled", true);
        }
    });

    $("#btn_new_enrollment").click(function(){
        prepare_wizard_new();
        $("#config_home").hide();
        $("#config_wizard").show();
    });
});


function sendMsg()
	{
	  $.ajax({
			data:JSON.stringify({"function_call": "fetch_view_enrolments"}),
			url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	success:function(data){
	          //we can call the function to again load this and refresh the list of all the images it has
            		var enroledParticipants = data;
					var i;
					var rhrml = "";
					for (i = 0; i < enroledParticipants.length; i++) {
						rhrml += "<tr><td>" + enroledParticipants[i]["Enrolment_Name"] + "</td><td>" + enroledParticipants[i]["Participants_Count"] + 
						"</td><td><button onclick="+ "show_metadata(" + enroledParticipants[i]["Enrolment_Id"] + ")" + " class=" + "btn btn-info btn-xs"+ 
						">Metadata"+ "</button>" + "</td><td><button onclick=" + "remove_enrollment(" + enroledParticipants[i]["Enrolment_Id"] + ")" +
                        " class=" + "btn btn-danger btn-xs" + ">Remove</button></td></tr>"
					
					}
					document.getElementById("enrolemnt_table").innerHTML = rhrml
          		
     		},
           	error:function(data){
             		alert(JSON.stringify(data));
           	}
   	});
	};


function show_metadata(enrollment_id) {
    $.ajax(
        {
  
            url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	data:JSON.stringify({"function_call": "fetch_enrolment_metadata","enrolment_id":enrollment_id}),
            success: function(data) {
                prepare_wizard_existing([enrollment_id,"https://s3.amazonaws.com/rapid-sms/EnrollmentPlugin/enrollment_plugin/templates/enrollments/enroll.html?enrollment_id=" + enrollment_id,data["Enrolment_name"],data["Enrolment_Open"],data["Enrolment_Close"],data["Enrolment_Expiry"]]);
                $("#config_home").hide();
                $("#config_wizard").hide();
				$("#config_wizard_metadata").show();
            },
            fail: function() {
                alert("Metadata retrieval failed");
            }
        }
    );
}

function remove_enrollment(enrollment_id) {

    var to_send = {
        //"plugin_id": $("#plugin_id").html(),
		"function_call": "remove_enrolment",
        "enrolment_id": enrollment_id
    };

    if (confirm("Removing enrollments will remove all participants in enrollment and any associated surveys")) {
        $.ajax({
            url: "https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
            type:'POST',
			crossDomain: true,
			contentType: 'application/json',
			dataType: 'json',
			data:JSON.stringify(to_send),
		   success: function(data) {
			   // noinspection SillyAssignmentJS
			   //document.location.href = document.location.href;
			   console.log(data)
			   sendMsg();
		   },
		   error:function(data){
             		alert(JSON.stringify(data));
		   }
        });
    }
}

function prepare_wizard_new() {
    $("#span_id").html("0");
    $("#span_url").html("0");
    $("#tb_name").val("");
    $("#dp_open").val("");
    $("#dp_close").val("");
    $("#cb_expires").prop('checked', false);
    $("#dp_expires").val("").prop('disabled', true);
}

function prepare_wizard_existing(enrollment) {
	//console.log(enrollment);
    $("#span_id_metadata").html(enrollment[0]);
    var url_html = '<a target="_blank" href="' + enrollment[1] + '">' + enrollment[1] + "</a>";
    $("#span_url_metadata").html(url_html);
    $("#tb_name_metadata").html(enrollment[2]);
    $("#dp_open_metadata").html(enrollment[3]);
    $("#dp_close_metadata").html(enrollment[4]);
	$("#dp_expires_metadata").html(enrollment[5]);
	/*
    if (enrollment[5] === null) {
        $("#cb_expires").prop('checked', false);
        $("#dp_expires").val("").prop('disabled', true);
    } else {
        $("#cb_expires").prop('checked', true);
        $("#dp_expires").val(enrollment["expiry_date"]).prop('disabled', false);
    }
	*/
}