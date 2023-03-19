import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return { sidebarIsOpened: true }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    toggleSidebar() {
      this.sidebarIsOpened = !this.sidebarIsOpened
    },
  },
})
