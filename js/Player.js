define(function(require){
    var _songs = {};
    var _isPlaying = false;

    var Song = function(config){
        this.file = config.file;
        this.dataurl = config.dataurl;
        this.element = config.element;
    };
    var _source, 
        _analyser, 
        _freq,
        _context;

    (function init(){
        _context  =  new window.AudioContext();
        _source   = _context.createMediaElementSource(player);
        _analyser = _context.createAnalyser();
        _source.connect(_analyser); 
        _analyser.connect(_context.destination); // connect the freq analyzer to the output
        _freq = new Uint8Array(64);

    })();
    
    var populateList = function(song){
        if(song.file.name in _songs) return;

        console.log(_songs);
        _songs[song.file.name] = song;
        song.element.setAttribute('onclick', 'app.player[\'play\'](\'' + btoa(song.file.name) + '\')');
        var title = "<h4>".concat(song.file.name).concat("</h4>")
        var size = "<small>Size: ".concat(Math.floor(song.file.size/1048576)).concat("mb</small>")
        song.element.innerHTML =  title.concat(size);
        console.log(song.element);
        songlist.appendChild(song.element);
    }
    return {
        play : function(_name){
            if( !(atob(_name) in _songs) ) throw new Error("Unable to play song");
            else player.src = _songs[atob(_name)].dataurl;
            player.play();
            _isPlaying = true;

        },
        pause: function(){
            player.pause();
            _isPlaying = false;
        },
        getSongs : function(){
            a = [];
            for(var song in _songs){
                a.push(song);
            }
            return a
        },
        getFrequency: function(){return _freq},
        loadTracks : function(_files){
            var reader = new FileReader();
            var index  = 0;
            reader.addEventListener('loadend', function(e){
                var song;

                if(player.canPlayType(_files[index].type)){
                    song = new Song({
                        file    : _files[index],
                        dataurl : e.target.result, 
                        element : document.createElement('li')
                    });
                    if(index < _files.length){
                        populateList(song);
                        console.log(index);
                        try{
                            reader.readAsDataURL(_files[++index]);
                        }catch(e){}
                    }
                }
            }, false);
            reader.readAsDataURL(_files[index]);
        },
        isPlaying : function(){return _isPlaying},
        getAnalyser : function(){return _analyser}
    }
});