<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Ref } from 'vue';
export interface coor {
  x: number
  y: number
}

const props = defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  disableMove: {
    type: Boolean,
    default: false,
  },
  disableScale: {
    type: Boolean,
    default: false,
  },
  minScale: {
    type: Number,
    default: 0.1,
  },
  maxScale: {
    type: Number,
    default: 10,
  },
  scaleStep: {
    type: Number,
    default: 0.1,
  },
})
const scale: Ref<number> = ref(1);
const translateX: Ref<number> = ref(0);
const translateY: Ref<number> = ref(0);
let _minScale: number = props.minScale;
let _maxScale: number = props.maxScale;
let center: coor = { x: 0, y: 0 };
let pos: coor;
const style = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`
  }
})

onMounted(() => {
  resize();
})


const el = ref();
/**
 * 滚动到矩形框；尽可能将矩形框放置在正中间
 * @param position [x,y,width,height]
 */
function scrollToRect(position: number[]): void {
  const { width: warpWidth, height: warpHeight } = el.value.getBoundingClientRect()
  const [x, y, width, height] = position;

  transform(
    warpWidth / 2 - x - width / 2,
    warpHeight / 2 - y - height / 2,
    1
  )

  const scale = Math.min(
    warpWidth / (width + 100),
    warpHeight / (height + 100),
    _maxScale
  )
  transfromByPositionAndScale(
    { x: warpWidth / 2, y: warpHeight / 2 },
    scale
  )
}

/**
 * 按照指定中心，与比例进行缩放，返回新的点
 * @param p 被缩放的点
 * @param center 缩放中心
 * @param ratio 缩放比例
 */
function zoom(p: coor, center: coor, ratio: number): coor {
  return {
    x: (p.x - center.x) * ratio + center.x,
    y: (p.y - center.y) * ratio + center.y
  }
}

/**
 * 获取鼠标相对于el的坐标
 */
function getPosition(e: MouseEvent): coor {
  let rect = el.value.getBoundingClientRect();
  return { x: e.pageX - rect.left, y: e.pageY - rect.top };
}

/**
 * 获取鼠标相对于tranformDIV的坐标
 */
function getTransformDomPosition(e: MouseEvent): coor {
  const { left, top } = el.value.firstChild.getBoundingClientRect()
  let x = e.pageX;
  let y = e.pageY;

  return {
    x: ~~((x - left) / scale.value),
    y: ~~((y - top) / scale.value)
  }
}

/**
 * 鼠标滚动事件，缩放$tranformDIV
 */
function wheel(e: WheelEvent) {
  if (props.disableScale) return;
  e.preventDefault()
  if (e.deltaY < 0 && scale.value >= _maxScale) return // 放大
  if (e.deltaY > 0 && scale.value <= _minScale) return // 缩小

  let _scale = scale.value * (e.deltaY < 0 ? 1 + props.scaleStep : 1 - props.scaleStep)
  _scale = Math.min(Math.max(_minScale, _scale), _maxScale)
  let ratio = _scale / scale.value

  let _centre = zoom(center, getPosition(e), ratio)
  transform(
    _centre.x - props.width / 2,
    _centre.y - props.height / 2,
    _scale
  )
}
/**
 * 鼠标按下事件，平移$tranformDIV
 */
function mousedown(e: MouseEvent) {
  if (props.disableMove) return;
  pos = getPosition(e)
  document.addEventListener('mousemove', mousemove)
  document.addEventListener('mouseup', mouseup)
}

/**
 * 鼠标按下移动事件，平移$tranformDIV
 * 鼠标未按下移动事件，获取当前鼠标位置对应图像的灰度值
 */
function mousemove(e: MouseEvent) {
  let curPos = getPosition(e)
  transform(
    translateX.value + curPos.x - pos.x,
    translateY.value + curPos.y - pos.y,
    scale.value
  )
  pos = curPos;
}

/**
 * 鼠标抬起事件，平移$tranformDIV
 */
function mouseup() {
  document.removeEventListener('mousemove', mousemove)
  document.removeEventListener('mouseup', mouseup)
}

/**
 * 根据窗口大小重新计算$tranformDIV刚好铺完el的transform值
 */
function resize() {
  const { width, height } = el.value.getBoundingClientRect()
  let scale = 1
  if (width / height > props.width / props.height) {
    //按宽屏处理
    scale = height / props.height
  } else {
    scale = width / props.width
  }
  transform(
    (width - props.width) / 2,
    (height - props.height) / 2,
    scale
  )

  _maxScale = Math.max(props.maxScale, scale)
  _minScale = Math.min(props.minScale, scale)

}

/**
 * 根据el的相应坐标$tranformDIV缩放scale计算其相应的transfrom参数
 */
function transfromByPositionAndScale(position: coor, scale: number): void {
  const centre = zoom(center, position, scale)
  transform(
    centre.x - props.width / 2,
    centre.y - props.height / 2,
    scale
  )
}

/**
 * transfrom dom
 * @param _dx 
 * @param _dy 
 * @param _scale 
 */
function transform(_dx: number, _dy: number, _scale: number) {
  translateX.value = _dx
  translateY.value = _dy
  scale.value = _scale

  center = {
    x: props.width / 2 + _dx,
    y: props.height / 2 + _dy
  }
}

defineExpose({
  resize,
  scrollToRect,
  getPosition,
  getTransformDomPosition,
})
</script>

<template>
  <div ref="el" style="width: 100%;height: 100%;overflow: hidden;position: relative;" @wheel="wheel"
    @mousedown="mousedown">
    <div style="position: relative;transform-origin: center;" :style="style">
      <slot name="inner" :scale="scale"></slot>
    </div>
    <slot name="outer" :scale="scale"></slot>
  </div>
</template>
