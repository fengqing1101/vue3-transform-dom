# vue-tranform-dom

A component based on Vue that can scale and drag dom.

## Install
```sh
npm install vue3-transform-dom --save
```

## Usage

```vue
<template>
  <transform-dom :width="1024" :height="1024">
    <template #inner>
        <div class="inner">
          inner dom
        </div>
    </template>
    <template #outer>
        <div class="outer">
          outer dom
        </div>
    </template>
  </transform-dom>
</template>
```

### Props
 - width 
   - type: Number
   - description: The width of the dom being transformed.
 - height
   - type: Number
   - description: The height of the dom being transformed.
 - disableMove
   - type: Boolean
   - default: false
   - description: Prohibit move the dom.
 - disableScale 
   - type: Boolean
   - default: false
   - description: Prohibit scale the dom.
 - minScale
   - type: Number
   - default: 0.1
   - description: Minimum zoom ratio of dom.
 - maxScale
   - type: Number
   - default: 10
   - description: Maximum zoom ratio of dom.
 - scaleStep
   - type: Number
   - default: 0.1
   - description: Scale step size.
