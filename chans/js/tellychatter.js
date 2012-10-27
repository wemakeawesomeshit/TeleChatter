
$(document).ready(function() {
  var now = parseInt(new Date().getTime() / 1000, 10),
    url = "http://uk.zeebox.com/tms/schedules.json?provider=1&region=1&now=" + now + "&when=prevnownext&min-fresh=60&hd=true&view=compact&tvc=uk";
    proxyUrl = "proxy.php?url=" + encodeURIComponent(url);

  console.log(url);

  $("#channels li").live("click", function(event) {
    var $r = $(this);

    $.post("/room/" + $r.data("id"), {
        "programAttributes[id]": $r.data("id"),
        "programAttributes[title]": $r.data("title"),
        "programAttributes[channelName]": $r.data("channelname"),
        "programAttributes[channelLogo]": $r.data("channellogo"),
        "programAttributes[programLogo]": $r.data("programlogo")
      }, function(response) {
    });
  });

  $.ajax({
    url: proxyUrl,
    dataType: "json",
    success: function(response) {
      var $channels = $("#channels");

      for( var i = 0; i < response.channels.length; i++ ) {
        var channel = response.channels[i],
          imgsrc = channel.service.logo.replace(/\{width\}/, "100").replace(/\{height\}/, "100"),
          broadcast = channel.channelbroadcasts[1],
          broadcastsrc = broadcast.image.replace(/\{width\}/, "100").replace(/\{height\}/, "100");

        var channelImg = '<img src="' + imgsrc + '">',
          broadcastImg = '<img src="' + broadcastsrc + '">';

        var startTime = new Date(broadcast.start_time),
          endTime = new Date(broadcast.end_time),
          timeStr = (startTime.getHours() < 10 ? "0" : "") + startTime.getHours() + ":" + (startTime.getMinutes() < 10 ? "0" : "") + startTime.getMinutes() + " - " + (endTime.getHours() < 10 ? "0" : "") + endTime.getHours() + ":" + (endTime.getMinutes() < 10 ? "0" : "") + endTime.getMinutes();

        $channels.append('<li data-title="' + escape(broadcast.title) + '" data-chan="' + channel.logical_channel_number + '" data-id="' + broadcast.id + '" data-channelname="' + escape(channel.service.name) + '" data-channellogo="' + imgsrc + '" data-programlogo="' + broadcastsrc + '">' + channelImg + broadcastImg + '<span>' + broadcast.title + '<span class="time">' + timeStr + '</span>' + '</span></li>');
      }
    }
  });
});

