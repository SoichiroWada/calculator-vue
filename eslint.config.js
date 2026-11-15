import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  { ignores: ['dist/**', '.firebase/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['src/**/*.{js,mjs,vue}'],
    languageOptions: { globals: { window: 'readonly' } }
  }
]
