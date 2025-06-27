// ✅ Menu for regular users (patients)
export const userMenu = [
  {
    name: "HOME",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Appointments",
    path: "/appointments",
    icon: "fa-solid fa-list",
  },
  {
    name: "Apply Doctor",
    path: "/apply-doctor",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "fa-solid fa-user",
  },
];

// ✅ Menu for admins (manage doctors/users)
export const adminMenu = [
  {
    name: "HOME",
    path: "/",
    icon: "fa-solid fa-house",
  },
  {
    name: "Doctors",
    path: "/admin/doctors",
    icon: "fa-solid fa-user-doctor",
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: "fa-solid fa-user",
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "fa-solid fa-user",
  },
];
