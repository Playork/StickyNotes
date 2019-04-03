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

<template>
  <div>
    <div id="color" v-on:click="colors">
      <button id="yellow" class="buttons">
        <span id="one" class="selected select">&#xE73E;</span>
      </button>
      <button id="green" class="buttons">
        <span id="two" class="selected hide">&#xE73E;</span>
      </button>
      <button id="blue" class="buttons">
        <span id="three" class="selected hide">&#xE73E;</span>
      </button>
      <button id="pink" class="buttons">
        <span id="four" class="selected hide">&#xE73E;</span>
      </button>
      <button id="violet" class="buttons">
        <span id="five" class="selected hide">&#xE73E;</span>
      </button>
      <button id="gray" class="buttons">
        <span id="six" class="selected hide">&#xE73E;</span>
      </button>
      <button id="dark" class="buttons">
        <span id="seven" class="selected hide">&#xE73E;</span>
      </button>
      <button id="colors" class="buttons" v-on:click="showthis" title="Choose Color">
        <span>&#xE710;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: ["yellow", "green", "blue", "pink", "violet", "gray", "dark"],
      select: ["one", "two", "three", "four", "five", "six", "seven"],
      color1: [
        "#FFEB81",
        "#AFECA4",
        "#B7DFFF",
        "#FFBBDD",
        "#BDB7FF",
        "#E5E5E5",
        "#3E3E3E"
      ],
      color2: [
        "#FFF2AB",
        "#CBF1C4",
        "#CDE9FF",
        "#FFCCE5",
        "#E7CFFF",
        "#F9F9F9",
        "#444444"
      ]
    };
  },
  methods: {
    colors() {
      for (let i = 0; i < 7; i++) {
        document.getElementById(this.id[i]).onclick = () => {
          document.getElementById("titlebar").style.background = this.color1[i];
          document.getElementById("lightYellow").style.background = this.color2[
            i
          ];
          for (let j = 0; j < 7; j++) {
            document.getElementById(this.select[j]).classList.remove("select");
            document.getElementById(this.select[j]).classList.add("hide");
          }
          document.getElementById(this.select[i]).classList.add("select");
          document.getElementById(this.select[i]).classList.remove("hide");
        };
      }
    },
    showthis() {
      document.getElementById("colors").onclick = () => {
        document.getElementById("choosecolor").style.display = "block";
      };
    }
  }
};
</script>
