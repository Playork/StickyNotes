<template>
  <div>
    <header id="titlebar1">
      <div id="drag-region">
        <div id="window-title">
          <span style="color:#fff;font-size:25px;">Sticky Note</span>
        </div>
        <div id="window-controls">
          <div class="button" v-on:click="close" id="close-button">
            <span>&#xE8BB;</span>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
export default {
  props: {
    close: Function
  }
};
</script>
