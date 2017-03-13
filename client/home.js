import gif from 'gifshot'
var imgs = [];
var ps = [];

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

Template.wrapper.onCreated(function bodyOnCreated() {
    this.state = new ReactiveDict();
});

Template.wrapper.events({
    'change #addfile': function(ev) {
        _.each(ev.target.files, function(file) {
           var reader = Meteor.saveFile(file);
           const instance = Template.instance();

           reader.onload = function () {
               //console.log(reader.result)
               ps.push(reader.result)
               var nimg = {
                   url: reader.result
               }
               imgs.push(nimg)
               instance.state.set('img',imgs)
           }
        });
    },
    'dragover #dropDiv' : function(e, t) {
        e.preventDefault();
    },
    'drop #dropDiv' : function(e, t) {
        e.preventDefault();
        e.originalEvent.dataTransfer.getData("text");
        //without the previous line you won't be able to get dropped file data;
        var files = e.originalEvent.dataTransfer.files
        //console.log(files)
        const instance = Template.instance();
        for(var i=0;i<files.length;i++){
            //console.log(files[i])
            const reader = Meteor.saveFile(files[i]);

            reader.onload = function () {
                //console.log(reader.result)
                ps.push(reader.result)
                var nimg = {
                    url: reader.result
                }
                imgs.push(nimg)
                instance.state.set('img',imgs)
            }
        }
    },
    'click #makegif': function (e,t) {
        var pa = $('#para').val()
        console.log(pa)
        gif.createGIF({
            'images':ps,
            'interval': pa*0.001
        },function(obj) {
            if(!obj.error) {
                var image = obj.image
                $('#gifimg').attr('width','180px')
                $('#gifimg').attr('height','auto')
                $('#gifimg').attr('src',image)
            }
        });
    },
    'change #para': function (e,t) {
        console.log(e.target.value)
        const instance = Template.instance();
        instance.state.set('para', e.target.value);
    },
    'click #dbtn': function (e,t) {
        var img = document.getElementById('gifimg');
        console.log(img)

        downloadURI(img.src, "sample_gif.gif");
    }
});

Template.wrapper.helpers({
    paints: function () {
        const instance = Template.instance();
        if (instance.state.get('img')) {
            return instance.state.get('img')
        }
    },
    para: function () {
        const instance = Template.instance();
        return instance.state.get('para')
    }
})

