(function(ext) {
    ext._API = "https://api.pushbullet.com/v2";
    ext._devices = [];
    ext._is_ready = false;

    window['temp'] = 0; // init

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.setAccessToken = function(token) {
      ext._token = token;
      $.ajax({
        type: "GET",
        url: ext._API+"/devices",
        headers: {
          "Authorization": "Bearer " + token
        }
      }).done(function(msg) {
        ext._devices = msg.devices;
      });
    };

    ext.getDeviceName = function(num) {
      if(ext._devices.length > num)
        return ext._devices[num].nickname;
      else
        return null;
    };

    ext.getDeviceId = function(num) {
      if(ext._devices.length > num)
        return ext._devices[num].iden;
      else
        return null;
    };

    ext.push = function(title, msg, device) {
      var data = {
        type: "note",
        title: title,
        body: msg,
        device_iden: device
      };

      $.ajax({
        type: "POST",
        url: ext._API+"/pushes",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + ext._token,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(data)
      }).done(function(msg) {
        console.log(msg);
      });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            [' ', 'set access token as %s', 'setAccessToken'],
            ['w', 'send push message:%s title:%s to %s', 'push', 'Hello!', 'Message from Scratch', 'device_id'],
            [' ', 'send push message %s to %s and wait', 'pushAndWait', 'Hello!', 'device_id'],
            ['r', 'name of device %n', 'getDeviceName'],
            ['r', 'id of device %n', 'getDeviceId'],
            ['r', 'ready', 'isReady']
        ],
        url: 'http://makerbox.net/scratchx-pushbullet'
    };


    // Register the extension
    ScratchExtensions.register('PushBullet', descriptor, ext);
})({});
