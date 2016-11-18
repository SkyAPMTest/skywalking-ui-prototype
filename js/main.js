$(document).ready(function(){
  $(function() {
    //list of nodes
    var nodes = {
      "node1":{startTime:0,duration:100,bgcolor:"#f7ae50",content:"client transaction from start to end"},
      "node2":{startTime:10,duration:90,bgcolor:"#4caaf2",content:"load balancer transaction from start to end"},
      "node3":{startTime:15,duration:20,bgcolor:"#eb5c3a",content:"authorization"},
      "node4":{startTime:35,duration:25,bgcolor:"#35b376",content:"billing"},
      "node5":{startTime:60,duration:40,bgcolor:"#b3b3b3",content:"resource allocation and provisioning"},
      "node6":{startTime:65,duration:25,bgcolor:"#b3b3b3",content:"container start-up"},
      "node7":{startTime:65,duration:25,bgcolor:"#b3b3b3",content:"stoage allocation"},
      "node8":{startTime:85,duration:15,bgcolor:"#b3b3b3",content:"start-up scripts"},
    };
    displayData(nodes);
    animate();

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
        $('.duration').append("<li><div data-percentage='"+nodes[key].startTime+"' class='bar'>"+startTime+"</div><div data-percentage='"+nodes[key].duration+"' class='bar' style='background-color:"+nodes[key].bgcolor+"'>"+content+"</div></li>"); 
        // $('.chart .duration .bar').css("background-color", bgcolor);
      }
    }


    //animate the data
    function animate(){
      $('.bar').css('width','0px');
      $(".duration .bar").delay(1000).each(function(i){
        var percentage = $(this).data('percentage');
        $(this).delay(i+"00").animate({'width': percentage + '%'}, 700);
       
      });
    }

    
  });
});
