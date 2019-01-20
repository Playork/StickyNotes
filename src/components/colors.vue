<template>
  <div id="color" v-on:click="colors">
    <button class="yellow buttons">
      <span class="selected select">&#xE73E;</span>
    </button>
    <button class="green buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
    <button class="blue buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
    <button class="pink buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
    <button class="violet buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
    <button class="gray buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
    <button class="dark buttons">
      <span class="selected hide">&#xE73E;</span>
    </button>
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
      $(".buttons").click(function() {
        $(".selected").removeClass("select");
        $(".selected").addClass("hide");
        $(".hide", this).toggleClass("select");
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
  font-family: "segoe";
  src: url(../assets/SegMDL2.ttf);
}
@font-face {
  font-family: "Lobster";
  src: url(../assets/Lobster.woff2) format("woff2");
}
.hide {
  display: none;
}
.select {
  font-size: 20px;
  display: block;
  font-family: "segoe";
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
  transition: height 0.1s ease;
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
