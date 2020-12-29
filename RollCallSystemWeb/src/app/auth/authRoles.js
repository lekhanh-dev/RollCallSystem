export const authRoles = {
  sa: ['ROLE_ADMIN'], // Only Super Admin has access
  admin: ['ROLE_ADMIN', 'ROLE_TEACHER'], // Only SA & Admin has access
  editor: ['ROLE_ADMIN', 'ROLE_TEACHER', 'ROLE_USER'], // Only SA & Admin & Editor has access
  guest: ['SA', 'ADMIN', 'EDITOR', 'GUEST'] // Everyone has access
}

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin <----------------
//   }
// ];