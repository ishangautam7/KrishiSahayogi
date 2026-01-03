export const translations = {
    en: {
        // Navbar
        marketplace: "Marketplace",
        ai_features: "AI Features",
        plantation_guide: "Plantation Guide",
        community_network: "Community Network",
        login_join: "Login / Join",
        logout: "Logout",
        profile: "My Profile",

        // Hero Section
        hero_brand: "Krishi Sahayogi",
        hero_title_gradient: "Future of Farming",
        hero_subtitle: "Empowering farmers with AI-driven insights, disease detection, and a direct-to-consumer marketplace. Grow more, sell better.",
        hero_cta_marketplace: "Go to Marketplace",
        hero_cta_start: "Start Farming Smarter",
        hero_cta_explore: "Explore Features",

        // Farmer Network
        network_header_badge: "Global Network",
        network_header_title: "Connect with Expert Farmers",
        network_header_subtitle: "Share knowledge, trade secrets, and build a stronger agricultural future.",
        network_search_placeholder: "Find by name...",
        network_search_label: "Search Network",
        network_discovery_title: "Discovery",
        network_category_label: "Farmer Category",
        network_start_conversation: "Start Conversation",
        network_no_farmers: "No Farmers Found",
        network_no_farmers_subtitle: "Try adjusting your filters or search query.",
        network_syncing: "Syncing with Network...",

        // Farmer Categories
        cat_all: "All",
        cat_subsistence: "Subsistence",
        cat_commercial: "Commercial",
        cat_hobbyist: "Hobbyist",
        cat_student: "Student",

        // General
        loading: "Loading...",
        search: "Search",
        filter: "Filter",
        location: "Location",

        // Predictors
        fertilizer_prediction: "Fertilizer Prediction",
        crop_recommendation: "Crop Recommendation",
        disease_detection: "Disease Detection",
    },
    ne: {
        // Navbar
        marketplace: "बजार",
        ai_features: "AI सुविधाहरू",
        plantation_guide: "रोपण निर्देशिका",
        community_network: "समुदाय नेटवर्क",
        login_join: "लगइन / सामेल हुनुहोस्",
        logout: "लगआउट",
        profile: "मेरो प्रोफाइल",

        // Hero Section
        hero_brand: "कृषि सहयोगी",
        hero_title_gradient: "खेतीको भविष्य",
        hero_subtitle: "AI-संचालित अन्तर्दृष्टि, रोग पहिचान, र प्रत्यक्ष-उपभोक्ता बजारको साथ किसानहरूलाई सशक्त बनाउँदै। धेरै उब्जाउनुहोस्, राम्रो बेच्नुहोस्।",
        hero_cta_marketplace: "बजारमा जानुहोस्",
        hero_cta_start: "होसियारीपूर्वक खेती सुरु गर्नुहोस्",
        hero_cta_explore: "सुविधाहरू अन्वेषण गर्नुहोस्",

        // Farmer Network
        network_header_badge: "ग्लोबल नेटवर्क",
        network_header_title: "विज्ञ किसानहरूसँग जोडिनुहोस्",
        network_header_subtitle: "ज्ञान साझा गर्नुहोस्, व्यापारका रहस्यहरू आदानप्रदान गर्नुहोस्, र बलियो कृषि भविष्य निर्माण गर्नुहोस्।",
        network_search_placeholder: "नामबाट खोज्नुहोस्...",
        network_search_label: "नेटवर्क खोज्नुहोस्",
        network_discovery_title: "खोज",
        network_category_label: "किसान वर्ग",
        network_start_conversation: "कुराकानी सुरु गर्नुहोस्",
        network_no_farmers: "कुनै किसान भेटिएन",
        network_no_farmers_subtitle: "तपाईंको फिल्टर वा खोज शब्दहरू परिवर्तन गरेर हेर्नुहोस्।",
        network_syncing: "नेटवर्कसँग जोडिदै...",

        // Farmer Categories
        cat_all: "सबै",
        cat_subsistence: "निर्वाहमुखी",
        cat_commercial: "व्यावसायिक",
        cat_hobbyist: "सौखिन",
        cat_student: "विद्यार्थी",

        // General
        loading: "लोड हुँदैछ...",
        search: "खोज्नुहोस्",
        filter: "फिल्टर",
        location: "स्थान",

        // Predictors
        fertilizer_prediction: "मल सिफारिस",
        crop_recommendation: "बाली सिफारिस",
        disease_detection: "रोग पहिचान",
    }
};

export type Language = "en" | "ne";
export type TranslationKey = keyof typeof translations.en;
