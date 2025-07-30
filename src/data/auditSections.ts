export interface AuditItem {
  id: string;
  title: string;
  description: string;
  status?: 'pass' | 'fail' | 'optional' | null;
  explanation?: string;
  image?: File | null;
}

export interface AuditSection {
  id: string;
  title: string;
  description: string;
  items: AuditItem[];
}

export const auditSections: AuditSection[] = [
  {
    id: 'homepage',
    title: 'Homepage',
    description: 'Critical first impression and navigation elements',
    items: [
      {
        id: 'hp-1',
        title: 'Clear Value Proposition (above the fold)',
        description: 'Visitors understand what you offer within 5 seconds'
      },
      {
        id: 'hp-2',
        title: 'Easy-to-find Call to Action (CTA)',
        description: 'Primary CTA is visible and compelling'
      },
      {
        id: 'hp-3',
        title: 'Visual hierarchy (text size, color contrast, image placement)',
        description: 'Content is organized with clear visual importance'
      },
      {
        id: 'hp-4',
        title: 'Fast loading time (<3 seconds)',
        description: 'Page loads quickly on desktop and mobile'
      },
      {
        id: 'hp-5',
        title: 'Mobile responsive design',
        description: 'Site adapts well to all screen sizes'
      },
      {
        id: 'hp-6',
        title: 'Trust signals (reviews, certifications, testimonials)',
        description: 'Social proof and credibility indicators are visible'
      },
      {
        id: 'hp-7',
        title: 'Minimal distractions (no auto-play videos, popups)',
        description: 'Clean interface without annoying interruptions'
      }
    ]
  },
  {
    id: 'navigation',
    title: 'Navigation & Structure',
    description: 'Site architecture and user flow optimization',
    items: [
      {
        id: 'nav-1',
        title: 'Intuitive menu and category structure',
        description: 'Clear navigation with logical organization'
      },
      {
        id: 'nav-2',
        title: 'Search functionality works and returns relevant results',
        description: 'Search feature is functional and useful'
      },
      {
        id: 'nav-3',
        title: 'Breadcrumbs for easy backtracking',
        description: 'Users can track their location within the site'
      },
      {
        id: 'nav-4',
        title: 'No broken links or 404 errors',
        description: 'All internal links function properly'
      },
      {
        id: 'nav-5',
        title: 'Sticky or visible header on scroll',
        description: 'Navigation remains accessible while scrolling'
      }
    ]
  },
  {
    id: 'product-service',
    title: 'Product Pages (or Service Pages)',
    description: 'Content that drives purchase decisions',
    items: [
      {
        id: 'ps-1',
        title: 'Clear product/service descriptions',
        description: 'Detailed, benefit-focused descriptions of offerings'
      },
      {
        id: 'ps-2',
        title: 'High-quality images or videos',
        description: 'Professional visuals showcase products effectively'
      },
      {
        id: 'ps-3',
        title: 'Pricing and CTA clearly visible',
        description: 'Price points and purchase buttons are prominent'
      },
      {
        id: 'ps-4',
        title: 'Product reviews and ratings visible',
        description: 'Customer feedback and ratings are displayed'
      },
      {
        id: 'ps-5',
        title: 'Option to zoom or see more product angles',
        description: 'Interactive product visualization available'
      },
      {
        id: 'ps-6',
        title: 'Delivery or guarantee information clearly stated',
        description: 'Shipping and warranty details are accessible'
      },
      {
        id: 'ps-7',
        title: 'Related Product Section to give Customers an alternative while browsing the products',
        description: 'Cross-selling opportunities are presented effectively'
      }
    ]
  },
  {
    id: 'cart-checkout',
    title: 'Cart & Checkout Process',
    description: 'Critical conversion funnel optimization',
    items: [
      {
        id: 'cc-1',
        title: 'Cart is easily accessible and editable',
        description: 'Shopping cart can be viewed and modified easily'
      },
      {
        id: 'cc-2',
        title: 'Progress bar during checkout',
        description: 'Multi-step checkout shows current progress'
      },
      {
        id: 'cc-3',
        title: 'Minimal steps (ideally <4 steps)',
        description: 'Checkout process is streamlined and efficient'
      },
      {
        id: 'cc-4',
        title: 'Guest checkout available',
        description: 'Users can purchase without creating account'
      },
      {
        id: 'cc-5',
        title: 'Trust badges (SSL, payment method logos)',
        description: 'Security indicators build customer confidence'
      },
      {
        id: 'cc-6',
        title: 'Clear shipping, return, and payment info',
        description: 'All transaction details are transparent'
      }
    ]
  },
  {
    id: 'forms-leads',
    title: 'Forms & Lead Capture',
    description: 'Conversion form optimization',
    items: [
      {
        id: 'fl-1',
        title: 'Simple and short forms',
        description: 'Forms are concise and user-friendly'
      },
      {
        id: 'fl-2',
        title: 'Only essential fields required',
        description: 'Minimal required information requested'
      },
      {
        id: 'fl-3',
        title: 'Error validation and clear instructions',
        description: 'Form guidance and error handling work well'
      },
      {
        id: 'fl-4',
        title: 'Visible privacy policy or trust signal',
        description: 'Data protection assurances are provided'
      },
      {
        id: 'fl-5',
        title: 'Confirmation message or thank you page',
        description: 'Users receive clear submission confirmation'
      }
    ]
  },
  {
    id: 'speed-performance',
    title: 'Speed & Performance',
    description: 'Technical optimization for better user experience',
    items: [
      {
        id: 'sp-1',
        title: 'Website loads in <3 seconds',
        description: 'Fast loading times across all pages'
      },
      {
        id: 'sp-2',
        title: 'Optimize images and scripts',
        description: 'Media and code are compressed for speed'
      },
      {
        id: 'sp-3',
        title: 'Minimal third-party scripts',
        description: 'External scripts do not slow down the site'
      },
      {
        id: 'sp-4',
        title: 'Lazy load images or use CDN',
        description: 'Advanced loading techniques implemented'
      }
    ]
  },
  {
    id: 'mobile-optimization',
    title: 'Mobile Optimization',
    description: 'Mobile-first design and functionality',
    items: [
      {
        id: 'mo-1',
        title: 'Mobile-friendly design and UI',
        description: 'Interface works well on mobile devices'
      },
      {
        id: 'mo-2',
        title: 'Clickable elements are spaced well',
        description: 'Touch targets are appropriately sized'
      },
      {
        id: 'mo-3',
        title: 'Fast loading speed on mobile',
        description: 'Mobile pages load quickly'
      },
      {
        id: 'mo-4',
        title: 'Forms are easy to fill on mobile',
        description: 'Mobile form experience is optimized'
      }
    ]
  },
  {
    id: 'analytics-tracking',
    title: 'Analytics & Tracking',
    description: 'Data collection and conversion measurement',
    items: [
      {
        id: 'at-1',
        title: 'Google Analytics or similar tool installed',
        description: 'Web analytics tracking is properly configured'
      },
      {
        id: 'at-2',
        title: 'Conversion tracking setup',
        description: 'Key actions are tracked as conversions'
      },
      {
        id: 'at-3',
        title: 'Heatmaps or session recordings enabled',
        description: 'User behavior is visually tracked'
      },
      {
        id: 'at-4',
        title: 'Funnel analysis implemented',
        description: 'Conversion paths are monitored and analyzed'
      }
    ]
  },
  {
    id: 'content-seo',
    title: 'Content & SEO Basics',
    description: 'Content quality and search optimization',
    items: [
      {
        id: 'cs-1',
        title: 'Unique, compelling content',
        description: 'Original content that serves user needs'
      },
      {
        id: 'cs-2',
        title: 'Clear headings and subheadings',
        description: 'Content hierarchy is well-structured'
      },
      {
        id: 'cs-3',
        title: 'Meta titles and descriptions optimized',
        description: 'SEO-friendly page metadata implemented'
      },
      {
        id: 'cs-4',
        title: 'Internal linking structure in place',
        description: 'Related content is appropriately cross-linked'
      },
      {
        id: 'cs-5',
        title: 'Alt text for all images',
        description: 'Images have descriptive alternative text'
      }
    ]
  },
  {
    id: 'trust-social-proof',
    title: 'Trust & Social Proof',
    description: 'Building credibility and confidence',
    items: [
      {
        id: 'ts-1',
        title: 'Visible testimonials or reviews',
        description: 'Customer feedback is prominently displayed'
      },
      {
        id: 'ts-2',
        title: 'Partner or media logos',
        description: 'Third-party endorsements are shown'
      },
      {
        id: 'ts-3',
        title: 'Active social media presence linked',
        description: 'Social media profiles are connected and active'
      },
      {
        id: 'ts-4',
        title: 'Blog or educational content available',
        description: 'Value-added content builds authority'
      }
    ]
  }
];