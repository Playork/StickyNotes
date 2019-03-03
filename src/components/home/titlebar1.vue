<template>
  <div>
    <header id="titlebar1">
      <div id="drag-region">
        <div class="id" id="window-title1" title="Add Note" v-on:click="note">
          <span id="add">&#xE710;</span>
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
