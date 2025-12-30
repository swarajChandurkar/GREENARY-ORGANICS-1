/**
 * WEBSITE CONTENT CONFIGURATION
 * ==========================================
 * Edit this file to change website content.
 * No technical knowledge required.
 */

const websiteData = {
    // ============================
    // HERO SECTION (Main Slider)
    // ============================
    hero: {
        // The rotating products in the top banner
        slides: [
            {
                id: "pot-mixture",
                name: "POT MIXTURE",
                subtitle: "Ready to Use • Balanced Nutrition",
                description: "The perfect start for your plants. A balanced blend of soil, cocopeat, and vermicompost, ready to use straight out of the bag.",
                themeColor: "#8D6E63",
                frameDir: "frames/pot-mixture",
                frameCount: 192
            },
            {
                id: "vermicompost",
                name: "VERMICOMPOST",
                subtitle: "100% Natural • Organic Fertilizer",
                description: "A nutrient-rich organic manure produced using earthworms. It improves soil structure, fertility, and crop productivity naturally. Where Soil Meets Sustainability.",
                themeColor: "#d4a53c", // Gold accent

                // Technical settings for animation
                frameDir: "frames/vermicompost", // Folder containing animation frames
                frameCount: 192,     // Number of images in the sequence
                experienceUrl: "experience.html?id=vermicompost" // Link to story mode
            }
        ]
    },

    // ============================
    // PRODUCT LIST (Grid)
    // ============================
    products: [
        {
            id: 'vermicompost',
            name: 'Vermicompost (Gaandul Khat)',
            price: '50',
            unit: 'per kg',
            image: 'assets/product-showcase.jpg',
            description: 'Greenary Organics Vermicompost is a nutrient-rich organic manure produced using earthworms. It improves soil structure, fertility, and crop productivity naturally.',
            url: 'product.html?id=vermicompost',
            benefits: [
                'Improves soil aeration and texture',
                'Enhances water retention capacity',
                'Rich in beneficial microorganisms',
                'Promotes faster root growth'
            ]
        },
        {
            id: 'cow-dung-manure',
            name: 'Cow Dung Manure',
            price: '40',
            unit: 'per kg',
            image: 'assets/cow-dung-manure.jpg',
            description: 'Aged and decomposed Cow Dung Manure, perfect for vegetable gardening and flowering plants.',
            url: 'product.html?id=cow-dung-manure',
            benefits: [
                'High nitrogen content for lush growth',
                'Fully decomposed and odor-free',
                'Improves soil fertility instantly',
                'Suitable for all home gardens'
            ]
        },
        {
            id: 'pot-mixture',
            name: 'Pot Mixture with Pot',
            price: '250',
            unit: 'per unit',
            image: 'assets/pot-mixture.jpg',
            description: 'Ready-to-use Potting Mix that comes with a premium pot. A balanced blend of soil, cocopeat, and vermicompost.',
            url: 'product.html?id=pot-mixture',
            benefits: [
                'Ready to use - just add plants',
                'Balanced pH and nutrition',
                'Includes high-quality pot',
                'Excellent drainage provided'
            ]
        },
        {
            id: 'cow-dung-cake',
            name: 'Cow Dung Cake',
            price: '15',
            unit: 'per cake',
            image: 'assets/cow-dung-cakes.jpg',
            description: 'Pure and natural Cow Dung Cakes, traditionally used for Hawan, Pooja, and as a natural fuel.',
            url: 'product.html?id=cow-dung-cake',
            benefits: [
                '100% natural and sun-dried',
                'Ideal for religious ceremonies',
                'Eco-friendly fuel source',
                'Rich source of organic matter'
            ]
        },
        {
            id: 'green-gifts',
            name: 'Corporate Green Gifts',
            price: 'Custom',
            unit: 'orders',
            image: 'assets/green-gifts.jpg',
            description: 'Air-purifying plants and low-maintenance green gifts. The ideal corporate gifting option for modern offices.',
            url: '#contact',
            benefits: [
                'Air-purifying plants',
                'Low maintenance required',
                'Perfect for office desks',
                'Eco-friendly gifting'
            ]
        }
    ],

    // ============================
    // CONTACT INFORMATION
    // ============================
    contact: {
        phone: "919022166328", // Format for WhatsApp link specificially
        displayPhone: "90221 66328",
        email: "contact@greenaryorganics.com",
        instagram: "https://instagram.com/greenary_organics",
        whatsappMessage: "I am interested to buy your products"
    }
};
