// RNM_Arac_Paketi.js

(function(ext) {
    var device = null;

	ext.resetAll = function(){};

	ext.runArduino = function(){
        responseValue();
	};


    ext.setHareketYonu = function(){}
    ext.stopBot = function(){}
    ext.initializeHareketPinleri = function(){}



    // Extension API interactions
    var potentialDevices = [];
    ext._deviceConnected = function(dev) {
        potentialDevices.push(dev);

        if (!device) {
            tryNextDevice();
        }
    }

    function tryNextDevice() {
        // If potentialDevices is empty, device will be undefined.
        // That will get us back here next time a device is connected.
        device = potentialDevices.shift();
        if (device) {
            device.open({ stopBits: 0, bitRate: 115200, ctsFlowControl: 0 }, deviceOpened);
        }
    }

    function deviceOpened(dev) {
        if (!dev) {
            // Opening the port failed.
            tryNextDevice();
            return;
        }
        device.set_receive_handler('RNM_Arac_Paketi',function(data) {
            processData(data);
        });
    };

    ext._deviceRemoved = function(dev) {
        if(device != dev) return;
        device = null;
    };

    ext._shutdown = function() {
        if(device) device.close();
        device = null;
    };

    ext._getStatus = function() {
        if(!device) return {status: 1, msg: 'RNM_Arac_Paketi disconnected'};
        return {status: 2, msg: 'RNM_Arac_Paketi connected'};
    }

    var descriptor = {};
	ScratchExtensions.register('RNM_Arac_Paketi', descriptor, ext, {type: 'serial'});
})({});
