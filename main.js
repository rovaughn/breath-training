
function print_remaining(s) {
    var min = (s/60)|0;
    var sec = s % 60;

    if (sec < 10) {
        sec = '0' + sec;
    }

    return min + ':' + sec;
}

function start(n_rounds, points) {
    var start_elem = document.getElementById('start');
    var timer_elem = document.getElementById('timer');
    start_elem.style.display = 'none';
    timer_elem.style.display = 'block';
    var c = document.getElementById('canvas');
    var ctx = c.getContext('2d');
    var beginTime = +new Date();

    function pie(start, end) {
        start = 2*Math.PI*(start - 0.25);
        end = 2*Math.PI*(end - 0.25);
    }

    var timer_elem = document.getElementById('timer');
    var round_length = 0;
    var need_refresh = true;
    var commandElem = document.getElementById('command');
    var remaining_elem = document.getElementById('remaining');
    var commandText = commandElem.innerText;

    for (var i = 0; i < points.length; i++) {
        round_length += points[i].length;
    }

    var total_time = round_length * n_rounds;
    var last_remaining = total_time;

    remaining_elem.innerText = print_remaining(last_remaining);

    function paint() {
        var elapsed = (+new Date() - beginTime)/1000;
        var position = elapsed % round_length;
        var remaining = (total_time - elapsed)|0;

        if (remaining <= 0) {
            clearInterval(timer);
            timer_elem.style.display = 'none';
            start_elem.style.display = 'block';
            return;
        }

        if (remaining !== last_remaining) {
            remaining_elem.innerText = print_remaining(last_remaining = remaining);
        }

        var start = 0;
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var next_point = points[(i + 1)%points.length];
            var end = start + point.length;

            if (position > start && position <= end) {
                if (point.name !== commandText) {
                    commandElem.innerText = commandText = point.name;
                }

                var breath = point.breath + (next_point.breath - point.breath) * (position - start) / (end - start);

                ctx.fillStyle = point.color;
                ctx.beginPath();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.arc(100, 100, 100*breath, 0, 2*Math.PI);
                ctx.fill();
            }

            start = end;
        }
    }

    var timer = setInterval(requestAnimationFrame.bind(null, paint), 1000/47);
}

document.getElementById('start-btn').onclick = function() {
    start(32, [
        {name: 'Inhale', length: 3, breath: 0, color: 'black'},
        {name: 'Exhale', length: 9, breath: 1, color: 'black'},
    ]);
}

