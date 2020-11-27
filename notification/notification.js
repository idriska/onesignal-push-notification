export default function(changes) {

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
    if(changes.document.segment){
        var message = {
            app_id: process.env.APP_ID,
            contents: { en: changes.document.body },
            headings: { en: changes.document.title },
            url: changes.document.url,
            included_segments: [changes.document.segment]
        };
    }

    // SEND NOTIFICATIONS TO SELECTED USERS
    if(changes.document.player_id){
        var message = {
           app_id: process.env.APP_ID,
            contents: { en: changes.document.body },
            headings: { en: changes.document.title },
            url: changes.document.url,
            include_player_ids: [changes.document.player_id]
        };
    }
    
    sendNotification(message);
}
