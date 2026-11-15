<template>
  <router-view />
</template>

<script>
export default { name: 'App' }
</script>

<style>
* { box-sizing: border-box; }
html { background: #000; color-scheme: dark; }
body { margin: 0; font-family: 'Saira', 'Segoe UI', sans-serif; }
button, input { font: inherit; }
button { touch-action: manipulation; }
button:focus-visible, input:focus-visible { outline: 3px solid #73e3d4; outline-offset: 4px; }
</style>
