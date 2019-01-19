<template>
  <div
    class="body"
    style="font-family: Lobster;background:#ccc;position:absolute;top:0;
    bottom:0;left:0;right:0;"
  >
      <span
        v-on:click="note"
        style="font-family:segoe;color:#333;font-size:100px;position:absolute;top:40vh;left:35vw;right:30vw;"
      >&#xE710;</span>
    <div
      id="view"
      style="color:#333;position:absolute;top:85vh;left:40vw;right:30vw;font-family: Lobster;"
    >by Playork ©2018-19</div>
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
</style>
