<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore();

onMounted(() => {
  const userInfo = useCookie('user_info');
  if (userInfo.value) {
    try {
      const user = JSON.parse(userInfo.value as string);
      auth.setUser(user);
    } catch (err) {
      console.error('Error parsing user info from cookie:', err);
    }
  }
});
</script>