import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Breadcrumb } from "antd"; // O'zingizga kerakli komponentni import qiling

const pathNameMap = {
  "": "Bosh sahifa",
  tasma: "Tasma",
  details: "Post tafsilotlari",
  search: "Qidiruv",
  news: "Yangiliklar",
  communities: "Jamiyatlar",
  create: "Yaratish",
  profile: "Profil",
  settings: "Sozlamalar",
  account: "Hisob",
  privacy: "Maxfiylik",
  notifications: "Bildirishnomalar",
  blacklist: "Qora ro'yxat",
  user: "Foydalanuvchi",
  report: "Shikoyat",
  block: "Bloklash",
  inbox: "Xabarlar",
  drafts: "Qoralamalar",
  createpost: "Post yaratish",
  admin: "Admin panel",
  home: "Boshqaruv paneli",
  "chat-yozishmalar": "Chat yozishmalar",
  "chat-yangi": "Yangi chat",
  "post-yangi": "Yangi post",
  "post-stat": "Post statistikasi",
  "jamiyatlar-barchasi": "Jamiyatlar",
  "jamiyatlar-yaratish": "Jamiyat yaratish",
  "foy-umumiy": "Foydalanuvchilar",
  "foy-postlar": "Foydalanuvchi postlari",
  "foy-shikoyat": "Shikoyatlar",
  "hisob-tolov": "To'lovlar",
  "hisob-stat": "Hisob statistikasi",
  "admin-royxat": "Adminlar ro‘yxati",
  "admin-ruxsat": "Ruxsatlar",
  "yordam-qollab": "Qo‘llab-quvvatlash",
  "yordam-savollar": "Savol-javoblar",
};

const DynamicBreadcrumb = () => {
  const router = useRouter(); // useRouter hookini chaqirish
  const pathSnippets = router.asPath
    ? router.asPath.split("/").filter((i) => i)
    : []; // current pathni olish

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const key = pathSnippets[index];

    return {
      key: url,
      title: <Link href={url}>{pathNameMap[key] || key}</Link>,
    };
  });

  // Breadcrumbning yangi usulidan foydalanish
  const breadcrumbItems = [
    {
      key: "/",
      title: <Link href="/">Bosh sahifa</Link>,
    },
    ...extraBreadcrumbItems,
  ];

  return <Breadcrumb items={breadcrumbItems} />;
};

export default DynamicBreadcrumb;
