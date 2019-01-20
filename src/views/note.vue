<template>
  <div class="body" v-on:click="showhide">
    <titlebar v-bind:close="close" v-bind:note="note"/>
    <editor/>
    <colors/>
    <choosecolor/>
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
      $("*").on("click focusin", function() {
        $("#titlebar").css("height", "32px");
        $("#titlebar").css("transition", "height 0.1s ease");
        $("#titlebar span").css("display", "flex");
        $("#color").css("height", "40px");
        $("#color").css("transition", "height 0.1s ease");
        $(".ql-snow .ql-editor").css("transition", "height 0.1s ease");
      });
      $("*").on("focusout blur", function() {
        $("#titlebar").css("height", "0");
        $("#titlebar").css("transition", "height 0.1s ease");
        $("#titlebar span").css("display", "none");
        $("#color").css("height", "0");
        $("#color").css("transition", "height 0.1s ease");
        $(".ql-snow .ql-editor").attr("style", "height: 100% !important;");
        $(".ql-snow .ql-editor").css("transition", "height 0.1s ease");
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
