<!--
MIT License

Copyright (c) 2019 Playork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

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
import { setInterval } from "timers";
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
        let clearint = window.setInterval(() => {
          document.getElementById("color").style.height = "0";
          document.getElementById("lock").style.marginLeft = "-100px";
          document.getElementById("add").style.display = "none";
          document.getElementById("more").style.display = "none";
          document.getElementById("selectmedia").style.display = "none";
          document.getElementById("close").style.display = "none";
          if (select.style.pointerEvents == "auto") {
            document.getElementById("color").style.height = "40px";
            document.getElementById("lock").style.marginLeft = "0";
            document.getElementById("add").style.display = "flex";
            document.getElementById("more").style.display = "flex";
            document.getElementById("close").style.display = "flex";
            clearInterval(clearint);
          }
        }, 0.001);
        clearint;
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
        document.getElementById("selectmedia").style.display = "flex";
        document.getElementById("lightYellow").style.paddingTop = "90px";
      } else {
        select.style.display = "none";
        select0.style.height = "40px";
        document.getElementById("selectmedia").style.display = "none";
        document.getElementById("lightYellow").style.paddingTop = "30px";
      }
    }
  }
};
</script>
