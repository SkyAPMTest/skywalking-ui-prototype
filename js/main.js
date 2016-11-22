$(document).ready(function() {  
    $(function() {
        var nodes = [];
        $.ajax({    
            type:"GET",   
            url:"index.json",   
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
            } 
             
        }) 
        //list of nodes
        
      

        //display data
        function displayData(nodes){
            $('.duration').html('');
            $('.nodes').html('');
            for (var key in nodes){
              var startTime = nodes[key].startTime,
                  duration = nodes[key].duration,
                  content = nodes[key].content,
                  bgcolor = nodes[key].bgcolor;
                  id = nodes[key].id;
              
              $('.nodes').append("<li><span>"+key+"</span></li>");
              $('.duration').append("<li><div data-percentage='"+nodes[key].startTime/10+"' class='bar'>"+startTime+"</div><div data-percentage='"+nodes[key].duration/10+"' class='bar' id = '"+nodes[key].id+"' style='background-color:"+nodes[key].bgcolor+"'>"+content+"</div></li>"); 
            }
        }

        // draw connection line
        //正负号函数 
        function signum(x) {
            return (x < 0) ? -1 : 1;
        }
        //绝对值函数
        function absolute(x) {
            return (x < 0) ? -x : x;
        }
        function drawPath(svg, path, startX, startY, endX, endY) {
            // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
            var stroke =  parseFloat(path.css("stroke-width"));
            // check if the svg is big enough to draw the path, if not, set heigh/width
            if (svg.attr("height") <  endY)                 svg.attr("height", endY);
            if (svg.attr("width" ) < (startX + stroke) )    svg.attr("width", (startX + stroke));
            if (svg.attr("width" ) < (endX   + stroke) )    svg.attr("width", (endX   + stroke));
            
            var deltaX = (endX - startX) * 0.15;
            var deltaY = (endY - startY) * 0.15;
            // for further calculations which ever is the shortest distance
            var delta  =  deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

            // set sweep-flag (counter/clock-wise)
            // if start element is closer to the left edge,
            // draw the first arc counter-clockwise, and the second one clock-wise
            var arc1 = 0; var arc2 = 1;
            if (startX > endX) {
                arc1 = 1;
                arc2 = 0;
            }
            // draw tha pipe-like path
            // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end 
            path.attr("d",  "M"  + startX + " " + startY +
                            " V" + (startY + delta) +
                            " A" + delta + " " +  delta + " 0 0 " + arc1 + " " + (startX + delta*signum(deltaX)) + " " + (startY + 2*delta) +
                            " H" + (endX - delta*signum(deltaX)) + 
                            " A" + delta + " " +  delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3*delta) +
                            " V" + endY );
        }

        function connectElements(svg, path, startElem, endElem) {
            var svgContainer= $("#svgContainer");

            // if first element is lower than the second, swap
            if(startElem.offset().top > endElem.offset().top){
                var temp = startElem;
                startElem = endElem;
                endElem = temp;
            }

            // get (top, left) corner coordinates of the svg container   
            var svgTop  = svgContainer.offset().top;
            var svgLeft = svgContainer.offset().left;

            // get (top, left) coordinates for the two elements
            var startCoord = startElem.offset();
            var endCoord   = endElem.offset();

            // calculate path's start (x,y)  coords
            // we want the x coordinate to visually result in the element's mid point
            var startX = startCoord.left + 0.5*startElem.outerWidth() - svgLeft;    // x = left offset + 0.5*width - svg's left offset
            var startY = startCoord.top  + startElem.outerHeight() - svgTop;        // y = top offset + height - svg's top offset

            // calculate path's end (x,y) coords
            var endX = endCoord.left + 0.5*endElem.outerWidth() - svgLeft;
            var endY = endCoord.top  - svgTop;

            // call function for drawing the path
            drawPath(svg, path, startX, startY, endX, endY);
        }
        function resetSVGsize(){
          $("#svg1").attr("height", "0");
          $("#svg1").attr("width", "0"); 
        }


        function connectAll() {
            // connect the paths you want
            for ( var i = 0;i < nodes.length;i++){
                if (nodes[i].parentLevelId > -1) {
                    for (var j = 1;j < nodes.length;j++){
                        if (nodes[j].parentLevelId == nodes[i].levelId) {
                            startElem = nodes[i].id;
                            endElem = nodes[j].id;
                            console.log(nodes[i].id);
                            $('#svg1').append('<path id="'+nodes[j].id+'"/>');
                            connectElements($("#svg1"), $('#'+nodes[i].id), $('#'+startElem), $('#'+endElem) );
                        }
                        if(nodes[j].levelId == nodes[i].parentLevelId){
                            startElem = nodes[j].id;
                            endElem = nodes[i].id;
                            $('#svg1').append('<path id="'+nodes[i].id+'"/>');
                            connectElements($("#svg1"), $('#'+nodes[i].id), $('#'+startElem), $('#'+endElem) );
                        }
                    }
                };
            }
        }



        //animate the data
        function animate(){
            $('.bar').css('width','0px');
            $(".duration .bar").delay(1000).each(function(i){
                var percentage = $(this).data('percentage');
                $(this).delay(i+"00").animate({'width': percentage + '%'}, 700); 
            });
            resetSVGsize();
            connectAll();
        }
    }); 
});  