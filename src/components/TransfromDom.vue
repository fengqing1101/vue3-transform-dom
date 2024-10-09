<script setup lang="ts">
import { TransferToWindow } from 'transfer-to-window';
import { ref, computed, onMounted } from 'vue';
import defaultTransferToWindow from './defaultTransferToWindow';

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  minWH: {
    type: Number,
    default: 1,
  },
  maxWH: {
    type: Number,
    default: Infinity,
  },
  disableMove: {
    type: Boolean,
    default: false,
  },
  disableScale: {
    type: Boolean,
    default: false,
  },
  scaleStep: {
    type: Number,
    default: 0.1,
  },
})

const el = ref();
const transfer2window = ref<TransferToWindow>(defaultTransferToWindow);
const style = computed(() => {
  const { inw, inh, dx, dy, scale } = transfer2window.value;
  return {
    width: `${inw}px`,
    height: `${inh}px`,
    transform: `translate(${dx}px, ${dy}px) scale(${scale})`
  }
})

onMounted(() => {
  transfer2window.value = new TransferToWindow({
    inw: props.width,
    inh: props.height,
    outw: el.value.clientWidth,
    outh: el.value.clientHeight,
    minWH: props.minWH,
    maxWH: props.maxWH,
  })
})


/**
 * 获取鼠标相对于el的坐标
 * @returns [x, y]
 */
function getPosition(e: MouseEvent): number[] {
  let rect = el.value.getBoundingClientRect();
  return [e.pageX - rect.left, e.pageY - rect.top];
}

/**
 * 鼠标滚动事件，缩放$tranformDIV
 */
function wheel(e: WheelEvent) {
  if (props.disableScale) return;
  e.preventDefault()
  const coor = getPosition(e);
  const ratio = 1 - props.scaleStep * Math.sign(e.deltaY);
  transfer2window.value.zoom(coor[0], coor[1], ratio);
}

let pos: number[];
/**
 * 鼠标按下事件，平移$tranformDIV
 */
function mousedown(e: MouseEvent) {
  if (props.disableMove) return;
  pos = getPosition(e);
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}

/**
 * 鼠标按下移动事件，平移$tranformDIV
 * 鼠标未按下移动事件，获取当前鼠标位置对应图像的灰度值
 */
function mousemove(e: MouseEvent) {
  let curPos = getPosition(e);
  transfer2window.value.translate(curPos[0] - pos[0], curPos[1] - pos[1]);
  pos = curPos;
}

/**
 * 鼠标抬起事件，平移$tranformDIV
 */
function mouseup() {
  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', mouseup)
}

defineExpose({
  transfer2window,
  getPosition,
})
</script>

<template>
  <div ref="el" style="width: 100%;height: 100%;overflow: hidden;position: relative;" @wheel="wheel"
    @mousedown="mousedown">
    <div style="position: relative;transform-origin: 0 0;" :style="style">
      <slot :scale="transfer2window.scale"></slot>
    </div>
  </div>
</template>
