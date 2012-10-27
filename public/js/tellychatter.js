
$(document).ready(function() {
  $('body').css('overflow', 'auto');
  
  var now = parseInt(new Date().getTime() / 1000, 10),
    //url = "http://uk.zeebox.com/tms/schedules.json?provider=1&region=1&now=" + now + "&when=prevnownext&min-fresh=60&hd=true&view=compact&tvc=uk";
    //proxyUrl = "" + encodeURIComponent(url) + "&callback=?";
    proxyUrl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Fuk.zeebox.com%2Ftms%2Fschedules.json%3Fprovider%3D1%26region%3D1%26now%3D" + now + "%26when%3Dprevnownext%26min-fresh%3D60%26hd%3Dtrue%26view%3Dcompact%26tvc%3Duk%22&format=json&callback=?";

  console.log(now);

  $("#channels li").live("click", function(event) {
    var $r = $(this);

    $.post("/room/" + $r.data("id"), {
        "programAttributes[id]": $r.data("id"),
        "programAttributes[title]": $r.data("title"),
        "programAttributes[channelName]": $r.data("channelname"),
        "programAttributes[channelLogo]": $r.data("channellogo"),
        "programAttributes[programLogo]": $r.data("programlogo")
      }, function(response) {
        window.location = response.redirect;
    });
  });

  $.getJSON(proxyUrl, function(data) {
    var response = data.query.results.json;
    var $channels = $("#channels");

    for( var i = 0; i < response.channels.length; i++ ) {
      var channel = response.channels[i],
        imgsrc = channel.service.logo.replace(/\{width\}/, "100").replace(/\{height\}/, "100"),
        broadcast = channel.channelbroadcasts[1],
        broadcastsrc = broadcast.image.replace(/\{width\}/, "100").replace(/\{height\}/, "100");

      var channelImg = '<img src="' + imgsrc + '">',
        broadcastImg = '<img src="' + broadcastsrc + '">';

      console.log(broadcast);
      
      broadcast.start_time = parseInt(broadcast.start_time);
      broadcast.end_time = parseInt(broadcast.end_time);

      console.log(broadcast.start_time);

      var startTime = new Date(broadcast.start_time),
        endTime = new Date(broadcast.end_time);
        
        console.log(startTime);
        
        //startTime = broadcast.start_time;
        timeStr = (startTime.getHours() < 10 ? "0" : "") + startTime.getHours() + ":" + (startTime.getMinutes() < 10 ? "0" : "") + startTime.getMinutes() + " - " + (endTime.getHours() < 10 ? "0" : "") + endTime.getHours() + ":" + (endTime.getMinutes() < 10 ? "0" : "") + endTime.getMinutes();

      $channels.append('<li data-title="' + escape(broadcast.title) + '" data-chan="' + channel.logical_channel_number + '" data-id="' + broadcast.id + '" data-channelname="' + escape(channel.service.name) + '" data-channellogo="' + imgsrc + '" data-programlogo="' + broadcastsrc + '">' + channelImg + broadcastImg + '<span>' + broadcast.title + '<span class="time">' + timeStr + '</span>' + '</span></li>');
    }
  });
});

