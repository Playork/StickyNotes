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
    <div id="notes"></div>
    <div>
      <div id="options">
        <span v-on:click="deleteall" title="Delete All Notes And Quit">&#xE74D;</span>
        <span v-on:click="aboutshow" title="About">&#xE946;</span>
        <a href="#help" target="_blank" title="help">
          <span>&#xE897;</span>
        </a>
      </div>
      <div id="about">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <img src="../../assets/logo.png" style="padding-top:20px;" width="150px">
          <div style="font-size:30px;">Playork</div>
          <div style="font-size:40px;">Sticky Notes</div>
          <div style="font-size:20px;">Author: B. Ramnath Shenoy</div>
          <div style="font-size:20px;">bekalshenoy@gmail.com</div>
          <div id="view" style="font-size:20px;">©2019</div>
        </div>
      </div>
    </div>
    <div class="start">
      <div>Sticky Notes</div>
    </div>
  </div>
</template>

<script>
import store from "store";
import swal from "./../../assets/script/sweetalert.js";
import { setTimeout } from "timers";
export default {
  methods: {
    deleteall: function() {
      swal({
        title: "Are you sure?",
        text: "Want To Delete All Notes!",
        icon: "warning",
        buttons: true,
        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          store.set("closed", { closed: "yes" });
          if (store.get("closed").closed == "yes") {
            window.setTimeout(() => {
              store.clearAll();
            }, 100);
          }
        }
      });
    },
    aboutshow: function() {
      let id = document.getElementById("about");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },
    hide: function() {
      let id = document.getElementById("about");
      id.style.display = "none";
      document.getElementById("home").style.overflowY = "auto";
    }
  }
};
</script>
