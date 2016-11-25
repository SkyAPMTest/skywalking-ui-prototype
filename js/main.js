$(document).ready(function() {  
    $(function() {
        var nodes = [];
        $.ajax({    
            type:"GET",   
            url:"../templates/index.json",   
            dataType: "json",  
            success: function(data){ 
                $.each(data,function(i,item){  
                    nodes[i] = data[i];
                    nodes[i].startTime = item.startTime;
                    nodes[i].duration = item.duration;
                    nodes[i].content = item.operationName;
                    nodes[i].bgcolor = item.bgcolor;
                    nodes[i].levelId = item.levelId;
                    nodes[i].parentLevelId = item.parentLevelId;
                })
                displayData(nodes);
                animate();
                drawAxis();
                barHover();
                $(".tick:last-child text").attr("x","-10");
                /*计算chart高度*/
                var chartHeight = ($(".chart li").height()+2*parseInt($(".chart li").css("padding-top")))*(nodes.length);
                $(".chart").css("height",chartHeight);
            } 
             
        }) 
        //list of nodes
        
        
        var margin = {top: 10, right: 10, bottom: 10, left: 10};
        console.log(margin);
        var width = $(window).width() - margin.left - margin.right; 
        var height = 50; 
        var dataset = [];


        function drawAxis(){
            for (var key in nodes){
                var startTime = nodes[key].startTime,
                    duration = nodes[key].duration;
                dataset.push(startTime+duration);
                console.log(dataset);
                console.log(nodes);
            }
            var svg = d3.select(".footer").append("svg")  
                                .attr("width",width)  
                                .attr("height",height);  
          
            var xScale = d3.scale.linear()  
                                .domain([0,d3.max(dataset)])  
                                .range([0,width]);  
                                  
            var axis = d3.svg.axis() //新建一个坐标轴 
                        .scale(xScale) //量度  
                        .orient("top");  //横坐标的刻度标注位于轴上方
                              
            svg.append("g")  
                .attr("class","axis")  
                .attr("transform","translate(0,30)")  
                .call(axis);
            
        }
        
        //draw axis


        //display data
        function displayData(nodes){
            $('.duration').html('');
            $('.nodes').html('');
            for (var key in nodes){
                var startTime = nodes[key].startTime,
                    duration = nodes[key].duration,
                    content = nodes[key].content,
                    bgcolor = nodes[key].bgcolor,
                    id = nodes[key].id;


                $('.duration').append("<li><div data-percentage='"
                                    +startTime/10
                                    +"' class='bar'>"
                                    +startTime
                                    +"</div><div data-percentage='"
                                    +duration/10
                                    +"' class='bar' id = '"
                                    +id
                                    +"' style='background-color:"
                                    +bgcolor
                                    +"'><span>"
                                    +content
                                    +"</span></div></li>"); 
                // var spanWidth = $(".duration #"+id+" span").width();
                // $(".duration #"+id+" span").css("margin-left",-spanWidth/2);
            }
            
        } 


        //animate the data
        function animate(){
            $('.bar').css('width','0px');
            $(".duration .bar").delay(1000).each(function(i){
                var percentage = $(this).data('percentage');
                $(this).delay(i+"00").animate({'width': percentage + '%'}, 700); 
            });
            $(".duration .bar span").css('opacity','0');
            $(".duration .bar span").delay(1000).each(function(i){
                $(this).delay((i+5)*100).animate({'opacity': '1'}, 500); 
            });
        }

        //highlight all the parents when hover
        function barHover(){
            $(".chart .duration .bar:nth-child(even)").mouseenter(function(){ 
                var arr =[];  
                //找到悬停的节点及其所有父节点函数          
                function traceParents(nodesid){ 
                    if(nodes[nodesid].parentLevelId == -1){
                        arr.push(nodesid);
                        //console.log("arrlength="+arr.length);
                        var arrlength = arr.length;
                        return;
                    }
                    else{
                        
                        for (var j = 0;j < nodes.length;j++){
                            if (nodes[j].levelId == nodes[nodesid].parentLevelId) {
                                arr.push(nodesid);
                                traceParents(j);
                            }
                        }
                    }
                    
                }

                //获得当前悬停节点的位置
                var nodesid = $(this).attr("id").replace(/[^0-9]/ig,""); 
                traceParents(nodesid);
                //console.log("id="+nodesid);
                
                //讲json数据节点数组与当前悬停节点及其父节点数组求差，即得到所有透明度降低的节点数组
                var nodesids = [];
                for (var i=0;i<nodes.length;i++){
                    nodesids[i] = i;
                }
                var result = [];
                var tmp = nodesids.concat(arr);
                var o = {};
                for (var i = 0; i < tmp.length; i ++) {
                    (tmp[i] in o) ? o[tmp[i]] ++ : o[tmp[i]] = 1;
                }
                for (x in o) if (o[x] == 1) {
                    result.push(x);
                }
                //console.log(result);

                for (var k=0;k<result.length;k++){
                    $("#nodes"+result[k]).css("opacity",0.1);    
                } 

                
            }).mouseleave(function(){
                $(".chart .duration .bar:nth-child(even)").css("opacity",1);
            });
        }
        $(window).resize();
    }); 
});  