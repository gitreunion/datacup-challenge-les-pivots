export default defineNuxtRouteMiddleware((to, from) => {
    ("to", to);
  if (to.path === "/") {
    return navigateTo("/accueil");
  }
});
