<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <h1>Hola</h1>
  <div class="mdk-drawer js-mdk-drawer" id="default-drawer">
    <div class="mdk-drawer__content">
      <div class="sidebar sidebar-dark-pickled-bluewood sidebar-left" data-perfect-scrollbar>

        <!-- Sidebar Content -->

        <a href="index.html" class="sidebar-brand ">
          <!-- <img class="sidebar-brand-icon" src="../../public/images/illustration/student/128/white.svg" alt="Luma"> -->

          <span class="avatar avatar-xl sidebar-brand-icon h-auto">

            <span class="avatar-title rounded bg-primary"><img src="images/illustration/student/128/white.svg"
                class="img-fluid" alt="logo" /></span>

          </span>

          <span>Luma</span>
        </a>

        <div class="application-shell-content">
          <span class="sidebar-text">Add your sidebar content here.</span>
        </div>

        <!-- // END Sidebar Content -->

      </div>
    </div>
  </div>
  
  
</template>


