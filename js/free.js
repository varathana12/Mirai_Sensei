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
                var count15 = 0;
                var count16=0
                var defaultHeightCard = 0
                if($(document).width() <= 1023){
                    defaultHeightCard = 80
                }else{
                    defaultHeightCard = 86
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
                for(var i = Math.min(...start_time_16);i<=Math.max(...end_time_16);i++){
                    widthLocation16 = widthLocation16 + 290
                    var timelineHtml16 = func.timelineTemplate.format(i+":00")
                    borderHtml16 = borderHtml16 + func.hourBorderTemplate.format()

                    timelineHtml16 = $.parseHTML(timelineHtml16);
                    $("#time_line_16").append(timelineHtml16)
                }
                for(var key  in events.eventOn15th){

                    var listCardEvent = "";
                    var listDetailEvent =""

                    var list_All_Duplicate = []
                    var list_duplicate_index = []
                    var is_found_index = false
                    for(var i in events.eventOn15th[key]){
                        var timeStart = moment.duration(events.eventOn15th[key][i].start).asHours();
                        var timeEnd = moment.duration(events.eventOn15th[key][i].end).asHours();
                        var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_15)))
                        var left =  between * 290
                        var list_15 = events.eventOn15th[key]






                        for(var k = parseInt(i)+1;k<list_15.length;k++){

                            if(timeEnd > moment.duration(list_15[k].start).asHours()){
                                if(list_All_Duplicate.length>0){
                                    list_All_Duplicate.push(list_15[k])
                                    list_duplicate_index.push(k)
                                }else{
                                    list_All_Duplicate.push(list_15[i])
                                    list_All_Duplicate.push(list_15[k])
                                    list_duplicate_index.push(i)
                                    list_duplicate_index.push(k)

                                }
                            }
                        }
                        is_found_index = false
                        for(var index in list_duplicate_index){
                            if(parseInt(i) === parseInt(list_duplicate_index[index])){
                                is_found_index=true
                                break
                            }
                        }
                        if(!is_found_index){
                            var html = func.cardEventMultipleTemplate.format(
                                left+"px",
                                duration+"px",
                                events.eventOn15th[key][i].start + " ~ " + events.eventOn15th[key][i].end,
                                events.eventOn15th[key][i].name,
                                "15"+count15
                            )
                            html = $.parseHTML(html)
                            $(html[1].getElementsByClassName('title')).addClass('line-limit')
                            if(duration<100) {
                                $(html[1].getElementsByClassName('title')).css({'font-size': 10,'-webkit-line-clamp':"4"})

                            }else{
                                $(html[1].getElementsByClassName('title')).css({'-webkit-line-clamp':"3"})
                            }

                            listCardEvent = listCardEvent + html[1].outerHTML

                            listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                                "15"+count15,
                                events.eventOn15th[key][i].start + " ~ " + events.eventOn15th[key][i].end,
                                events.eventOn15th[key][i].location,
                                events.eventOn15th[key][i].description,
                                events.eventOn15th[key][i].name
                            )

                            count15++
                        }




                    }


                    var List_world = {}
                    var list_level = []
                    for(var i in list_All_Duplicate){
                        var timeEnd = moment.duration(list_All_Duplicate[i].end).asHours();
                        List_world[i] =[]
                        if(parseInt(i) === 0){
                            list_level[i]= 0
                        }
                        for(var k = parseInt(i)+1;k<list_All_Duplicate.length;k++){

                            if(timeEnd > moment.duration(list_All_Duplicate[k].start).asHours()){
                                List_world[i].push(k)

                                if(list_level[i] === Math.min(...list_level)){
                                    list_level[k]=Math.min(...list_level)+1
                                }else{
                                    list_level[k]=Math.min(...list_level)
                                }
                            }

                        }


                    }
                    var list_height = []
                    for(var i in List_world){
                        list_height[i]=(defaultHeightCard/2)-1
                        for(var k in List_world[i]){
                            list_height[k] = list_height[List_world[i][k]]?(list_height[List_world[i][k]]/2)-1:(defaultHeightCard/2)-1
                        }

                    }
                    var list_final = []
                    for(var i in list_All_Duplicate){
                        list_final.push({'height':list_height[i],'level':list_level[i],'html':list_All_Duplicate[i]})



                        var timeStart = moment.duration(list_All_Duplicate[i].start).asHours();
                        var timeEnd = moment.duration(list_All_Duplicate[i].end).asHours();
                        var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_15)))
                        var left =  between * 290


                        var html = func.cardEventMultipleTemplate.format(
                            left+"px",
                            duration+"px",
                            list_All_Duplicate[i].start + " ~ " + list_All_Duplicate[i].end,
                            list_All_Duplicate[i].name,
                            "15"+count15
                        )
                        html = $.parseHTML(html)


                        if(duration<100) {
                            $(html[1].getElementsByClassName('title')).css({'font-size': 10,'-webkit-line-clamp':"4"})


                        }
                        $(html[1]).css({'height':list_height[i],'margin-top':(list_level[i]*list_height[i])+list_level[i]})

                        $(html[1].getElementsByClassName('time')).css({'margin-bottom':0})
                        $(html[1].getElementsByClassName('title')).css({'font-size':10,'line-height':"20px",'margin-top':0})

                        listCardEvent = listCardEvent + html[1].outerHTML
                        listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                            "15"+count15,
                            list_All_Duplicate[i].start + " ~ " + list_All_Duplicate[i].end,
                            list_All_Duplicate[i].location,
                            list_All_Duplicate[i].description,
                            list_All_Duplicate[i].name
                        )
                        count15++

                    }

                    $('#in_location_15').append(" <div class='event_in_location' style='display: inline-flex;margin-left: 1px' " +
                        "my_width='"+widthLocation15+"'>"
                        +listCardEvent+listDetailEvent+borderHtml15+"</div>")
                }
/*--------------------------------------------------------------*/
                for(var key in events.eventOn16th){
                    var listCardEvent = "";
                    var listDetailEvent =""

                    var list_All_Duplicate = []
                    var list_duplicate_index = []
                    var is_found_index = false
                    for(var i in events.eventOn16th[key]){
                        var timeStart = moment.duration(events.eventOn16th[key][i].start).asHours();
                        var timeEnd = moment.duration(events.eventOn16th[key][i].end).asHours();
                        var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_16)))
                        var left =  between * 290
                        var list_16 = events.eventOn16th[key]






                        for(var k = parseInt(i)+1;k<list_16.length;k++){

                            if(timeEnd > moment.duration(list_16[k].start).asHours()){
                                if(list_All_Duplicate.length>0){
                                    list_All_Duplicate.push(list_16[k])
                                    list_duplicate_index.push(k)
                                }else{
                                    list_All_Duplicate.push(list_16[i])
                                    list_All_Duplicate.push(list_16[k])
                                    list_duplicate_index.push(i)
                                    list_duplicate_index.push(k)
                                }
                            }
                        }
                        is_found_index = false
                        for(var m in list_duplicate_index){
                            if(parseInt(m) === list_duplicate_index[m]){
                                is_found_index = true
                                break;
                            }
                        }
                        if(!is_found_index){
                            var html = func.cardEventMultipleTemplate.format(
                                left+"px",
                                duration+"px",
                                events.eventOn16th[key][i].start + " ~ " + events.eventOn16th[key][i].end,
                                events.eventOn16th[key][i].name,
                                "16"+count16
                            )
                            html = $.parseHTML(html)
                            $(html[1].getElementsByClassName('title')).addClass('line-limit')
                            if(duration<100) {
                                $(html[1].getElementsByClassName('title')).css({'font-size': 10,'-webkit-line-clamp':"4"})


                            }else{
                                $(html[1].getElementsByClassName('title')).css({'-webkit-line-clamp':"3"})
                            }


                            listCardEvent = listCardEvent + html[1].outerHTML

                            listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                                "16"+count16,
                                events.eventOn16th[key][i].start + " ~ " + events.eventOn16th[key][i].end,
                                events.eventOn16th[key][i].location,
                                events.eventOn16th[key][i].description,
                                events.eventOn16th[key][i].name
                            )
                            count16++;
                        }





                    }


                    var List_world = {}
                    var list_level = []
                    for(var i in list_All_Duplicate){
                        var timeEnd = moment.duration(list_All_Duplicate[i].end).asHours();





                        List_world[i] =[]
                        if(parseInt(i) === 0){
                            list_level[i]= 0
                        }
                        for(var k = parseInt(i)+1;k<list_All_Duplicate.length;k++){

                            if(timeEnd > moment.duration(list_All_Duplicate[k].start).asHours()){
                                List_world[i].push(k)

                                if(list_level[i] === Math.min(...list_level)){
                                    list_level[k]=Math.min(...list_level)+1
                                }else{
                                    list_level[k]=Math.min(...list_level)
                                }
                            }

                        }

                    }
                    var list_height = []
                    for(var i in List_world){
                        list_height[i]=(defaultHeightCard/2)-1
                        for(var k in List_world[i]){
                            list_height[k] = list_height[List_world[i][k]]?(list_height[List_world[i][k]]/2)-1:(defaultHeightCard/2)-1
                        }

                    }
                    var list_final = []
                    for(var i in list_All_Duplicate){
                        list_final.push({'height':list_height[i],'level':list_level[i],'html':list_All_Duplicate[i]})



                        var timeStart = moment.duration(list_All_Duplicate[i].start).asHours();
                        var timeEnd = moment.duration(list_All_Duplicate[i].end).asHours();
                        var duration = (parseFloat(timeEnd - timeStart) * 290) -1
                        var between = parseFloat(timeStart - parseInt(Math.min(...start_time_15)))
                        var left =  between * 290


                        var html = func.cardEventMultipleTemplate.format(
                            left+"px",
                            duration+"px",
                            list_All_Duplicate[i].start + " ~ " + list_All_Duplicate[i].end,
                            list_All_Duplicate[i].name,
                            "16"+count16
                        )
                        html = $.parseHTML(html)


                        if(duration<100) {
                            $(html[1].getElementsByClassName('title')).css({'font-size': 10,'-webkit-line-clamp':"4"})
                            $(html[1].getElementsByClassName('title')).addClass('line-limit')

                        }
                        $(html[1]).css({'height':list_height[i],'margin-top':(list_level[i]*list_height[i])+list_level[i]})

                        $(html[1].getElementsByClassName('time')).css({'margin-bottom':0})
                        $(html[1].getElementsByClassName('title')).css({'font-size':10,'line-height':"20px",'margin-top':0})

                        listCardEvent = listCardEvent + html[1].outerHTML

                        listDetailEvent = listDetailEvent + func.detailEventTemplate.format(
                            "16"+count16,
                            list_All_Duplicate[i].start + " ~ " + list_All_Duplicate[i].end,
                            list_All_Duplicate[i].location,
                            list_All_Duplicate[i].description,
                            list_All_Duplicate[i].name
                        )
                        count16++

                    }




                    $('#in_location_16').append(" <div class='event_in_location' style='display: inline-flex;margin-left: 1px' " +
                        "my_width='"+widthLocation16+"'>"
                        +listCardEvent+listDetailEvent+borderHtml16+"</div>")
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    }


    func.sortLocation = function(a,b) {


        if (func.cleanString(a.location) < func.cleanString(b.location))
            return -1;
        if (func.cleanString(a.location) > func.cleanString(b.location))
            return 1;
        return 0;
    }

    func.compare = function(a,b) {
        if (a.start + a.end < b.start+b.end)
            return -1;
        if (a.start+a.end > b.start+b.end)
            return 1;
        return 0;
    }

    func.sortDate = function(event){
        for(var i in event){
            event[i].sort(func.compare);
        }
        return event
    }
    func.cleanString = function(location){
        var clean =location.replace("【","")
        clean = clean.replace("】","")

        clean = clean.replace(new RegExp('0','g'),String.fromCharCode(65296))
        clean = clean.replace(new RegExp('1','g'),String.fromCharCode(65297))
        clean = clean.replace(new RegExp('2','g'),String.fromCharCode(65298))
        clean = clean.replace(new RegExp('3','g'),String.fromCharCode(65299))
        clean = clean.replace(new RegExp('4','g'),String.fromCharCode(65300))
        clean = clean.replace(new RegExp('5','g'),String.fromCharCode(65301))
        clean = clean.replace(new RegExp('6','g'),String.fromCharCode(65302))
        clean = clean.replace(new RegExp('7','g'),String.fromCharCode(65303))
        clean = clean.replace(new RegExp('8','g'),String.fromCharCode(65304))
        clean = clean.replace(new RegExp('9','g'),String.fromCharCode(65305))

        return clean;
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
    <div class='half time_mat' style='width:144px;background-color: white'></div>
    <div class='hour time_mat' style='width:144px;background-color: white'></div>
    
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
    <div class='event_box' title="{3}" style='left:{0}; width:{1};' event_id='even_id_is_{4}' onClick='VisionEventRegist.func.OpenDetail(this);'>
        <p class='event_detail cat_color' style='background-color:#9b59b6'></p>
        <div class="divider_card">
            <p class='event_detail time' style="white-space: nowrap">{2}</p>
            <p class='event_detail title title_card' style="width: {1};">{3}</p>
        </div>
        
    </div>
    `


    func.detailEventTemplate = `
    <div event_id='even_id_is_{0}' class='event_detail_mask' onClick='VisionEventRegist.func.CloseDetail(this);'></div>
    <div event_id='even_id_is_{0}' style="height: 450px;text-align: left;padding: 0 20px" class='event_detail_box'>
	<p class='event_detail cat_color' style='background-color:#9b59b6;margin: 0 -20px'></p>
	 <p><i class="fas fa-times close-icon" event_id='even_id_is_{0}' onClick='VisionEventRegist.func.CloseDetail(this);'></i></p>
	<p class='event_detail time' style="width: 100%;text-align: center"><i class="fas fa-clock" style="padding-right: 5px;"> </i>{1}</p>
	<p class='event_detail location' style="text-align: center;width: 100%"><i class="fas fa-map-marker-alt" style="padding-right: 5px"></i>{2}</p>
	<p class='event_detail title' style="text-align: center;width: 100%">{4}</p>
	<p class='event_detail description' style="text-align: left;">{3}</p>
</div>
    `



})(jQuery);

$(document).ready(function() {
    console.log(document.getElementsByClassName('container'))

    MIRAI.main.fetchEventsData('https://api.eventregist.com/v/2/timetable/get?event_uid=3b75c6deb1a72cf894781a8c5e4f0e64');
    $( '.show_tooltip' ).tooltip({
        position: {
            my: "center bottom",
            at: "center top-10",
            collision: "flip",
            using: function( position, feedback ) {
                $( this ).addClass( feedback.vertical )
                    .css( position );
            }
        }
    });


});
