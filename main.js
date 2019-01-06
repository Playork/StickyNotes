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
      placeholder: 'Add Your Note',
      theme: 'snow'
    });
    $('#locks').click(function(){
      var clicks = $(this).data('clicks');
      if (clicks) {
        quill.enable(true)
        document.getElementById('lock').innerHTML = '&#xE785;'
        $('.button,.buttons').css("pointer-events", "auto");
      } else {
        quill.enable(false)
        document.getElementById('lock').innerHTML = '&#xE72E;'
        $('.button,.buttons').css("pointer-events", "none");
        $('.ql-snow.ql-toolbar').css('display', 'none');
      }
      $(this).data("clicks", !clicks);
    });
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
});
$('*').on('click focus focusin', function () {
  $('#titlebar').css('height', '32px');
  $('#titlebar').css('transition', 'height 0.1s ease-in-out');
  $('#titlebar span').css('display', 'flex');
  $('#color').css('height', '45px');
  $('#color').css('transition', 'height 0.1s ease-in-out');
  $(".ql-snow .ql-editor").attr('style', 'height: calc(100% - 110xp) !important;');
  $('.ql-snow .ql-editor').css('transition', 'height 0.1s ease-in-out');
});
$('*').on('focusout blur', function () {
  $('#titlebar').css('height', '25px');
  $('#titlebar').css('transition', 'height 0.1s ease-in-out');
  $('#titlebar span').css('display', 'none');
  $('#color').css('height', '0');
  $('#color').css('transition', 'height 0.1s ease-in-out');
  $(".ql-snow .ql-editor").attr('style', 'height: 100% !important;');
  $('.ql-snow .ql-editor').css('transition', 'height 0.1s ease-in-out');
});
function colors(){
$('.yellow').click(function() {
                $('#titlebar').css('background', '#FFEB81');
                $('#lightYellow').css('background', '#FFF2AB');
});
$('.green').click(function() {
                $('#titlebar').css('background', '#AFECA4');
                $('#lightYellow').css('background', '#CBF1C4');
});
$('.blue').click(function() {
                $('#titlebar').css('background', '#B7DFFF');
                $('#lightYellow').css('background', '#CDE9FF');              
});
$('.pink').click(function() {
                $('#titlebar').css('background', '#FFBBDD');
                $('#lightYellow').css('background', '#FFCCE5');
});
$('.violet').click(function() {
                $('#titlebar').css('background', '#DBB7FF');
                $('#lightYellow').css('background', '#E7CFFF');
});
$('.gray').click(function() {
                $('#titlebar').css('background', '#E5E5E5');
                $('#lightYellow').css('background', '#F9F9F9');
});
$('.dark').click(function() {
                $('#titlebar').css('background', '#3E3E3E');
                $('#lightYellow').css('background', '#444444');
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