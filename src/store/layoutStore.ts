import { defineStore } from 'pinia'
import { Resource, SidebarContentComponents } from '../types'

import AllResourcesInSidebar from '../components/dashboard/AllResourcesInSidebar.vue'
import OneDetailedResourcesInSidebar from '../components/dashboard/OneDetailedResourcesInSidebar.vue'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      sidebarIsWide: false,
      openedResource: null as Resource | null,
      currentContent: AllResourcesInSidebar,
    }
  },
  actions: {
    toggleSidebar() {
      this.sidebarIsWide = !this.sidebarIsWide
    },
    setSmallSidebar() {
      this.sidebarIsWide = false
    },
    setWideSidebar() {
      this.sidebarIsWide = true
    },
    setResource(resource: Resource) {
      this.openedResource = resource
    },
    setContentOfSidebar(nameOfComponent: SidebarContentComponents) {
      const components = {
        [SidebarContentComponents.AllResourcesInSidebar]: AllResourcesInSidebar,
        [SidebarContentComponents.OneDetailedResourcesInSidebar]: OneDetailedResourcesInSidebar,
      }
      this.currentContent = components[nameOfComponent]
    }
  },
})
