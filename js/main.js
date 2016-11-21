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
          
          $('.nodes').append("<li><span>"+key+"</span></li>");
          $('.duration').append("<li><div data-percentage='"+nodes[key].startTime/10+"' class='bar'>"+startTime+"</div><div data-percentage='"+nodes[key].duration/10+"' class='bar' style='background-color:"+nodes[key].bgcolor+"'>"+content+"</div></li>"); 
        }
      }


      //animate the data
      function animate(){
        $('.bar').css('width','0px');
        $(".duration .bar").delay(700).each(function(i){
          var percentage = $(this).data('percentage');
          $(this).delay(i+"00").animate({'width': percentage + '%'}, 700);
         
        });
      }
    }); 
});  