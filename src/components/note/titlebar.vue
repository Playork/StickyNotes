<template>
  <div>
    <div id="titlebar" style="position:fixed;">
      <div id="drag-region">
        <div class="id" id="window-title1" title="Add Note" v-on:click="note">
          <span id="add">&#xE710;</span>
        </div>
        <div id="locks" title="Lock Note" v-on:click="locks">
          <span id="lock">&#xE785;</span>
        </div>
        <div id="window-controls">
          <div class="button" id="show" title="Edit Text" v-on:click="showedit">
            <span id="more" class="more">&#xE70F;</span>
          </div>
          <div class="button" id="close-button" v-on:click="close">
            <span id="close">&#xE8BB;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    close: Function,
    note: Function
  },
  methods: {
    /*speech: function() {
      document.getElementById("speech").innerHTML = "&#xEC71;";
      var recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.start();
      recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var text = event.results[last][0].transcript;
        document.getElementById("editor").innerHTML = text;
      };
      recognition.onspeechend = function() {
        document.getElementById("speech").innerHTML = "&#xE720;";
        recognition.stop();
      };
    },*/
    locks: function(obj) {
      let id = document.getElementById("lock");
      let select = document.getElementById("close-button");
      let select0 = document.getElementById("show");
      let select1 = document.getElementById("color");
      let select2 = document.getElementById("editor");
      let select3 = document.querySelector(".ql-snow.ql-toolbar");
      if (
        select.style.pointerEvents == "auto" ||
        select.style.pointerEvents == ""
      ) {
        id.innerHTML = "&#xE72E;";
        select.style.pointerEvents = "none";
        select0.style.pointerEvents = "none";
        select1.style.pointerEvents = "none";
        select2.style.pointerEvents = "none";
        select3.style.display = "none";
      } else {
        id.innerHTML = "&#xE785;";
        select.style.pointerEvents = "auto";
        select0.style.pointerEvents = "auto";
        select1.style.pointerEvents = "auto";
        select2.style.pointerEvents = "auto";
      }
    },
    showedit: function() {
      let select = document.querySelector(".ql-snow.ql-toolbar");
      let select0 = document.getElementById("color");
      if (select.style.display == "none" || select.style.display == "") {
        select.style.display = "block";
        select0.style.height = "0";
        document.getElementById("emoji").style.display = "flex";
      } else {
        select.style.display = "none";
        select0.style.height = "40px";
        document.getElementById("emoji").style.display = "none";
      }
    }
  }
};
</script>
