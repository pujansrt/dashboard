LRUCache = (function () {
    function LRUCache(capacity) {
        this._items = [];
        this._capacity = capacity;
    }

    LRUCache.prototype = {
        add: function (value) {
            if (this._items.length >= this._capacity)
                this.removeOldest();
            this._items.push(value);
        },
        removeOldest: function () {
            this._items.shift();
        },
        getItems: function () {
            return this._items;
        },
        remove: function (key) {
            this._items.splice(this._items.indexOf(key), 1);
            delete this._items[key];
        },
        getCapacity: function () {
            return this._capacity;
        },
        getSize: function () {
            return this._items.length;
        }
    }

    return LRUCache;
}());

Loading = function () {
    this.on = () => {
        $('#loader').show();
        $('.row').css({'opacity': '0.5'});
    }

    this.off = () => {
        $('#loader').hide();
        $('.row').css({'opacity': '1'});
    }

    this.toggle = () => {
        $('#loader').toggle();
        $('.row').toggle();
    }

    this.knob = () => {
        $('.knob').each((index, ele) => {
            const colorNum = Math.round(Number($(ele).val()) / 10) * 10;
            $(ele).trigger('configure', {'fgColor': colors[colorNum]});
            $(ele).attr('data-fgColor', colors[colorNum]).trigger('change');
        });
    }

    this.connected = () => {
        $('.status').css('color', 'limegreen');
    }

    this.disconnected = () => {
        $('.status').css('color', '#dd4b39');
    }
}

var loading = new Loading();

let graphsize = 100;

let memlru = new LRUCache(graphsize);
let cpulru = new LRUCache(graphsize);
let disklru = new LRUCache(graphsize);
const sparkleConfig = {type: 'line',height: '30'};

(function () {
    knobs();
    $.fn.sparkline.defaults.common.chartRangeMin = 0;
    $.fn.sparkline.defaults.common.chartRangeMax = 100;


    $('.memlru').sparkline(memlru.getItems(), sparkleConfig);
    $('.cpulru').sparkline(cpulru.getItems(), sparkleConfig);
    $('.disklru').sparkline(disklru.getItems(), sparkleConfig);
})();

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}

var colors = {
    0: '#419873',
    10: '#49ab81',
    20: '#52bf90',
    30: '#6fcb9f',
    40: '#eedc31',
    50: '#ffa700',
    60: '#ff8b94',
    70: '#f37735',
    80: '#ff6f69',
    90: '#d9534f',
    100: '#d11141'
};


function knobs() {
    $(".knob").knob({
        draw: function () {
            if (this.$.data('skin') == 'tron') {
                this.cursorExt = 0.3;
                var a = this.arc(this.cv)  // Arc
                    , pa                   // Previous arc
                    , r = 1;

                this.g.lineWidth = this.lineWidth;
                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();

                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });

    // Example of infinite knob, iPod click wheel
    var v, up = 0, down = 0, i = 0
        , $idir = $("div.idir")
        , $ival = $("div.ival")
        , incr = function () {
        i++;
        $idir.show().html("+").fadeOut();
        $ival.html(i);
    }
        , decr = function () {
        i--;
        $idir.show().html("-").fadeOut();
        $ival.html(i);
    };
    $("input.infinite").knob(
        {
            min: 0,
            max: 20,
            stopper: false,
            bgColor: 'rgba(255,255,255,1)',
            change: function () {
                if (v > this.cv) {
                    if (up) {
                        decr();
                        up = 0;
                    } else {
                        up = 1;
                        down = 0;
                    }
                } else {
                    if (v < this.cv) {
                        if (down) {
                            incr();
                            down = 0;
                        } else {
                            down = 1;
                            up = 0;
                        }
                    }
                }
                v = this.cv;
            }
        });
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}