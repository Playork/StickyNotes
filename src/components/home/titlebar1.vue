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

<!-- Title Bar Of Home Page-->
<!-- Html -->
<template>
  <div>
    <header id="titlebar1">
      <div id="drag-region">
        <div class="id" id="window-title1" title="Add Note" v-on:click="note">
          <span id="add">&#xE710;</span>
        </div>
        <div id="window-controls">
          <div title="Close All Notes" class="button" v-on:click="close" id="close-button">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<!-- Javascript -->
<script>
// Vue Class
export default {
  // Props
  props: {
    close: Function,
    note: Function
  }
};
</script>
