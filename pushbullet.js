(function(ext) {
    ext._API = "https://api.pushbullet.com/v2";
    ext._devices = [];
    ext._ready = false;

    window['temp'] = 0; // init

    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };

    ext.setAccessToken = function(token, callback) {
      ext._token = token;
      $.ajax({
        type: "GET",
        url: ext._API+"/devices",
        headers: {
          "Authorization": "Bearer " + token
        },
        context: {
          callback: callback
        }
      }).done(function(msg) {
        ext._devices = msg.devices;
        ext.ready = true;
        this.callback();
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

    ext.getDeviceLength = function() {
      if(ext._devices)
        return ext._devices.length;
      else
        return 0;
    };

    ext.isReady = function() {
      return ext._ready
    };

    ext.push = function(title, msg, device, var_args) {
      var data = {
        type: "note",
        title: title,
        body: msg,
        device_iden: device
      };
      var callback = arguments[3];

      $.ajax({
        type: "POST",
        url: ext._API+"/pushes",
        dataType: "json",
        headers: {
          "Authorization": "Bearer " + ext._token,
          "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        context: {
          callback: callback
        }
      }).done(function(msg) {
        console.log(msg);
      }).always(function(msg) {
        if(this.callback) {
          this.callback();
        }
      });
    };

    // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['w', 'set access token as %s', 'setAccessToken'],
            [' ', 'send push message:%s title:%s to %s', 'push', 'Hello!', 'Message from Scratch', 'device_id'],
            ['w', 'send push message:%s title:%s to %s and wait', 'push', 'Hello!', 'Message from Scratch', 'device_id'],
            ['r', 'name of device %n', 'getDeviceName', '0'],
            ['r', 'id of device %n', 'getDeviceId', '0'],
            ['r', 'number of device', 'getDevice'],
            ['r', 'ready', 'isReady']
        ],
        url: 'http://makerbox.net/scratchx-pushbullet'
    };

    // Register the extension
    ScratchExtensions.register('PushBullet', descriptor, ext);
})({});
