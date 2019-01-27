<template>
  <div class="start">
    <span v-on:click="note">&#xE710;</span>
    <div id="view">by Playork ©2018-19</div>
  </div>
</template>
<script>
export default {
  props: {
    note: Function
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
.start {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
  grid-template-rows: 8fr 1fr;
}
.start span {
  padding-top: 40%;
  font-family: segoe;
  color: #fff;
  font-size: 100px;
  text-align: center;
}
.start div {
  color: #fff;
  font-family: Lobster;
  text-align: center;
}
</style>
