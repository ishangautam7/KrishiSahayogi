import axios from 'axios';
import * as cheerio from 'cheerio';

// Static resources (Forms) that are useful to keep even if scraping fails or as supplementary data
const STATIC_FORMS = [
    {
        "type": "form",
        "title": "कार्यक्रम अनुगमन FORMAT.",
        "link": "https://doanepal.gov.np/actfile/अनुगमन Format_1733470536.xlsx",
        "date": "2024-12-06",
        "is_subsidy": false
    },
    {
        "type": "form",
        "title": "भ्रमण आदेश फाराम",
        "link": "https://doanepal.gov.np/actfile/भ्रमण आदेश फाराम_1713775016.doc",
        "date": "2024-04-22",
        "is_subsidy": false
    },
    {
        "type": "form",
        "title": "बिदाको  निवेदन",
        "link": "https://doanepal.gov.np/actfile/बिदाको form खाली_1713774814.docx",
        "date": "2024-04-22",
        "is_subsidy": false
    },
    {
        "type": "form",
        "title": "माग फाराम",
        "link": "https://doanepal.gov.np/actfile/MAAG FARAM_1713775071.docx",
        "date": "2024-04-22",
        "is_subsidy": false
    },
    {
        "type": "form",
        "title": "भन्सार छुट सम्बन्धी आवश्यक कागजात र प्रकृया",
        "link": "https://doanepal.gov.np/actfile/भन्सार छुटका लागि आवश्यक कागजात_nep_1693725946.pdf",
        "date": "2023-09-03",
        "is_subsidy": false
    },
    {
        "type": "form",
        "title": "सम्पत्ति विवरण फारम",
        "link": "https://doanepal.gov.np/actfile/Sampati bibaran all_nep_1626932601.docx",
        "date": "2021-07-22",
        "is_subsidy": false
    }
];

// User provided AITC data (since live scraping is currently blocked/404)
const AITC_STATIC_DATA = [
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "अनुदानग्राहीको विवरण सार्वजनिकिकरणको लाग गठित समितिको प्रतिवेदन",
        "link": "https://aitc.gov.np/uploads/documents/1-Subsidy-Report-2081-FINALpdf-5550-216-1736748697.pdf",
        "date": "2025-01-12",
        "is_subsidy": true
    },
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "Statement of Expenditure from 15/01/2024 to 13/05/2024 Demand Based Producers Grant Program",
        "link": "https://drive.google.com/file/d/1sLS_jKDGZHNLI5PbcoW7S2VgPaVYvRRA/view",
        "date": "2025-01-12",
        "is_subsidy": true
    },
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "List of Small grants supported in all four cluster from FY 2077/78 to 2079/80",
        "link": "https://drive.google.com/file/d/1e03YMu1Jbq8hg05ioGbmQouRSvhsagqV/view",
        "date": "2025-01-12",
        "is_subsidy": true
    },
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "List of Matching grants supported in all four cluster from FY 2077/78 to 2079/80",
        "link": "https://drive.google.com/file/d/1sIEmK72NjTvkbuSlh1RQuPKh0G_gSAfH/view",
        "date": "2025-01-12",
        "is_subsidy": true
    },
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "रानी जमरा आ.व. २०७६- २०८० विविध पशुपन्छी विकास सहयोग कार्यक्रम रानी जमरा",
        "link": "https://drive.google.com/file/d/1jZFSbAEyomQbHHMgaAaKUIE_5KrBP1ag/view",
        "date": "2025-01-12",
        "is_subsidy": true
    },
    {
        "source": "AITC",
        "type": "subsidy_details",
        "title": "PMAMP5 Anudaan Book 2079-80",
        "link": "https://drive.google.com/file/d/1_WCyuEtVjWPxfDga7LxkA53I9wYpXN8x/view",
        "date": "2025-01-12",
        "is_subsidy": true
    }
];

const fetchDoanepalNotices = async () => {
    try {
        const homepageResponse = await axios.get('https://doanepal.gov.np/ne/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            timeout: 8000
        });

        const $home = cheerio.load(homepageResponse.data);
        let noticeBoardUrl = '';

        $home('li.menu-item').each((i, el) => {
            const menuText = $home(el).find('> a').text().trim();
            if (menuText.includes('सूचना पाटी')) {
                $home(el).find('ul.dropdown-menu li a').each((j, subEl) => {
                    if ($home(subEl).text().includes('सूचना तथा समाचार')) {
                        noticeBoardUrl = $home(subEl).attr('href');
                    }
                });
            }
        });

        if (!noticeBoardUrl) {
            console.log("Could not find dynamic notice URL, falling back to known URL.");
            noticeBoardUrl = 'https://doanepal.gov.np/ne/notice-board/15/2024/1439342/';
        }

        console.log(`Fetching notices from: ${noticeBoardUrl}`);

        const response = await axios.get(noticeBoardUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            timeout: 15000
        });

        const $ = cheerio.load(response.data);
        const notices = [];

        $('#example tbody tr').each((i, el) => {
            if (i > 30) return;

            const titleTd = $(el).find('td').eq(1);
            const dateTd = $(el).find('td').eq(3);
            const linkTd = $(el).find('td').eq(4);

            const title = titleTd.text().trim();
            const date = dateTd.text().trim();
            const link = linkTd.find('a').attr('href');

            if (title && link) {
                notices.push({
                    source: "DOA",
                    type: title.includes('अनुदान') ? 'subsidy_details' : 'notice',
                    title: title,
                    link: link.startsWith('http') ? link : `https://doanepal.gov.np${link}`,
                    date: date || new Date().toISOString().split('T')[0],
                    is_subsidy: title.includes('अनुदान') || title.includes('Subsidy')
                });
            }
        });
        return notices;
    } catch (error) {
        console.error("DOA Scraping error:", error.message);
        return [];
    }
};

const fetchAitcNotices = async () => {
    // Note: Live scraping is currently blocked by 404/Cloudflare on server side.
    // Returning verified static data for now.
    // To enable live scraping in future:
    // 1. Resolve URL (likely https://aitc.gov.np/notice/news-notices)
    // 2. Use puppeteer or valid headers to bypass protection
    return AITC_STATIC_DATA;
};

// Placeholder for Department of Livestock Services
const fetchLivestockNotices = async () => {
    // Implement similar logic if DLS website becomes accessible
    return [];
};

export const getNotices = async (req, res) => {
    try {
        // Run scrapers in parallel
        const [doaNotices, aitcNotices, livestockNotices] = await Promise.all([
            fetchDoanepalNotices(),
            fetchAitcNotices(),
            fetchLivestockNotices()
        ]);

        const allNotices = [
            ...doaNotices,
            ...aitcNotices,
            ...livestockNotices,
            ...STATIC_FORMS
        ];

        // Fallback or empty check
        if (allNotices.length === 0) {
            return res.status(200).json(STATIC_FORMS);
        }

        res.status(200).json(allNotices);

    } catch (error) {
        console.error("General Scraping error:", error.message);
        res.status(200).json(STATIC_FORMS);
    }
};
