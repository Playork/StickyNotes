<template>
  <section id="choosecolor">
    <h1>Titlebar</h1>Color:
    <input type="color" value="#ffeb81" id="color1">
    <h1>Note</h1>Color:
    <input type="color" value="#fff2ab" id="color2">
    <br>
    <button class="button1" v-on:click="cancel">Cancel</button>
    <button id="cc" class="button1" v-on:click="newColor">done</button>
  </section>
</template>
<script>
export default {
  data() {
    return {
      select: ["one", "two", "three", "four", "five", "six", "seven"]
    };
  },
  methods: {
    newColor: function() {
      var titleColor = document.getElementById("color1").value;
      var backColor = document.getElementById("color2").value;
      document.getElementById("titlebar").style.background = titleColor;
      document.getElementById("lightYellow").style.background = backColor;
      document.querySelector("section").style.display = "none";
      for (let j = 0; j < 7; j++) {
        document.getElementById(this.select[j]).classList.remove("select");
        document.getElementById(this.select[j]).classList.add("hide");
      }
    },
    cancel: function() {
      document.querySelector("section").style.display = "none";
    }
  }
};
</script>
