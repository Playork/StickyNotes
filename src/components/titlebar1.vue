<template>
  <div>
    <header id="titlebar1" style="position:fixed;background:#333 !important;">
      <div id="drag-region">
        <div id="window-title">
          <span style="color:#fff;font-size:25px;">Sticky Note</span>
        </div>
        <div id="window-controls">
          <div class="button" v-on:click="close" id="close-button">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
export default { props: { close: Function } };
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
#titlebar1 {
  transition: height 0.3s ease-in-out;
  display: block;
  position: fixed;
  height: 32px;
  width: 100%;
  min-width: 300px;
  background: #cccc00;
  padding: 4px !important;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100%;
  z-index: 8;
}
#drag-region {
  width: 100% !important;
  height: 100%;
  -webkit-app-region: drag;
  display: grid;
  grid-template-columns: auto 138px;
}
#window-controls {
  display: grid;
  grid-template-columns: repeat(2, 40px) !important;
  position: absolute;
  top: 0 !important;
  right: 15px !important;
  height: 100%;
  font-size: 25px;
  -webkit-app-region: no-drag;
  align-items: center;
}
.button {
  grid-row: 1 / span 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100% !important;
  height: 100% !important;
  font-family: "segoe" !important;
  background: none;
  user-select: none;
  cursor: default;
}
#min-button {
  grid-column: 1;
}
#close-button {
  grid-column: 2;
}
.button:hover {
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
}
#min-button:hover,
#close-button:hover {
  box-shadow: none !important;
}
#close-button:hover {
  background: #e81123;
  color: #fff;
}
.button:hover {
  color: #fff;
}
.new {
  font-family: segoe !important;
}
#window-title span {
  font-family: "Lobster";
}
.buttons {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
}
</style>
