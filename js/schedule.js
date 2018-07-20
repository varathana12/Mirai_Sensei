if(!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number){
            return typeof args[number] != undefined
                ? args[number] : match;
        });
    }
}

var MIRAI;
if(!MIRAI) { MIRAI = {}; }
if(!MIRAI.main) {MIRAI.main = {};}

(function($){
    var func = MIRAI.main;

    func.fetchEventsData = function(url) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                var list_location=[]
                var response = JSON.parse(JSON.stringify(res)),
                    timetables = response.event_dates[0].timetables,
                    events = {
                        eventOn15th: {},
                        eventOn16th: {}
                    };
                var start_time_15=[];
                var end_time_15 = []
                var start_time_16=[];
                var end_time_16 = [];
                var borderHtml15=""
                var borderHalfHtml15=""
                var borderHtml16=""
                var borderHalfHtml16=""
                var widthLocation15 = 0;
                var widthLocation16 = 0;
                var count = 1;
                var defaultHeightCard = 0
                if($(document).width() <= 1023){
                    defaultHeightCard = 80
                }else{
                    defaultHeightCard = 120
                }
                timetables.sort(func.sortLocation)
                timetables.map(function(ele, index){
                    var startTime = moment(ele.start).format('HH:mm'),
                        endTime = moment(ele.end).format('HH:mm'),
                        startDate = moment(ele.start).format('DD'),
                        endDate = moment(ele.end).format('DD'),
                        locationName = ele.location
                    if(startDate === "15"){
                        start_time_15.push(startTime.split(":")[0])
                        end_time_15.push(endTime.split(":")[0])
                        if(!events.eventOn15th.hasOwnProperty(locationName)){
                            events.eventOn15th[locationName] =[]
                            var locationElementHtml = func.locationTemplate.format(
                                locationName
                            )
                            locationElementHtml = $.parseHTML(locationElementHtml);
                            $("#location15").append(locationElementHtml)
                        }
                        ele["start"] = startTime
                        ele["end"] = endTime
                        events.eventOn15th[locationName].push(ele)
                    }else{
                        start_time_16.push(startTime.split(":")[0])
                        end_time_16.push(endTime.split(":")[0])
                        if(!events.eventOn16th.hasOwnProperty(locationName)){
                            events.eventOn16th[locationName] = []
                            var locationElementHtml = func.locationTemplate.format(
                                locationName
                            )
                            locationElementHtml = $.parseHTML(locationElementHtml);
                            $("#location16").append(locationElementHtml)
                        }
                        ele["start"] = startTime
                        ele["end"] = endTime
                        events.eventOn16th[locationName].push(ele)
                    }
                })

                events.eventOn15th = func.sortDate(events.eventOn15th)
                events.eventOn16th = func.sortDate(events.eventOn16th)
                for(var i = Math.min(...start_time_15);i<=Math.max(...end_time_15);i++){
                    widthLocation15 = widthLocation15 + 290
                    var timelineHtml15 = func.timelineTemplate.format(i+":00")
                    borderHtml15= borderHtml15 + func.hourBorderTemplate.format()
                    timelineHtml15 = $.parseHTML(timelineHtml15);
                    $("#time_line_15").append(timelineHtml15)
                }
                for(var i = Math.min(...start_time_16);i<Math.max(...end_time_16);i++){
                    widthLocation16 = widthLocation16 + 290
                    var timelineHtml16 = func.timelineTemplate.format(i+":00")
                    borderHtml16 = borderHtml16 + func.hourBorderTemplate.format()

                    timelineHtml16 = $.parseHTML(timelineHtml16);
                    $("#time_line_16").append(timelineHtml16)
                }
                for(var key  in events.eventOn15th){
                    var listCardEvent = "";
                    var listDetailEvent =""
                    var next = false
                    for(var i in events.eventOn15th[key]){
                       var timeStart = moment.duration(events.eventOn15th[key][i].start).asHours();
                       var timeEnd = moment.duration(events.eventOn15th[key][i].end).asHours();
                       var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_15)))
                        var left =  between * 290



                        var html = func.cardEventTemplate.format(
                            left+"px",
                            duration+"px",
                            events.eventOn15th[key][i].start + " ~ " + events.eventOn15th[key][i].end,
                            events.eventOn15th[key][i].name,
                            "15"+count
                        )
                        html = $.parseHTML(html)
                        if(next){
                            $(html[1]).addClass('divide_column_next')
                            next= false
                        }

                        if(parseInt(i)+1 < events.eventOn15th[key].length){
                            if(timeEnd > moment.duration(events.eventOn15th[key][parseInt(i)+1].start).asHours()){
                                $(html[1]).addClass('divide_column_first')
                                next = true
                            }

                        }

                        if(duration<100) {
                            $(html[1].getElementsByClassName('time')).css({'padding': 2})
                            $(html[1].getElementsByClassName('title')).css({'font-size': 10,"padding":0})

                        }

                        listCardEvent = listCardEvent + html[1].outerHTML
                        listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                            "15"+count,
                            events.eventOn15th[key][i].start + " ~ " + events.eventOn15th[key][i].end,
                            events.eventOn15th[key][i].location,
                            events.eventOn15th[key][i].description,
                            events.eventOn15th[key][i].name
                        )
                        count++

                    }
                    $('#in_location_15').append(" <div class='event_in_location' style='display: inline-flex;margin-left: 1px' " +
                        "my_width='"+widthLocation15+"'>"
                        +listCardEvent+listDetailEvent+borderHtml15+"</div>")
                }
                for(var key in events.eventOn16th){
                    var listCardEvent = "";
                    var listDetailEvent =""
                    var listDuplicate=[]
                    var next = false
                    for(var i in events.eventOn16th[key]){
                        var timeStart = moment.duration(events.eventOn16th[key][i].start).asHours();
                        var timeEnd = moment.duration(events.eventOn16th[key][i].end).asHours();
                        var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_16)))
                        var left =  between * 290


                            var html = func.cardEventMultipleTemplate.format(
                            left+"px",
                            duration+"px",
                            events.eventOn16th[key][i].start + " ~ " + events.eventOn16th[key][i].end,
                            events.eventOn16th[key][i].name,
                            "16"+count
                        )
                        html = $.parseHTML(html)

                        if(duration<100) {
                            $(html[1].getElementsByClassName('time')).css({'padding': 2})
                            $(html[1].getElementsByClassName('title')).css({'font-size': 10})

                        }
                        if(next){
                            //$(html[1]).addClass('divide_column_next')
                            next= false
                            listDuplicate.push(html)
                            if(timeEnd > moment.duration(events.eventOn16th[key][parseInt(i)+1].start).asHours()){
                                //$(html[1]).addClass('divide_column_first')
                                next = true

                            }

                        }
                        else if(parseInt(i)+1 < events.eventOn16th[key].length){
                            if(timeEnd > moment.duration(events.eventOn16th[key][parseInt(i)+1].start).asHours()){
                                //$(html[1]).addClass('divide_column_first')
                                next = true

                                listDuplicate.push(html)

                            }

                        }
                        else{
                            listCardEvent = listCardEvent + html[1].outerHTML;
                        }



                        listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                            "16"+count,
                            events.eventOn16th[key][i].start + " ~ " + events.eventOn16th[key][i].end,
                            events.eventOn16th[key][i].location,
                            events.eventOn16th[key][i].description,
                            events.eventOn16th[key][i].name
                        )
                        count++

                    }

                    var height = (defaultHeightCard/listDuplicate.length) -1
                    for(var i in listDuplicate){
                        $(listDuplicate[i][1]).css({'height':height,'margin-top':i*height})
                        if(listDuplicate.length>2){
                            $(listDuplicate[i][1].getElementsByClassName('divider_card')).css({'display':'inline-flex'})
                            $(listDuplicate[i][1].getElementsByClassName('title')).css({'font-size':10,'line-height':"22px",'padding':0})
                        }
                        listCardEvent = listCardEvent + listDuplicate[i][1].outerHTML

                    }

                    $('#in_location_16').append(" <div class='event_in_location' style='display: inline-flex;margin-left: 1px'" +
                        " my_width='"+widthLocation16+"'>"
                        +listCardEvent+listDetailEvent+borderHtml16+"</div>")
                }




            },
            error: function(error) {
                console.log(error);
            }
        })
    }


    func.sortLocation = function(a,b) {
        if (a.location < b.location)
            return -1;
        if (a.location > b.location)
            return 1;
        return 0;
    }
     func.compare = function(a,b) {
        if (a.start < b.start)
            return -1;
        if (a.start > b.start)
            return 1;
        return 0;
    }

    func.sortDate = function(event){
        for(var i in event){
            event[i].sort(func.compare);
        }
        return event
    }




    func.locationTemplate = `
    <div class='one_location'>
        <span>{0}</span>
    </div>
    `;
    func.eventTemplate=`
    <div class='event_box' style='{0}; width:{1};' event_id='{2}' onClick='VisionEventRegist.func.OpenDetail(this);'>
        <p class='event_detail cat_color' style='background-color:#cddc39'></p>
        <p class='event_detail time'>{3}</p>
        <p class='event_detail mark'>{4}</p>
        <p class='event_detail title'>{5}</p>
        <p class='btn'>イベント概要・会場</p>
    </div>

    
    `
    func.hourBorderTemplate = `
    <div class='half time_mat' style='width:144px;'></div><div class='hour time_mat' style='width:144px;'></div>
    
    `;


    func.timelineTemplate = `
    <div style='width:calc( 145px * 2 );'>{0}</div>
    `;
    func.cardEventTemplate=`
    <div class='event_box' style='left:{0}; width:{1};' event_id='even_id_is_{4}' onClick='VisionEventRegist.func.OpenDetail(this);'>
        <p class='event_detail cat_color' style='background-color:#5e9516'></p>
        <p class='event_detail time'>{2}</p>
        <p class='event_detail title title_card' style="width: {1}">{3}</p>
    </div>
    `


    func.cardEventMultipleTemplate=`
    <div class='event_box' style='left:{0}; width:{1};' event_id='even_id_is_{4}' onClick='VisionEventRegist.func.OpenDetail(this);'>
        <p class='event_detail cat_color' style='background-color:#5e9516'></p>
        <div class="divider_card">
            <p class='event_detail time'>{2}</p>
            <p class='event_detail title title_card' style="width: {1}">{3}</p>
        </div>
        
    </div>
    `


    func.detailEventTemplate = `
    <div event_id='even_id_is_{0}' class='event_detail_mask' onClick='VisionEventRegist.func.CloseDetail(this);'></div>
    <div event_id='even_id_is_{0}' style="height: 450px" class='event_detail_box'>
	<p class='event_detail cat_color' style='background-color:#cddc39;'></p>
	 <i class="fas fa-times close-icon" event_id='even_id_is_{0}' onClick='VisionEventRegist.func.CloseDetail(this);'></i>
	<p class='event_detail time'>{1}</p>
	<p class='event_detail location'>{2}</p>
	<p class='event_detail title'>{4}</p>
	<p class='event_detail description'>{3}</p>
</div>
    `



})(jQuery);

$(document).ready(function() {

    MIRAI.main.fetchEventsData('https://api.eventregist.com/v/2/timetable/get?event_uid=3b75c6deb1a72cf894781a8c5e4f0e64');


});
