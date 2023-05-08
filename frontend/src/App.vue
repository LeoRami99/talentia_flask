<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import NavbarIndex from './components/navbar/NavbarIndex.vue'
import FooterIndex from './components/footer/FooterIndex.vue'
</script>

<template>
  <div class="mdk-header-layout js-mdk-header-layout">
    <!-- Header -->
    <div id="header" class="mdk-header js-mdk-header mb-0" data-fixed data-effects="">
      <div class="mdk-header__content">

        <!-- Navbar -->

        <NavbarIndex  class="btn"/>

        <!-- // END Navbar -->

      </div>
    </div>

    <!-- // END Header -->

    <!-- Header Layout Content -->
    <div class="mdk-header-layout__content page-content ">

      <!-- Replace this with your page content -->

      <div class="container page__container flex d-flex my-32pt">
          <div class="container" style="height: 50vh;">
            <H1>hola</H1>
            <button @click="abrir">
              Abrir
            </button>
          </div>
      </div>

      <!-- // END Replace this with your page content -->

    </div>
    <!-- // END Header Layout Content -->

    <!-- Footer -->

    <FooterIndex />

    <!-- // END Footer -->

  </div>
  <!-- // END Header Layout -->

  <!-- Drawer -->
  <div class="mdk-drawer js-mdk-drawer" id="default-drawer" data-align="start" data-position="left" data-domfactory-upgraded="mdk-drawer" :data-opened="drawer ? '' : null"><div class="mdk-drawer__scrim" style="" @click="drawer = false"></div>
        
  <div class="mdk-drawer__content" >
            <div class="sidebar sidebar-dark-pickled-bluewood sidebar-left " data-perfect-scrollbar>

                <!-- Sidebar Content -->

                <a href="index.html" class="sidebar-brand ">
                    <!-- <img class="sidebar-brand-icon" src="../../public/images/illustration/student/128/white.svg" alt="Luma"> -->

                    <span class="avatar avatar-xl sidebar-brand-icon h-auto">

                        <span class="avatar-title rounded bg-primary"><img
                                src="../images/illustration/student/128/white.svg" class="img-fluid" alt="logo" /></span>

                    </span>

                    <span>Luma</span>
                </a>

                <div class="application-shell-content">
                    <span class="sidebar-text">Hola</span>
                </div>

                <!-- // END Sidebar Content -->

            </div>
        </div>
    </div>
</template>
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  components: {
    NavbarIndex,
  },
  data() {
    return {
      drawer: false,
    };
  },
  mounted() {
    
  },
  methods: {
    abrir() {
      // data-opened="" agregar esta propiedad al div con id="default-drawer"
      this.drawer = !this.drawer;
      
    },
    cerrar(event) {
    if (this.drawer) {
      const target = event.target.closest('#default-drawer');
      if (!target) {
        this.drawer = "";
      }
    }
  },
    // hacer la funcion para cerrar el drawer cuando se haga click en cualquier parte de la pantalla


  },
  beforeMount() {
  document.removeEventListener('click', this.cerrar);
}
  
});
</script>



