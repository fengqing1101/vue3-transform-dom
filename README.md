# vue-tranform-dom

一个基于Vue3的可以缩放和拖动dom元素的组件

## 安装
```sh
npm install vue3-transform-dom --save
```

## API
#### props属性
|属性名|说明|类型|默认值|
|:------|:------|:------|:------|
|width|宽|`number`|-|
|height|高|`number`|-|
|disableMove|是否禁止移动|`boolean`|false|
|disableScale|是否禁止缩放|`boolean`|false|
|scaleStep|宽|`number`|0.1|
|minWH|dom被缩小到的最小的宽高尺寸|`number`|1|
|maxWH|dom被放大到的最大的宽高尺寸|`number`|Infinity|

#### 插槽
|插槽名|说明|
|:------|:------|
|default|自定义默认内容|

#### 方法与属性
- 获取鼠标相对于el的坐标
```typescript
/**
 * 获取鼠标相对于el的坐标
 * @returns [x, y]
 */
getPosition(e: MouseEvent): number[]
```

- `transfer2window` 参考[transfer-to-window](https://www.npmjs.com/package/transfer-to-window)


## 使用
```vue
<template>
  <transform-dom :width="1024" :height="1024">
    <div class="inner">
      inner dom
    </div>
  </transform-dom>
</template>
```
