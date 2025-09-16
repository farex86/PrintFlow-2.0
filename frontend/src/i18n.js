import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.dashboard": "Dashboard",
      "nav.projects": "Projects",
      "nav.kanban": "Kanban Board",
      "nav.printJobs": "Print Jobs",
      "nav.invoices": "Invoices",
      "nav.calendar": "Calendar",
      "nav.analytics": "Analytics",
      "nav.settings": "Settings",

      // Common
      "common.loading": "Loading...",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.delete": "Delete",
      "common.edit": "Edit",
      "common.view": "View",
      "common.create": "Create",
      "common.update": "Update",
      "common.search": "Search",
      "common.filter": "Filter",
      "common.export": "Export",
      "common.import": "Import",
      "common.print": "Print",
      "common.download": "Download",
      "common.upload": "Upload",
      "common.submit": "Submit",
      "common.confirm": "Confirm",
      "common.yes": "Yes",
      "common.no": "No",

      // Status
      "status.active": "Active",
      "status.inactive": "Inactive",
      "status.pending": "Pending",
      "status.completed": "Completed",
      "status.cancelled": "Cancelled",
      "status.overdue": "Overdue",

      // Priority
      "priority.low": "Low",
      "priority.medium": "Medium",
      "priority.high": "High",
      "priority.urgent": "Urgent",

      // Currency
      "currency.AED": "AED",
      "currency.USD": "USD",
      "currency.EUR": "EUR",
      "currency.SAR": "SAR",
      "currency.EGP": "EGP",
      "currency.SDG": "SDG",

      // Dashboard
      "dashboard.welcome": "Welcome to PrintFlow",
      "dashboard.totalProjects": "Total Projects",
      "dashboard.activeTasks": "Active Tasks",
      "dashboard.pendingInvoices": "Pending Invoices",
      "dashboard.revenue": "Revenue",

      // Projects
      "projects.title": "Projects",
      "projects.create": "Create Project",
      "projects.name": "Project Name",
      "projects.description": "Description",
      "projects.client": "Client",
      "projects.deadline": "Deadline",
      "projects.budget": "Budget",
      "projects.status": "Status",
      "projects.progress": "Progress",

      // Messages
      "messages.success.created": "Created successfully",
      "messages.success.updated": "Updated successfully",
      "messages.success.deleted": "Deleted successfully",
      "messages.error.generic": "Something went wrong",
      "messages.error.network": "Network error",
      "messages.error.validation": "Please check your input",
    }
  },
  ar: {
    translation: {
      // Navigation
      "nav.dashboard": "لوحة القيادة",
      "nav.projects": "المشاريع",
      "nav.kanban": "لوحة كانبان",
      "nav.printJobs": "أعمال الطباعة",
      "nav.invoices": "الفواتير",
      "nav.calendar": "التقويم",
      "nav.analytics": "التحليلات",
      "nav.settings": "الإعدادات",

      // Common
      "common.loading": "جاري التحميل...",
      "common.save": "حفظ",
      "common.cancel": "إلغاء",
      "common.delete": "حذف",
      "common.edit": "تعديل",
      "common.view": "عرض",
      "common.create": "إنشاء",
      "common.update": "تحديث",
      "common.search": "بحث",
      "common.filter": "تصفية",
      "common.export": "تصدير",
      "common.import": "استيراد",
      "common.print": "طباعة",
      "common.download": "تحميل",
      "common.upload": "رفع",
      "common.submit": "إرسال",
      "common.confirm": "تأكيد",
      "common.yes": "نعم",
      "common.no": "لا",

      // Status
      "status.active": "نشط",
      "status.inactive": "غير نشط",
      "status.pending": "قيد الانتظار",
      "status.completed": "مكتمل",
      "status.cancelled": "ملغي",
      "status.overdue": "متأخر",

      // Priority
      "priority.low": "منخفض",
      "priority.medium": "متوسط",
      "priority.high": "عالي",
      "priority.urgent": "عاجل",

      // Currency
      "currency.AED": "درهم إماراتي",
      "currency.USD": "دولار أمريكي",
      "currency.EUR": "يورو",
      "currency.SAR": "ريال سعودي",
      "currency.EGP": "جنيه مصري",
      "currency.SDG": "جنيه سوداني",

      // Dashboard
      "dashboard.welcome": "مرحباً بك في PrintFlow",
      "dashboard.totalProjects": "إجمالي المشاريع",
      "dashboard.activeTasks": "المهام النشطة",
      "dashboard.pendingInvoices": "الفواتير المعلقة",
      "dashboard.revenue": "الإيرادات",

      // Projects
      "projects.title": "المشاريع",
      "projects.create": "إنشاء مشروع",
      "projects.name": "اسم المشروع",
      "projects.description": "الوصف",
      "projects.client": "العميل",
      "projects.deadline": "الموعد النهائي",
      "projects.budget": "الميزانية",
      "projects.status": "الحالة",
      "projects.progress": "التقدم",

      // Messages
      "messages.success.created": "تم الإنشاء بنجاح",
      "messages.success.updated": "تم التحديث بنجاح",
      "messages.success.deleted": "تم الحذف بنجاح",
      "messages.error.generic": "حدث خطأ ما",
      "messages.error.network": "خطأ في الشبكة",
      "messages.error.validation": "يرجى التحقق من البيانات المدخلة",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
