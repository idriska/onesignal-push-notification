export default function(action) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${process.env.REST_API_KEY}`
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require("https");
        var req = https.request(options, function(res) {
        res.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    var sendNotification = function(data) {
        req.on("error", function(e) {
            console.log("ERROR:");
            console.log(e);
        });

        req.write(JSON.stringify(data));
        req.end();
    };

    // SEND NOTIFICATION TO ALL USERS
    if(action.current.segment){
        var message = {
            app_id: process.env.APP_ID,
            contents: { en: action.current.body },
            headings: { en: action.current.title },
            big_picture: action.current.big_picture,
            large_icon: action.current.large_icon,
            url: action.current.url,
            included_segments: [action.current.segment.toLowerCase() === 'all' ? 
                action.current.segment.charAt(0).toUpperCase() + action.current.segment.slice(1) : 
                action.current.segment]
        };
    }

    // SEND NOTIFICATIONS TO SELECTED USERS
    if(action.current.player_id){
        var message = {
           app_id: process.env.APP_ID,
            contents: { en: action.current.body },
            headings: { en: action.current.title },
            big_picture: action.current.big_picture,
            large_icon: action.current.large_icon,
            url: action.current.url,
            android_sound: 'default',
            include_player_ids: [action.current.player_id]
        };
    }
    sendNotification(message);
    return true
}
