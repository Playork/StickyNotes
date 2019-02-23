<template>
  <div>
    <div>
      <div id="options">
        <span v-on:click="aboutshow">&#xE946;</span>
        <a href="#help" target="_blank">
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
      <span v-on:click="note">&#xE710;</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    note: Function
  },
  methods: {
    aboutshow: function() {
      let id = document.getElementById("about");
      id.style.display = "block";
    },
    hide: function() {
      let id = document.getElementById("about");
      id.style.display = "none";
    }
  }
};
</script>
