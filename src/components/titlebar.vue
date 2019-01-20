<template>
  <div>
    <header id="titlebar" style="position:fixed;">
      <div id="drag-region">
        <div class="id" title="Add Note" id="window-title1" v-on:click="note">
          <span>&#xE710;</span>
        </div>
        <div id="locks" title="Lock Note" v-on:click="locks">
          <span id="lock">&#xE785;</span>
        </div>
        <div id="window-controls">
          <div class="button" title="Edit Text" v-on:click="showedit">
            <span id="more" class="more">&#xE70F;</span>
          </div>
          <div class="button" id="close-button" v-on:click="close">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
import JQuery from "jquery";
let $ = JQuery;
export default {
  props: {
    close: Function,
    note: Function
  },
  methods: {
    locks: function() {
      var clicks = $(this).data("clicks");
      if (clicks) {
        document.getElementById("lock").innerHTML = "&#xE785;";
        $(".button,.buttons,.ql-snow").css("pointer-events", "auto");
      } else {
        document.getElementById("lock").innerHTML = "&#xE72E;";
        $(".button,.buttons,.ql-snow").css("pointer-events", "none");
        $(".ql-snow.ql-toolbar").css("display", "none");
      }
      $(this).data("clicks", !clicks);
    },
    showedit: function() {
      var clicks = $(this).data("clicks");
      if (clicks) {
        $(".ql-snow.ql-toolbar").css("display", "none");
      } else {
        $(".ql-snow.ql-toolbar").css("display", "block");
      }
      $(this).data("clicks", !clicks);
    }
  }
};
</script>
<style>
@font-face {
  font-family: "segoe";
  src: url(../assets/SegMDL2.ttf);
}
#titlebar {
  display: block;
  position: fixed;
  height: 32px;
  width: 100%;
  min-width: 350px;
  background-color: #ffeb81;
  padding: 4px !important;
  color: #707070;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 100%;
  transition: height 0.1s ease;
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
#window-title1 {
  grid-row: 1 / span 1;
  font-size: 25px;
  font-family: "segoe";
  width: 40px;
  height: 100%;
  justify-content: center;
  cursor: default;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0 !important;
  left: 10px !important;
  height: 100%;
  -webkit-app-region: no-drag;
}
#window-title1 span {
  -webkit-app-region: no-drag;
  color: #707070;
}
#window-title1 span:hover {
  color: #fff;
}
#window-title1:hover {
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
}
#locks {
  grid-row: 1 / span 1;
  font-size: 25px;
  font-family: "segoe";
  width: 40px;
  height: 100%;
  justify-content: center;
  cursor: default;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0 !important;
  left: 45px !important;
  height: 100%;
  -webkit-app-region: no-drag;
  color: #707070;
}
#lock {
  -webkit-app-region: no-drag;
}
#locks:hover {
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
  color: #fff;
}
.button:hover {
  color: #fff;
}
.buttons {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
}
</style>
