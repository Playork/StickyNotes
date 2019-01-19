<template>
  <div id="color" v-on:click="colors">
    <button class="yellow buttons"></button>
    <button class="green buttons"></button>
    <button class="blue buttons"></button>
    <button class="pink buttons"></button>
    <button class="violet buttons"></button>
    <button class="gray buttons"></button>
    <button class="dark buttons"></button>
    <button class="colors buttons" v-on:click="showthis" title="Choose Color">
      <span>&#xE710;</span>
    </button>
  </div>
</template>
<script>
import JQuery from "jquery";
let $ = JQuery;
export default {
  methods: {
    colors: function() {
      $(".yellow").click(function() {
        $("#titlebar").css("background", "#FFEB81");
        $("#lightYellow").css("background", "#FFF2AB");
      });
      $(".green").click(function() {
        $("#titlebar").css("background", "#AFECA4");
        $("#lightYellow").css("background", "#CBF1C4");
      });
      $(".blue").click(function() {
        $("#titlebar").css("background", "#B7DFFF");
        $("#lightYellow").css("background", "#CDE9FF");
      });
      $(".pink").click(function() {
        $("#titlebar").css("background", "#FFBBDD");
        $("#lightYellow").css("background", "#FFCCE5");
      });
      $(".violet").click(function() {
        $("#titlebar").css("background", "#DBB7FF");
        $("#lightYellow").css("background", "#E7CFFF");
      });
      $(".gray").click(function() {
        $("#titlebar").css("background", "#E5E5E5");
        $("#lightYellow").css("background", "#F9F9F9");
      });
      $(".dark").click(function() {
        $("#titlebar").css("background", "#3E3E3E");
        $("#lightYellow").css("background", "#444444");
      });
    },
    showthis: function() {
      $(".colors").on("click", function() {
        $(".choosecolor").css("display", "block");
      });
    }
  }
};
</script>
<style>
@font-face {
  font-family: "Lobster";
  src: url(../assets/Lobster.woff2) format("woff2");
}
#color {
  display: grid;
  grid-template-columns: 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 13%;
  position: absolute;
  bottom: 0;
  z-index: 6;
  width: 100%;
  height: 40px;
  min-width: 300px;
  padding: 0;
  margin: 0;
  z-index: 6;
}
.colors {
  background: #000;
}
.colors span {
  font-size: 20px;
  font-family: "segoe";
  color: #fff;
}
.yellow {
  background: #ffeb81;
}
.green {
  background: #afeca4;
}
.pink {
  background: #ffbbdd;
}
.violet {
  background: #dbb7ff;
}
.gray {
  background: #e5e5e5;
}
.blue {
  background: #b7dfff;
}
.dark {
  background: #3e3e3e;
}
</style>
