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

<!-- Body Of Home Page-->
<!-- Html -->
<template>
  <div>
    <div class="start">
      <div>
        <img src="../../assets/sticky.svg" width="300px">
      </div>
    </div>
    <div id="notes"></div>
    <div>
      <div id="options">
        <span id="deleteall" v-on:click="deleteall" title="Delete All Notes">&#xE74D;</span>
        <span v-on:click="aboutshow" title="About">&#xE946;</span>
      </div>
      <div id="about">
        <span v-on:click="hide">&#xE8BB;</span>
        <div>
          <img src="../../assets/logo.png" style="padding-top:20px;" width="150px">
          <div style="font-size:30px;">Playork</div>
          <div style="font-size:40px;">Sticky Notes</div>
          <div style="font-size:20px;">bekalshenoy@gmail.com</div>
          <div id="view" style="font-size:20px;">©2019</div>
          <div style="font-size:10px;">
            <a href="https://github.com/Playork/StickyNotes/issues/new" target="_blank">report bug</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Javascript -->
<script>
// Import Required Packages
import store from "store";
import swal from "sweetalert";
import { setTimeout } from "timers";

// Vue Class
export default {
  // Functions
  methods: {
    // Delete All Note Function
    deleteall() {
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
            }, 50);
          }
        }
      });
    },

    // Show About Page Function
    aboutshow() {
      let id = document.getElementById("about");
      id.style.display = "block";
      document.getElementById("home").style.overflowY = "hidden";
    },

    // Hide About Page Function
    hide() {
      let id = document.getElementById("about");
      id.style.display = "none";
      document.getElementById("home").style.overflowY = "auto";
    }
  }
};
</script>
