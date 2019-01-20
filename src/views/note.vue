<template>
  <div class="body" v-on:click="showhide">
    <titlebar v-bind:close="close" v-bind:note="note"/>
    <div id="edit">
      <editor/>
      <colors/>
      <choosecolor/>
    </div>
  </div>
</template>
<script>
import JQuery from "jquery";
let $ = JQuery;
import { remote, ipcRenderer } from "electron";
import editor from "../components/editor.vue";
import titlebar from "../components/titlebar.vue";
import colors from "../components/colors.vue";
import choosecolor from "../components/choosecolor.vue";
export default {
  components: {
    titlebar,
    editor,
    colors,
    choosecolor
  },
  methods: {
    close: function() {
      remote.getCurrentWindow().close();
    },
    note: function() {
      ipcRenderer.send("create-new-instance");
    },
    showhide: function() {
      $(document).on("click focus focusin", function() {
        document.getElementById("titlebar").style.height = "32px";
        document.getElementById("titlebar").style.transition =
          "height 0.1s ease";
        document.getElementById("drag-region").style.display = "flex";
        document.getElementById("color").style.height = "40px";
        document.getElementById("color").style.transition = "height 0.1s ease";
        document.getElementsByClassName(".ql-editor").style.transition =
          "height 0.1s ease";
      });
      $(document).on("focusout blur", function() {
        document.getElementById("titlebar").style.height = "0";
        document.getElementById("titlebar").style.transition =
          "height 0.1s ease";
        document.getElementById("drag-region").style.display = "none";
        document.getElementById("color").style.height = "0";
        document.getElementById("color").style.transition = "height 0.1s ease";
        document.getElementsByClassName(".ql-editor").style.height = "100%";
        document.getElementsByClassName(".ql-editor").style.transition =
          "height 0.1s ease";
      });
    }
  }
};
</script>
<style>
.body {
  user-select: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
button {
  outline: none;
}
a {
  text-decoration: none;
}
</style>
