function note(){
  var {ipcRenderer} = require('electron')
  ipcRenderer.send('create-new-instance')
};
const remote = require('electron').remote;
(function handleWindowControls() {
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            let window = remote.getCurrentWindow();
            const closeButton = document.getElementById('close-button');
            closeButton.addEventListener("click", event => {
                window = remote.getCurrentWindow();
                window.close();
            });
        }
    };
})();
$( document ).ready(function(){
$('*,.ql-container > *').on('click hover focus', function () {
  $('#titlebar').css('height', '32px');
  $('#titlebar').css('transition', 'height 0.1s ease-in-out');
  $('#titlebar span').css('display', 'flex');
  $('#color').css('height', '45px');
  $('#color').css('transition', 'height 0.1s ease-in-out');
  $(".ql-snow .ql-editor").attr('style', 'height: calc(100% - 110xp) !important;');
  $('.ql-snow .ql-editor').css('transition', 'height 0.1s ease-in-out');
});
$('*,.ql-container > *').on('focusout', function () {
  $('#titlebar').css('height', '25px');
  $('#titlebar').css('transition', 'height 0.1s ease-in-out');
  $('#titlebar span').css('display', 'none');
  $('#color').css('height', '0');
  $('#color').css('transition', 'height 0.1s ease-in-out');
  $(".ql-snow .ql-editor").attr('style', 'height: 100% !important;');
  $('.ql-snow .ql-editor').css('transition', 'height 0.1s ease-in-out');
});
    var BackgroundClass = Quill.import('attributors/class/background');
    var ColorClass = Quill.import('attributors/class/color');
    var SizeStyle = Quill.import('attributors/style/size');
    SizeStyle.whitelist = ['10px', '18px', '27px', '37px'];
    Quill.register(BackgroundClass, true);
    Quill.register(ColorClass, true);
    Quill.register(SizeStyle, true);
    var Font = Quill.import('formats/font');
    Font.whitelist = ['lobster', 'comicsans'];
    Quill.register(Font, true);
    var quill = new Quill('#editor', {
      modules: {
        toolbar: [
          [{ font: ['', 'lobster', 'comicsans'] }, { size: ['10px', '18px', '27px', '37px'] }, 'bold', 'italic', 'underline','strike', {color:['black','white','red','orange','yellow','green','blue','purple']}, {background:['black','white','red','orange','yellow','green','blue','purple']},{list: 'bullet'},{list: 'ordered'},{ align: '' },{align: 'center'},{align: 'right'},'clean','image','video']
        ]
      },
      theme: 'snow'
    });
    //Below is not finished don't uncomment this if you don't know what it is
    /*const Store = require('electron-store');
    const store = new Store();
    quill.on('text-change', function() {
      const text = quill.root.innerHTML;
      store.set('save',{"first":text});
      console.log(stringid)
    });
    const item = store.get('save')
    quill.root.innerHTML = item.first*/
    $('.ql-snow.ql-toolbar').css('display', 'none');
$('.more').click(function(){
  var clicks = $(this).data('clicks');
  if (clicks) {
     $('.ql-snow.ql-toolbar').css('display', 'none');
     $(".ql-snow .ql-editor").attr('style', 'height: calc(100% - 65xp) !important;');
  } else {
     $('.ql-snow.ql-toolbar').css('display', 'block');
     $(".ql-snow .ql-editor").attr('style', 'height: calc(100% - 110xp) !important;');
  }
  $(this).data("clicks", !clicks);
});
});
function colors(){
$('.yellow').click(function() {
                $('#titlebar').css('background', '#cccc00');
                $('#lightYellow').css('background', '#FFFF00');
});
$('.green').click(function() {
                $('#titlebar').css('background', '#8bff64');
                $('#lightYellow').css('background', '#bef39e');
});
$('.blue').click(function() {
                $('#titlebar').css('background', '#4035ff');
                $('#lightYellow').css('background', '#5b60f4');              
});
$('.pink').click(function() {
                $('#titlebar').css('background', '#e930c9');
                $('#lightYellow').css('background', '#e182df');
});
$('.gray').click(function() {
                $('#titlebar').css('background', '#aaa');
                $('#lightYellow').css('background', '#ccc');
});
$('.dark').click(function() {
                $('#titlebar').css('background', '#444');
                $('#lightYellow').css('background', '#777');
});
};
function newColor()
{
  var titleColor = document.getElementById('color1').value;
  var backColor = document.getElementById('color2').value;
  $('#titlebar').css('background', titleColor);
  $('#lightYellow').css('background', backColor);
  $('.choosecolor').css('display', 'none');
};
function showthis(){
  $('.colors').on('click', function(){
    $('.choosecolor').css('display', 'block');
  });
};
function cancel()
{
  $('.choosecolor').css('display', 'none');
};