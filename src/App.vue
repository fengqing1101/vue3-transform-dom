<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import TransfromDom from './components/TransfromDom.vue'
const width = document.body.clientWidth;
const height = document.body.clientHeight;
const array = new Array(100).fill(null).map(() => {
  let backgroundColor = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0");
  return {
    background: "#" + backgroundColor,
    left: ~~(Math.random() * width) + 'px',
    top: ~~(Math.random() * height) + 'px'
  }
});

const el = ref<InstanceType<typeof TransfromDom> | null>(null);
function keyup(e: KeyboardEvent) {
  if (e.key === ' ') el.value?.resize();
}

onMounted(() => {
  document.addEventListener('keyup', keyup);
})

onUnmounted(() => {
  document.removeEventListener('keyup', keyup);
})
</script>

<template>
  <div>
    <transfrom-dom ref="el" :width="width" :height="height" disable-move>
      <template #inner>
        <div class="inner">
          <div v-for="(style, index) in array" :key="index" :data-index="index" :style="style"></div>
        </div>
      </template>
    </transfrom-dom>
  </div>
</template>

<style>
html,
body,
#app,
#app>div {
  width: 100%;
  height: 100%;
  margin: 0;
}

.inner {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .2);
}

.inner>div {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>