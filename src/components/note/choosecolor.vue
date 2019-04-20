<!--
MIT License

Copyright (c) 2019 Playork

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<!-- Custom Color Section Of Note Page-->
<!-- Html -->
<template>
  <section id="choosecolor">
    <h1>Titlebar</h1>Color:
    <input type="color" value="#ffeb81" id="color1">
    <h1>Note</h1>Color:
    <input type="color" value="#fff2ab" id="color2">
    <br>
    <button class="button1" v-on:click="cancel">Cancel</button>
    <button id="changec" class="button1" v-on:click="newColor">done</button>
  </section>
</template>

<!-- Javascript -->
<script>
// Vue Class
export default {
  // Vars
  data() {
    return {
      select: ["one", "two", "three", "four", "five", "six", "seven"]
    };
  },

  // Functions
  methods: {
    // Add New Custom Color To Note
    newColor() {
      let titleColor = document.getElementById("color1").value;
      let backColor = document.getElementById("color2").value;
      document.getElementById("titlebar").style.background = titleColor;
      document.getElementById("lightYellow").style.background = backColor;
      document.getElementById("choosecolor").style.display = "none";
      for (let j = 0; j < 7; j++) {
        document.getElementById(this.select[j]).classList.remove("select");
        document.getElementById(this.select[j]).classList.add("hide");
      }
    },

    // Cancel Color Selection
    cancel() {
      document.getElementById("choosecolor").style.display = "none";
    }
  }
};
</script>
