var number_of_runtimes = 1;
var number_of_dates = 1;

$(document).ready(function() {
	$("#btn_new_task").click(function() {
		$.ajax({
			data:JSON.stringify({"function_call": "getAllEnrollmentNames"}),
			url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
			crossDomain: true,
			contentType: 'application/json',
			dataType: 'json',
			success:function(data){
			  //we can call the function to again load this and refresh the list of all the images it has
			  console.log(data)
					var i;
					var rhrml = "<label for="+"sel_enrollment"+">Enrollment: </label><select id="+"sel_enrollment" +" class="+"form-control"+">";
						for (i = 0; i < data.length; i++) {
						 rhrml += "<option value="+data[i]["Enrolment_id"]+">"+data[i]["Enrolment_name"]+"</option>"
						}
						rhrml +="</select><label>Protocol: </label><select id="+"sel_protocol"+ " class="+ "form-control"+">"+
                                "<option value="+"1"+">QS1</option>"+
                            "</select>"
						document.getElementById("dropdown_functionality").innerHTML = rhrml
					
				},
				error:function(data){
						alert(JSON.stringify(data));
				}
		});
	})						
    $("#btn_vt_back").click(function() {
        $("#config_view_times").hide();
        $("#config_home").show();
    });

    $("#btn_w_back").click(function() {
        $("#config_wizard").hide();
        $("#config_home").show();
    });

    $("#btn_save").click(function() {
			if (confirm("Are you sure you want to save?")) {
			var time_rule = get_time_rule_from_ui();
			   $.ajax({
				url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
				type:'POST',
				crossDomain: true,
				contentType: 'application/json',
				dataType: 'json',
				data:JSON.stringify({"function_call": "fetch_survey_id"}),
				success:function(data){
					var to_send = {
				   "function_call": "push_survey_data",
				   "enrolment_id": $("#sel_enrollment").find(":selected").val(),
				   "survey_id": data["Survey_id"] + 1,
				   "task_name": $("#tb_name").val(),
				   "protocol_name": $("#sel_protocol").find(":selected").val(),
				   "time_rule": time_rule
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
	
/*
       if (confirm("Are you sure you want to save?")) {
           var time_rule = get_time_rule_from_ui();

           var to_send = {
               "plugin_id": $("#plugin_id").html(),
               "name": $("#tb_name").val(),
               "protocol_id": $("#sel_protocol").find(":selected").val(),
               "enrollment_id": $("#sel_enrollment").find(":selected").val(),
               "time_rule": JSON.stringify(time_rule),
               "enable_notes": $("#cb_notes").is(":checked")
           };
           var timeout_val = $("#tb_timeout").val();
           if (timeout_val !== null && timeout_val.trim() !== "") {
               to_send["timeout"] = timeout_val;
               to_send["enable_warnings"] = $("#cb_warnings").is(":checked");
           } else {
               to_send["timeout"] = 120;
               to_send["enable_warnings"] = false
           }

           $.ajax(
               {
                   url: "/task/",
                   method: "POST",
                   data: to_send,
                   success: function() {
                       // noinspection SillyAssignmentJS
                       document.location.href = document.location.href;
                   },
                   fail: function() {
                       alert("Error occurred on saving of surveys");
                   }
               }
           );
       }
    });
*/

    $("#cb_repeats").change(function(){
        if ($(this).is(":checked")) {
            $("#repeats").show();
            $("#sel_repeats").val('daily');
            $("#repeats_daily").show();
            $("#div_until").show();
        } else {
            $("#repeats").hide();
            $("#repeats_daily").hide();
            $("#repeats_weekly").hide();
            $("#repeats_monthly_date").hide();
            $("#repeats_monthly_day").hide();
            $("#div_until").hide();
        }
    });

    $("#sel_repeats").change(function() {
        var value = $("#sel_repeats").find(":selected").val();

        if (value === 'daily') {
            $("#repeats_daily").show();
            $("#repeats_weekly").hide();
            $("#repeats_monthly_date").hide();
            $("#repeats_monthly_day").hide();
        } else if (value === 'weekly') {
            $("#repeats_daily").hide();
            $("#repeats_weekly").show();
            $("#repeats_monthly_date").hide();
            $("#repeats_monthly_day").hide();
        } else if (value === 'monthly_date') {
            $("#repeats_daily").hide();
            $("#repeats_weekly").hide();
            $("#repeats_monthly_date").show();
            $("#repeats_monthly_day").hide();
        } else if (value === 'monthly_day') {
            $("#repeats_daily").hide();
            $("#repeats_weekly").hide();
            $("#repeats_monthly_date").hide();
            $("#repeats_monthly_day").show();
        }
    });

    $("#btn_new_task").click(function(){
        $("#config_home").hide();
        number_of_runtimes = 1;
        number_of_dates = 1;
        $("#config_wizard").show();
    });

    $("#btn_add_runtime").click(function() {
       number_of_runtimes += 1;
       var html = '<label for="tp_runtime' + number_of_runtimes + '">Runtime: </label><input id="tp_runtime' + number_of_runtimes + '" type="time" class="form-control">';
       $("#runtimes").append(html)
    });

    $("#btn_add_date").click(function() {
       number_of_dates += 1;
       var html = '<label for="tb_date' + number_of_dates + '">Date of month: </label><input id="tb_date' + number_of_dates + '" class="form-control" size="2">';
       $("#rundates").append(html)
    });
});

function sendMsg()
	{
	  $.ajax({
			url:"https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
			type:'POST',
	        crossDomain: true,
        	contentType: 'application/json',
          	dataType: 'json',
          	data:JSON.stringify({"function_call": "fetch_view_tasks"}),
          	success:function(data){
            		var tasks = data;
					var i;
					var rhrml = "";
					for (i = 0; i < tasks.length; i++) {
						rhrml += "<tr><td>" + tasks[i]["Task_name"] + "</td><td>" + tasks[i]["Protocol_name"] + "</td><td>" + tasks[i]["Enrolment_name"] +
						"</td><td><button onclick="+ "view_run_times(" + tasks[i]["Task_name"] + ")" + " class=" + "btn btn-info btn-xs"+ 
						">View Runtime"+ "</button>" + "</td><td><button onclick=" + "remove_task(" + tasks[i]["Survey_id"] + ")" +
                        " class=" + "btn btn-danger btn-xs" + ">Remove</button></td></tr>"
					
					}
					document.getElementById("tasks_table").innerHTML = rhrml
          		
     		},
           	error:function(data){
             		alert(JSON.stringify(data));
           	}
   	});
	};




function get_time_rule_from_ui() {

    var time_rule = {};
    time_rule["run_date"] = $("#dp_run_date").val();
	time_rule["timezone"] = $("#tp_timezone :selected").val();
    time_rule["run_times"] = get_run_times();
    time_rule["until"] = $("#dp_until").val();

    if ($("#cb_repeats").is(":checked")) {
        var selected_rule = $('#sel_repeats').find(":selected").val();

        if (selected_rule === 'daily') {
            time_rule["type"] = 'daily';
            time_rule["params"] = get_daily_params();
        } else if (selected_rule === 'weekly') {
            time_rule["type"] = 'weekly';
            time_rule["params"] = get_weekly_params();
        } else if (selected_rule === 'monthly_date') {
            time_rule["type"] = 'monthly_date';
            time_rule["params"] = get_monthly_date_params();
        } else if (selected_rule === 'monthly_day') {
            time_rule["type"] = 'monthly_day';
            time_rule["params"] = get_monthly_day_params();
        }
    } else {
        time_rule["type"] = "no_repeat";
        time_rule["params"] = null
    }
    console.log('Hi');
    return time_rule;
}

function get_daily_params() {
    var params = {};
    params["every"] = $("#tb_every_daily").val();
    return params;
}

function get_weekly_params() {
    var params = {};
    params["every"] = $("#tb_every_weekly").val();

    var days = [];

    if ($("#cb_w_mon").is(":checked")) {
        days.push(0);
    }

    if ($("#cb_w_tue").is(":checked")) {
        days.push(1);
    }

    if ($("#cb_w_wed").is(":checked")) {
        days.push(2);
    }

    if ($("#cb_w_thu").is(":checked")) {
        days.push(3);
    }

    if ($("#cb_w_fri").is(":checked")) {
        days.push(4);
    }

    if ($("#cb_w_sat").is(":checked")) {
        days.push(5);
    }

    if ($("#cb_w_sun").is(":checked")) {
        days.push(6);
    }

    params["days"] = days;

    return params;
}

function get_monthly_date_params() {
    var params = {};
    params["every"] = $("#tb_every_monthly_date").val();

    var dates = [];

    for (var i = 1; i <= number_of_dates; i++) {
        dates.push(parseInt($("#tb_date" + i).val()));
    }

    params["dates"] = dates;

    return params;
}

function get_monthly_day_params() {
    var params = {};
    params["every"] = $("#tb_every_monthly_day").val();

    var param1 = $('#sel_monthly_day').find(":selected").val();

    var days = [];

    if ($("#cb_m_mon").is(":checked")) {
        days.push(0);
    }

    if ($("#cb_m_tue").is(":checked")) {
        days.push(1);
    }

    if ($("#cb_m_wed").is(":checked")) {
        days.push(2);
    }

    if ($("#cb_m_thu").is(":checked")) {
        days.push(3);
    }

    if ($("#cb_m_fri").is(":checked")) {
        days.push(4);
    }

    if ($("#cb_m_sat").is(":checked")) {
        days.push(5);
    }

    if ($("#cb_m_sun").is(":checked")) {
        days.push(6);
    }

    params["param1"] = param1;
    params["days"] = days;

    return params;
}

function get_run_times() {

    var runtimes = [];

    for (var i = 1; i <= number_of_runtimes; i++) {
        runtimes.push($("#tp_runtime" + i).val());
    }

    return runtimes;
}

function remove_task(task_id) {

    //var plugin_id =  $("#plugin_id").html();

    var to_send = {
       "function_call": "remove_survey",
        "survey_id": task_id
    };

    if (confirm("Any surveys scheduled under this task in the next hour may still be executed," +
            " restart system for immediate effect")) {
        $.ajax({
            url: "https://8gdbz18w2c.execute-api.us-east-1.amazonaws.com/test/lambda-rds",
					type:'POST',
					crossDomain: true,
					contentType: 'application/json',
					dataType: 'json',
            data: JSON.stringify(to_send),
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

function view_run_times(id) {
    $.ajax({
        url: "/task?task_id=" + id + "&plugin_id=" + $("#plugin_id").html(),
        method: "GET",
        success: function(data) {

            var run_times = data["run_times"];
            var html = "";

            $.each(run_times, function(index, run_time){
                html += "<tr><td>" + run_time['year'] + "</td>";
                html += "<td>" + run_time['month'] + "</td>";
                html += "<td>" + run_time['day'] + "</td>";
                html += "<td>" + run_time['time'] + "</td></tr>"
            });

            $("#tbody_run_times").html(html);

            $("#config_view_times").show();
            $("#config_home").hide();
        },
        fail: function (){
            alert("Failure retrieving run times for task")
        }
    });
}
