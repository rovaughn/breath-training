
function print_remaining(s) {
    var min = (s/60)|0;
    var sec = s % 60;

    if (sec < 10) {
        sec = '0' + sec;
    }

    return min + ':' + sec;
}

function start(n_rounds, sections) {
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

        ctx.moveTo(100, 100);
        ctx.arc(100, 100, 100, start, end);
        ctx.moveTo(100, 100);
    }

    var timer_elem = document.getElementById('timer');
    var last_position = 0;
    var round_length = 0;
    var need_refresh = true;
    var commandElem = document.getElementById('command');
    var remaining_elem = document.getElementById('remaining');
    var commandText = commandElem.innerText;

    for (var i = 0; i < sections.length; i++) {
        round_length += sections[i].length;
    }

    var total_time = round_length * n_rounds;
    var last_remaining = total_time;

    remaining_elem.innerText = print_remaining(last_remaining);

    function paint() {
        var elapsed = (+new Date() - beginTime)/1000;
        var position = elapsed/round_length % 1;
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

        ctx.clearRect(0, 0, 200, 200);
        for (var i = 0; i < sections.length; i++) {
            var end = start + sections[i].length/round_length;
            if (position > start && position <= end && sections[i].name !== commandText) {
                commandElem.innerText = commandText = sections[i].name;
            }
            ctx.fillStyle = sections[i].color;
            ctx.beginPath();
            pie(start, end);
            ctx.fill();
            start = end;
        }

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        pie(0, position);
        ctx.fill();
        last_position = position;
    }

    var timer = setInterval(requestAnimationFrame.bind(null, paint), 1000/47);
}

document.getElementById('start-btn').onclick = function() {
    start(1, [
        {name: 'Inhale', length: 3, color: 'blue'},
        {name: 'Exhale', length: 9, color: 'green'},
    ]);
}

