# vue-use-chrome-storage

This package is used to integrate the chrome storage with the vue framework through this hook. 

# Install

```bash
npm i vue-use-chrome-storage
```

# Example Usage 
```ts
<template>
    <button
        @click="onClick"
    >
        Hide
    </button>
    <p v-if="chromeStorage.state.visible">
        Visible
    </p>
</template>
<script setup lang="ts">
import { useChromeStorage } from 'vue-use-chrome-storage';

const chromeStorage = useChromeStorage({id: 'visible', {
    visible: true
}, 'local'});

const onClick = () => {
    chromeStorage.state.visible = !chromeStorage.state.visible;
};
</script>
```

# Remark

1. Works only with objects in store.
2. Not fully tested
    * Not tested with a managed store type
    * Error catching was also not tested
