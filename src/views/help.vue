<template>
  <div id="body">
    <span v-on:click="close">&#xE8BB;</span>
    <div id="help">
      <div id="content">
        <img src="../assets/help1.png" width="300px">
        <div style="padding-top:20px;">
          <div style="font-size:20px;">1-Add New Note</div>
          <div style="font-size:20px;">2-Lock The Note</div>
          <div style="font-size:20px;">3-Speech To Text</div>
          <div style="font-size:20px;">4-Show or hide Editing Options</div>
          <div style="font-size:20px;">5-Delete The Note</div>
          <div style="font-size:20px;">6-Choose A Background Color</div>
          <div style="font-size:20px;">7-Choose A Custom Baground Color</div>
          <div style="font-size:20px;">8-Type Here Your Note</div>
        </div>
        <img src="../assets/help2.png" width="250px">
        <div>
          <div style="font-size:20px;">1-Choose Title Bar Background Color</div>
          <div style="font-size:20px;">2-Choose Note Background Color</div>
          <div style="font-size:20px;">3-Cancel And Back To Note</div>
          <div style="font-size:20px;">4-Change Color And Back To Note</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close: function() {
      remote.getCurrentWindow().close();
    }
  }
};
</script>

<style>
@font-face {
  font-family: "Lobster";
  src: url(../assets/Lobster.woff2) format("woff2");
}
@font-face {
  font-family: "segoe";
  src: url(../assets/SegMDL2.ttf);
}
#body {
  background: #fff;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  user-select: none;
}
#help {
  font-family: "Lobster";
  padding-top: 20px;
  text-align: center;
  color: #000;
  padding: 10px;
}
span {
  position: absolute;
  top: 5px;
  bottom: 100%;
  right: 5px;
  color: #000;
  font-family: "segoe";
}
#content {
  display: grid;
  grid-template-columns: 50% 50%;
  row-gap: 20px;
}
</style>