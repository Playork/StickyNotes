<template>
  <div class="help">
    <span v-on:click="close">&#xE8BB;</span>
    <div id="helppage">
      <div id="content">
        <img src="../assets/images/help1.png" width="300px">
        <div style="padding-top:20px;">
          <div style="font-size:20px;">1-Add New Note</div>
          <div style="font-size:20px;">2-Lock The Note</div>
          <div style="font-size:20px;">3-Show or hide Editing Options</div>
          <div style="font-size:20px;">4-Delete The Note</div>
          <div style="font-size:20px;">5-Type Here Your Note</div>
          <div style="font-size:20px;">6-Choose A Background Color</div>
          <div style="font-size:20px;">7-Choose A Custom Background Color</div>
        </div>
        <img src="../assets/images/help2.png" width="250px">
        <div>
          <div style="font-size:20px;">1-Choose Title Bar Background Color</div>
          <div style="font-size:20px;">2-Choose Note Background Color</div>
          <div style="font-size:20px;">3-Change Color And Back To Note</div>
          <div style="font-size:20px;">4-Cancel And Back To Note</div>
        </div>
        <img src="../assets/images/help3.png" width="250px">
        <div>
          <div style="font-size:20px;">1-Change Font Family</div>
          <div style="font-size:20px;">2-Change Font Size</div>
          <div style="font-size:20px;">3-Bold The Text</div>
          <div style="font-size:20px;">4-Make Italian The Text</div>
          <div style="font-size:20px;">5-Underline The Text</div>
          <div style="font-size:20px;">6-Strikethrough The Text</div>
          <div style="font-size:20px;">7-Add Text Color</div>
          <div style="font-size:20px;">8-Add Background Color</div>
          <div style="font-size:20px;">9-Order By Bullet</div>
          <div style="font-size:20px;">10-Order By Number</div>
          <div style="font-size:20px;">11-Align Text Center Or Left Or Right</div>
          <div style="font-size:20px;">12-Remove Text Stylings</div>
          <div style="font-size:20px;">13-Add Image Frome Local Drive</div>
          <div style="font-size:20px;">14-Add Embed Video</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
export default {
  methods: {
    close: function() {
      remote.getCurrentWindow().close();
    }
  }
};
</script>
