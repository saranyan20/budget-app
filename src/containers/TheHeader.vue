<template>
  <CHeader with-subheader>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.commit('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.commit('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
    </CHeaderBrand>
      <CBreadcrumbRouter class="border-0 m-1"/>
    
    <CHeaderNav class="d-md-down-none ml-auto">
      <!-- <CHeaderNavItem class="px-3">
        <button 
          @click="() => $store.commit('toggle', 'darkMode')" 
          class="c-header-nav-btn"
        >
          <CIcon v-if="$store.state.darkMode" name="cil-sun"/>
          <CIcon v-else name="cil-moon"/>
        </button>
      </CHeaderNavItem> -->
      <!-- <TheHeaderDropdownNotif/> -->
      <!-- <TheHeaderDropdownTasks/>
      <TheHeaderDropdownMssgs/> -->
      <TheHeaderDropdownAccnt/>
      <!-- <CHeaderNavItem class="px-3">
        <button
          in-header
          class="c-header-nav-btn"
          @click="$store.commit('toggle', 'asideShow')"
        >
          <CIcon size="lg" name="cil-applications-settings" class="mr-2"/>
        </button>
      </CHeaderNavItem> -->
    </CHeaderNav>
 
    
  </CHeader>
</template>

<script>
import TheHeaderDropdownAccnt from './TheHeaderDropdownAccnt'
import TheHeaderDropdownNotif from './TheHeaderDropdownNotif'
import TheHeaderDropdownTasks from './TheHeaderDropdownTasks'
import TheHeaderDropdownMssgs from './TheHeaderDropdownMssgs'

export default {
  name: 'TheHeader',
  components: {
    TheHeaderDropdownAccnt,
    TheHeaderDropdownNotif,
    TheHeaderDropdownTasks,
    TheHeaderDropdownMssgs
  }
}
</script>
