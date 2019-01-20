<template>
  <section class="choosecolor">
    <h1>Titlebar</h1>Color:
    <input type="color" id="color1">
    <h1>Note</h1>Color:
    <input type="color" id="color2">
    <br>
    <button class="button1" v-on:click="cancel">Cancel</button>
    <button class="button1" v-on:click="newColor">done</button>
  </section>
</template>
<script>
export default {
  methods: {
    newColor: function() {
      var titleColor = document.getElementById("color1").value;
      var backColor = document.getElementById("color2").value;
      document.getElementById("titlebar").style.background = titleColor;
      document.getElementById("lightYellow").style.background = backColor;
      document.querySelector("section").style.display = "none";
    },
    cancel: function() {
      document.querySelector("section").style.display = "none";
    }
  }
};
</script>
<style>
.choosecolor {
  background: #ccc;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: "Lobster";
  z-index: 7;
  padding-top: 35px;
  text-align: center;
  display: none;
}
.button1 {
  color: white;
  background: #333;
  font-size: 20px;
  padding: 8px 8px;
  border-width: 0;
  border-radius: 20px;
  font-family: "Lobster";
}
input[type="color"] {
  border: none;
  background: #ccc;
  outline: none;
}
</style>
