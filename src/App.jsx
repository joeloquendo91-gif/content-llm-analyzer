import React, { useState, useEffect, useRef } from 'react';
import { Search, AlertCircle, Info, ChevronDown, BarChart2, Layers, ArrowRight, Zap, X } from 'lucide-react';

// Full Google NLP V1 category list with deep paths
const GOOGLE_CATEGORIES = [
  "/Arts & Entertainment",
  "/Arts & Entertainment/Celebrities & Entertainment News",
  "/Arts & Entertainment/Other",
  "/Arts & Entertainment/Comics & Animation",
  "/Arts & Entertainment/Comics & Animation/Anime & Manga",
  "/Arts & Entertainment/Comics & Animation/Cartoons",
  "/Arts & Entertainment/Comics & Animation/Comics",
  "/Arts & Entertainment/Comics & Animation/Other",
  "/Arts & Entertainment/Entertainment Industry",
  "/Arts & Entertainment/Entertainment Industry/Film & TV Industry",
  "/Arts & Entertainment/Entertainment Industry/Recording Industry",
  "/Arts & Entertainment/Entertainment Industry/Other",
  "/Arts & Entertainment/Events & Listings",
  "/Arts & Entertainment/Events & Listings/Concerts & Music Festivals",
  "/Arts & Entertainment/Events & Listings/Film Festivals",
  "/Arts & Entertainment/Events & Listings/Other",
  "/Arts & Entertainment/Fun & Trivia",
  "/Arts & Entertainment/Humor",
  "/Arts & Entertainment/Movies",
  "/Arts & Entertainment/Music & Audio",
  "/Arts & Entertainment/Music & Audio/Classical Music",
  "/Arts & Entertainment/Music & Audio/Country Music",
  "/Arts & Entertainment/Music & Audio/Dance & Electronic Music",
  "/Arts & Entertainment/Music & Audio/Jazz & Blues",
  "/Arts & Entertainment/Music & Audio/Music Reference",
  "/Arts & Entertainment/Music & Audio/Music Streams & Downloads",
  "/Arts & Entertainment/Music & Audio/Pop Music",
  "/Arts & Entertainment/Music & Audio/Rap & Hip-Hop",
  "/Arts & Entertainment/Music & Audio/Rock Music",
  "/Arts & Entertainment/Music & Audio/Soul & R&B",
  "/Arts & Entertainment/Music & Audio/Other",
  "/Arts & Entertainment/Offbeat",
  "/Arts & Entertainment/Online Media",
  "/Arts & Entertainment/Performing Arts",
  "/Arts & Entertainment/Performing Arts/Dance",
  "/Arts & Entertainment/Performing Arts/Opera",
  "/Arts & Entertainment/Performing Arts/Theater",
  "/Arts & Entertainment/Performing Arts/Other",
  "/Arts & Entertainment/TV & Video",
  "/Arts & Entertainment/TV & Video/TV Commercials",
  "/Arts & Entertainment/TV & Video/TV Shows & Programs",
  "/Arts & Entertainment/TV & Video/Other",
  "/Arts & Entertainment/Visual Art & Design",
  "/Arts & Entertainment/Visual Art & Design/Architecture",
  "/Arts & Entertainment/Visual Art & Design/Art Museums & Galleries",
  "/Arts & Entertainment/Visual Art & Design/Design",
  "/Arts & Entertainment/Visual Art & Design/Painting",
  "/Arts & Entertainment/Visual Art & Design/Photographic & Digital Arts",
  "/Arts & Entertainment/Visual Art & Design/Sculpture",
  "/Arts & Entertainment/Visual Art & Design/Other",
  "/Autos & Vehicles",
  "/Autos & Vehicles/Bicycles & Accessories",
  "/Autos & Vehicles/Boats & Watercraft",
  "/Autos & Vehicles/Commercial Vehicles",
  "/Autos & Vehicles/Motor Vehicles (By Type)",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Cars",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Convertibles",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Coupes",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Minivans & Vans",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Motorcycles",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Off-Road Vehicles",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Pickup Trucks",
  "/Autos & Vehicles/Motor Vehicles (By Type)/SUVs & Crossovers",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Sedans",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Station Wagons",
  "/Autos & Vehicles/Motor Vehicles (By Type)/Other",
  "/Autos & Vehicles/Vehicle Codes & Driving Laws",
  "/Autos & Vehicles/Vehicle Maintenance, Parts & Services",
  "/Autos & Vehicles/Vehicle Maintenance, Parts & Services/Auto Parts & Accessories",
  "/Autos & Vehicles/Vehicle Maintenance, Parts & Services/Auto Repair",
  "/Autos & Vehicles/Vehicle Maintenance, Parts & Services/Other",
  "/Autos & Vehicles/Vehicle Shopping",
  "/Autos & Vehicles/Vehicle Shopping/Used Vehicles",
  "/Autos & Vehicles/Vehicle Shopping/Other",
  "/Beauty & Fitness",
  "/Beauty & Fitness/Beauty Services & Spas",
  "/Beauty & Fitness/Body Art",
  "/Beauty & Fitness/Fashion & Style",
  "/Beauty & Fitness/Fitness",
  "/Beauty & Fitness/Fitness/Bodybuilding",
  "/Beauty & Fitness/Fitness/Exercise & Aerobics",
  "/Beauty & Fitness/Fitness/Other",
  "/Beauty & Fitness/Hair Care",
  "/Beauty & Fitness/Make-Up & Cosmetics",
  "/Beauty & Fitness/Skin & Nail Care",
  "/Beauty & Fitness/Weight Loss",
  "/Books & Literature",
  "/Books & Literature/Children's Literature",
  "/Books & Literature/E-Books",
  "/Books & Literature/Fan Fiction",
  "/Books & Literature/Literary Classics",
  "/Books & Literature/Poetry",
  "/Books & Literature/Other",
  "/Business & Industrial",
  "/Business & Industrial/Advertising & Marketing",
  "/Business & Industrial/Advertising & Marketing/Marketing",
  "/Business & Industrial/Advertising & Marketing/Other",
  "/Business & Industrial/Agriculture & Forestry",
  "/Business & Industrial/Business Finance",
  "/Business & Industrial/Business Finance/Venture Capital",
  "/Business & Industrial/Business Finance/Other",
  "/Business & Industrial/Business Operations",
  "/Business & Industrial/Business Services",
  "/Business & Industrial/Chemicals Industry",
  "/Business & Industrial/Construction & Maintenance",
  "/Business & Industrial/Energy & Utilities",
  "/Business & Industrial/Energy & Utilities/Oil & Gas",
  "/Business & Industrial/Energy & Utilities/Other",
  "/Business & Industrial/Hospitality Industry",
  "/Business & Industrial/Industrial Materials & Equipment",
  "/Business & Industrial/Manufacturing",
  "/Business & Industrial/Metals & Mining",
  "/Business & Industrial/Pharmaceuticals & Biotech",
  "/Business & Industrial/Printing & Publishing",
  "/Business & Industrial/Retail Trade",
  "/Business & Industrial/Small Business",
  "/Business & Industrial/Textiles & Nonwovens",
  "/Business & Industrial/Transportation & Logistics",
  "/Computers & Electronics",
  "/Computers & Electronics/Computer Hardware",
  "/Computers & Electronics/Computer Hardware/Computer Components",
  "/Computers & Electronics/Computer Hardware/Desktop Computers",
  "/Computers & Electronics/Computer Hardware/Drives & Storage",
  "/Computers & Electronics/Computer Hardware/Laptops & Notebooks",
  "/Computers & Electronics/Computer Hardware/Printers, Copiers & Fax",
  "/Computers & Electronics/Computer Hardware/Other",
  "/Computers & Electronics/Computer Security",
  "/Computers & Electronics/Consumer Electronics",
  "/Computers & Electronics/Consumer Electronics/Audio Equipment",
  "/Computers & Electronics/Consumer Electronics/Camera & Photo Equipment",
  "/Computers & Electronics/Consumer Electronics/Car Electronics",
  "/Computers & Electronics/Consumer Electronics/Game Systems & Consoles",
  "/Computers & Electronics/Consumer Electronics/GPS & Navigation",
  "/Computers & Electronics/Consumer Electronics/TV & Video Equipment",
  "/Computers & Electronics/Consumer Electronics/Other",
  "/Computers & Electronics/Electronics & Electrical",
  "/Computers & Electronics/Enterprise Technology",
  "/Computers & Electronics/Enterprise Technology/Data Management",
  "/Computers & Electronics/Enterprise Technology/Other",
  "/Computers & Electronics/Networking",
  "/Computers & Electronics/Networking/Data Formats & Protocols",
  "/Computers & Electronics/Networking/Network Monitoring & Management",
  "/Computers & Electronics/Networking/Other",
  "/Computers & Electronics/Programming",
  "/Computers & Electronics/Programming/Java (Programming Language)",
  "/Computers & Electronics/Programming/Other",
  "/Computers & Electronics/Software",
  "/Computers & Electronics/Software/Business & Productivity Software",
  "/Computers & Electronics/Software/Device Drivers",
  "/Computers & Electronics/Software/Freeware & Shareware",
  "/Computers & Electronics/Software/Graphics & Animation Software",
  "/Computers & Electronics/Software/Multimedia Software",
  "/Computers & Electronics/Software/Operating Systems",
  "/Computers & Electronics/Software/Other",
  "/Finance",
  "/Finance/Accounting & Auditing",
  "/Finance/Banking",
  "/Finance/Credit & Lending",
  "/Finance/Credit & Lending/Credit Cards",
  "/Finance/Credit & Lending/Home Financing",
  "/Finance/Credit & Lending/Student Loans & Grants",
  "/Finance/Credit & Lending/Other",
  "/Finance/Financial Planning & Management",
  "/Finance/Grants, Scholarships & Financial Aid",
  "/Finance/Insurance",
  "/Finance/Insurance/Health Insurance",
  "/Finance/Insurance/Home Insurance",
  "/Finance/Insurance/Life Insurance",
  "/Finance/Insurance/Motor Insurance",
  "/Finance/Insurance/Other",
  "/Finance/Investing",
  "/Finance/Investing/Commodities & Futures Trading",
  "/Finance/Investing/Currencies & Foreign Exchange",
  "/Finance/Investing/Hedge Funds",
  "/Finance/Investing/Mutual Funds",
  "/Finance/Investing/Stocks & Bonds",
  "/Finance/Investing/Other",
  "/Finance/Tax Preparation & Planning",
  "/Food & Drink",
  "/Food & Drink/Beverages",
  "/Food & Drink/Beverages/Coffee & Tea",
  "/Food & Drink/Beverages/Juice",
  "/Food & Drink/Beverages/Soft Drinks",
  "/Food & Drink/Beverages/Water & Water Filters",
  "/Food & Drink/Beverages/Wine, Beer & Spirits",
  "/Food & Drink/Beverages/Other",
  "/Food & Drink/Cooking & Recipes",
  "/Food & Drink/Cooking & Recipes/BBQ & Grilling",
  "/Food & Drink/Cooking & Recipes/Baked Goods",
  "/Food & Drink/Cooking & Recipes/Breakfast Foods",
  "/Food & Drink/Cooking & Recipes/Candy & Sweets",
  "/Food & Drink/Cooking & Recipes/Soups & Stews",
  "/Food & Drink/Cooking & Recipes/Vegetarian Cuisine",
  "/Food & Drink/Cooking & Recipes/Other",
  "/Food & Drink/Food & Grocery Retailers",
  "/Food & Drink/Restaurants",
  "/Games",
  "/Games/Arcade & Coin-Op Games",
  "/Games/Board Games",
  "/Games/Card Games",
  "/Games/Computer & Video Games",
  "/Games/Computer & Video Games/Action & Platform Games",
  "/Games/Computer & Video Games/Fighting Games",
  "/Games/Computer & Video Games/Massively Multiplayer Games",
  "/Games/Computer & Video Games/Simulation Games",
  "/Games/Computer & Video Games/Sports Games",
  "/Games/Computer & Video Games/Strategy Games",
  "/Games/Computer & Video Games/Other",
  "/Games/Gambling",
  "/Games/Online Games",
  "/Games/Roleplaying Games",
  "/Games/Table Games",
  "/Hobbies & Leisure",
  "/Hobbies & Leisure/Clubs & Organizations",
  "/Hobbies & Leisure/Crafts",
  "/Hobbies & Leisure/Merit Prizes & Contests",
  "/Hobbies & Leisure/Outdoors",
  "/Hobbies & Leisure/Outdoors/Fishing",
  "/Hobbies & Leisure/Outdoors/Hiking & Camping",
  "/Hobbies & Leisure/Outdoors/Hunting & Shooting",
  "/Hobbies & Leisure/Outdoors/Other",
  "/Hobbies & Leisure/Radio Control & Modeling",
  "/Hobbies & Leisure/Special Occasions",
  "/Hobbies & Leisure/Special Occasions/Holidays & Seasonal Events",
  "/Hobbies & Leisure/Special Occasions/Other",
  "/Hobbies & Leisure/Water Activities",
  "/Home & Garden",
  "/Home & Garden/Bed & Bath",
  "/Home & Garden/Gardening & Landscaping",
  "/Home & Garden/Home & Interior Decor",
  "/Home & Garden/Home Appliances",
  "/Home & Garden/Home Furnishings",
  "/Home & Garden/Home Improvement",
  "/Home & Garden/Home Safety & Security",
  "/Home & Garden/Kitchen & Dining",
  "/Home & Garden/Nursery & Playroom",
  "/Home & Garden/Parasites & Pest Control",
  "/Home & Garden/Pool & Spa",
  "/Home & Garden/Yard & Patio",
  "/Internet & Telecom",
  "/Internet & Telecom/Email & Messaging",
  "/Internet & Telecom/ISPs",
  "/Internet & Telecom/Mobile & Wireless",
  "/Internet & Telecom/Mobile & Wireless/Mobile Apps & Add-Ons",
  "/Internet & Telecom/Mobile & Wireless/Mobile Phones",
  "/Internet & Telecom/Mobile & Wireless/Other",
  "/Internet & Telecom/Service Providers",
  "/Internet & Telecom/Teleconferencing",
  "/Internet & Telecom/Web Services",
  "/Internet & Telecom/Web Services/Search Engines",
  "/Internet & Telecom/Web Services/Web Design & Development",
  "/Internet & Telecom/Web Services/Web Hosting",
  "/Internet & Telecom/Web Services/Other",
  "/Jobs & Education",
  "/Jobs & Education/Education",
  "/Jobs & Education/Education/Colleges & Universities",
  "/Jobs & Education/Education/Early Childhood Education",
  "/Jobs & Education/Education/Homeschooling",
  "/Jobs & Education/Education/Primary & Secondary Education",
  "/Jobs & Education/Education/Standardized Tests",
  "/Jobs & Education/Education/Teaching & Classroom Resources",
  "/Jobs & Education/Education/Vocational & Continuing Education",
  "/Jobs & Education/Education/Other",
  "/Jobs & Education/Jobs",
  "/Jobs & Education/Jobs/Career Resources & Planning",
  "/Jobs & Education/Jobs/Job Listings",
  "/Jobs & Education/Jobs/Resumes & Portfolios",
  "/Jobs & Education/Jobs/Other",
  "/Law & Government",
  "/Law & Government/Government",
  "/Law & Government/Government/Courts & Judiciary",
  "/Law & Government/Government/Executive Branch",
  "/Law & Government/Government/Legislative Branch",
  "/Law & Government/Government/Local Government",
  "/Law & Government/Government/Other",
  "/Law & Government/Legal",
  "/Law & Government/Legal/Bankruptcy",
  "/Law & Government/Legal/Business Law",
  "/Law & Government/Legal/Constitutional Law & Civil Rights",
  "/Law & Government/Legal/Family Law",
  "/Law & Government/Legal/Immigration",
  "/Law & Government/Legal/Intellectual Property",
  "/Law & Government/Legal/Legal Education",
  "/Law & Government/Legal/Personal Injury",
  "/Law & Government/Legal/Other",
  "/Law & Government/Military",
  "/Law & Government/Public Safety",
  "/Law & Government/Public Safety/Crime & Justice",
  "/Law & Government/Public Safety/Emergency Services",
  "/Law & Government/Public Safety/Other",
  "/Law & Government/Social Services",
  "/News",
  "/News/Business News",
  "/News/Gossip & Tabloid News",
  "/News/Local News",
  "/News/Politics",
  "/News/Sports News",
  "/News/Technology News",
  "/News/Weather",
  "/News/World News",
  "/Online Communities",
  "/Online Communities/Dating & Personals",
  "/Online Communities/File Sharing & Hosting",
  "/Online Communities/Online Goodies",
  "/Online Communities/Photo & Video Sharing",
  "/Online Communities/Social Networks",
  "/Online Communities/Virtual Worlds",
  "/People & Society",
  "/People & Society/Family & Relationships",
  "/People & Society/Family & Relationships/Family",
  "/People & Society/Family & Relationships/Marriage",
  "/People & Society/Family & Relationships/Other",
  "/People & Society/Kids & Teens",
  "/People & Society/Religion & Belief",
  "/People & Society/Romance",
  "/People & Society/Seniors & Retirement",
  "/People & Society/Social Issues & Advocacy",
  "/People & Society/Social Issues & Advocacy/Charity & Philanthropy",
  "/People & Society/Social Issues & Advocacy/Green Living",
  "/People & Society/Social Issues & Advocacy/Other",
  "/People & Society/Social Sciences",
  "/People & Society/Subcultures & Niche Interests",
  "/Pets & Animals",
  "/Pets & Animals/Animal Products & Services",
  "/Pets & Animals/Pets",
  "/Pets & Animals/Pets/Birds",
  "/Pets & Animals/Pets/Cats",
  "/Pets & Animals/Pets/Dogs",
  "/Pets & Animals/Pets/Fish & Aquaria",
  "/Pets & Animals/Pets/Horses",
  "/Pets & Animals/Pets/Rabbits & Rodents",
  "/Pets & Animals/Pets/Reptiles & Amphibians",
  "/Pets & Animals/Pets/Other",
  "/Pets & Animals/Wildlife",
  "/Real Estate",
  "/Real Estate/Property Development",
  "/Real Estate/Other",
  "/Real Estate/Real Estate Listings",
  "/Real Estate/Real Estate Listings/Bank-Owned & Foreclosed Properties",
  "/Real Estate/Real Estate Listings/Commercial Properties",
  "/Real Estate/Real Estate Listings/Lots & Land",
  "/Real Estate/Real Estate Listings/Residential Rentals",
  "/Real Estate/Real Estate Listings/Residential Sales",
  "/Real Estate/Real Estate Listings/Timeshares & Vacation Properties",
  "/Real Estate/Real Estate Listings/Other",
  "/Real Estate/Real Estate Services",
  "/Real Estate/Real Estate Services/Property Inspections & Appraisals",
  "/Real Estate/Real Estate Services/Property Management",
  "/Real Estate/Real Estate Services/Real Estate Agencies",
  "/Real Estate/Real Estate Services/Real Estate Title & Escrow",
  "/Real Estate/Real Estate Services/Other",
  "/Reference",
  "/Reference/Other",
  "/Reference/Directories & Listings",
  "/Reference/Directories & Listings/Business & Personal Listings",
  "/Reference/Directories & Listings/Other",
  "/Reference/Educational Resources",
  "/Reference/Foreign Language Resources",
  "/Reference/General Reference",
  "/Reference/Geographic Reference",
  "/Reference/How-To, DIY & Expert Content",
  "/Reference/Language Resources",
  "/Reference/Public Records & Directories",
  "/Science",
  "/Science/Astronomy",
  "/Science/Biological Sciences",
  "/Science/Biological Sciences/Genetics",
  "/Science/Biological Sciences/Other",
  "/Science/Chemistry",
  "/Science/Computer Science",
  "/Science/Earth Sciences",
  "/Science/Ecology & Environment",
  "/Science/Engineering & Technology",
  "/Science/Mathematics",
  "/Science/Physics",
  "/Shopping",
  "/Shopping/Apparel",
  "/Shopping/Apparel/Athletic Apparel",
  "/Shopping/Apparel/Children's Clothing",
  "/Shopping/Apparel/Clothing Accessories",
  "/Shopping/Apparel/Costumes",
  "/Shopping/Apparel/Footwear",
  "/Shopping/Apparel/Formal Wear",
  "/Shopping/Apparel/Outerwear",
  "/Shopping/Apparel/Other",
  "/Shopping/Auctions",
  "/Shopping/Classifieds",
  "/Shopping/Gifts & Special Event Items",
  "/Shopping/Luxury Goods",
  "/Shopping/Mass Merchants & Department Stores",
  "/Shopping/Shopping Portals & Search Engines",
  "/Shopping/Tobacco Products",
  "/Shopping/Toys",
  "/Sports",
  "/Sports/Animal Sports",
  "/Sports/Baseball",
  "/Sports/Basketball",
  "/Sports/Boxing",
  "/Sports/College Sports",
  "/Sports/Combat Sports",
  "/Sports/Cricket",
  "/Sports/Cycling",
  "/Sports/Diving & Underwater Activities",
  "/Sports/Extreme Sports",
  "/Sports/Fantasy Sports",
  "/Sports/Football",
  "/Sports/Golf",
  "/Sports/Gymnastics",
  "/Sports/Hockey",
  "/Sports/Horse Racing",
  "/Sports/Individual Sports",
  "/Sports/Motor Sports",
  "/Sports/Racquet Sports",
  "/Sports/Rugby",
  "/Sports/Skiing & Snowboarding",
  "/Sports/Soccer",
  "/Sports/Sporting Goods",
  "/Sports/Swimming",
  "/Sports/Team Sports",
  "/Sports/Track & Field",
  "/Sports/Volleyball",
  "/Sports/Walking & Running",
  "/Sports/Water Sports",
  "/Sports/Winter Sports",
  "/Sports/World Soccer",
  "/Sports/Wrestling",
  "/Travel",
  "/Travel/Air Travel",
  "/Travel/Bed & Breakfasts",
  "/Travel/Bus & Rail",
  "/Travel/Cruises & Charters",
  "/Travel/Hotels & Accommodations",
  "/Travel/Luggage & Travel Accessories",
  "/Travel/Tourist Destinations",
  "/Travel/Tourist Destinations/Africa",
  "/Travel/Tourist Destinations/Asia",
  "/Travel/Tourist Destinations/Australia & Oceania",
  "/Travel/Tourist Destinations/Caribbean",
  "/Travel/Tourist Destinations/Europe",
  "/Travel/Tourist Destinations/Middle East",
  "/Travel/Tourist Destinations/North America",
  "/Travel/Tourist Destinations/Polar Regions",
  "/Travel/Tourist Destinations/South America",
  "/Travel/Tourist Destinations/Other",
  "/Travel/Travel Agencies & Services",
  "/Health",
  "/Health/Health Conditions",
  "/Health/Health Conditions/AIDS & HIV",
  "/Health/Health Conditions/Allergies",
  "/Health/Health Conditions/Arthritis",
  "/Health/Health Conditions/Cancer",
  "/Health/Health Conditions/Diabetes",
  "/Health/Health Conditions/Heart Disease",
  "/Health/Health Conditions/Other",
  "/Health/Medical Devices & Equipment",
  "/Health/Medical Facilities & Services",
  "/Health/Medical Facilities & Services/Hospitals & Treatment Centers",
  "/Health/Medical Facilities & Services/Physical Therapy",
  "/Health/Medical Facilities & Services/Physicians & Surgeons",
  "/Health/Medical Facilities & Services/Other",
  "/Health/Nursing",
  "/Health/Nutrition",
  "/Health/Oral & Dental Care",
  "/Health/Pharmacy",
  "/Health/Public Health",
  "/Health/Reproductive Health",
  "/Health/Reproductive Health/Contraception",
  "/Health/Reproductive Health/Fertility & Infertility",
  "/Health/Reproductive Health/Pregnancy & Maternity",
  "/Health/Reproductive Health/Other",
  "/Health/Substance Abuse",
  "/Health/Health Education & Medical Training",
];

// Parse categories into a grouped tree structure for the picker
function buildCategoryTree(cats) {
  const tree = {}; // { "Root": { label, children: { "L2": { label, children: {...}, path }, ... }, path } }
  cats.forEach(path => {
    const parts = path.replace(/^\//, '').split('/');
    const root = parts[0];
    if (!tree[root]) tree[root] = { label: root, path: `/${root}`, children: {} };
    if (parts.length === 1) return;
    const l2 = parts[1];
    if (!tree[root].children[l2]) tree[root].children[l2] = { label: l2, path: `/${root}/${l2}`, children: {} };
    if (parts.length === 2) return;
    const l3 = parts[2];
    if (!tree[root].children[l2].children[l3]) {
      tree[root].children[l2].children[l3] = { label: l3, path: `/${root}/${l2}/${l3}`, children: {} };
    }
  });
  return tree;
}

// Flatten tree into display rows with indent metadata
function flattenTree(tree) {
  const rows = [];
  Object.values(tree).sort((a, b) => a.label.localeCompare(b.label)).forEach(root => {
    rows.push({ path: root.path, label: root.label, display: root.label, depth: 0, isGroup: Object.keys(root.children).length > 0 });
    Object.values(root.children).sort((a, b) => a.label.localeCompare(b.label)).forEach(l2 => {
      const hasKids = Object.keys(l2.children).length > 0;
      rows.push({ path: l2.path, label: l2.label, display: l2.label, depth: 1, isGroup: hasKids });
      Object.values(l2.children).sort((a, b) => a.label.localeCompare(b.label)).forEach(l3 => {
        rows.push({ path: l3.path, label: l3.label, display: `${l2.label}/${l3.label}`, depth: 2, isGroup: false });
      });
    });
  });
  return rows;
}

const CAT_TREE = buildCategoryTree(GOOGLE_CATEGORIES);
const CAT_ROWS = flattenTree(CAT_TREE);

// Custom category picker component
function CategoryPicker({ value, onChange, label, placeholder = '— Optional —' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const dropRef = useRef(null);
  const searchRef = useRef(null);
  const DROP_HEIGHT = 320; // max height of dropdown panel
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0, openUp: false });

  const calcPos = () => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < DROP_HEIGHT + 8 && r.top > DROP_HEIGHT + 8;
    setDropPos({
      top: openUp ? r.top - DROP_HEIGHT - 4 : r.bottom + 4,
      left: r.left,
      width: r.width,
      openUp,
    });
  };

  useEffect(() => {
    const handler = (e) => {
      const inTrigger = ref.current && ref.current.contains(e.target);
      const inDrop = dropRef.current && dropRef.current.contains(e.target);
      if (!inTrigger && !inDrop) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      calcPos();
      if (searchRef.current) searchRef.current.focus();
      // Recalculate on scroll or resize while open
      window.addEventListener('scroll', calcPos, true);
      window.addEventListener('resize', calcPos);
      return () => {
        window.removeEventListener('scroll', calcPos, true);
        window.removeEventListener('resize', calcPos);
      };
    }
  }, [open]);

  const filtered = search.trim()
    ? CAT_ROWS.filter(r => r.path.toLowerCase().includes(search.toLowerCase()) || r.display.toLowerCase().includes(search.toLowerCase()))
    : CAT_ROWS;

  const selected = value ? CAT_ROWS.find(r => r.path === value) : null;

  const displayValue = selected
    ? selected.path.replace(/^\//, '')
    : null;

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      {label && <label className="flbl">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '10px 34px 10px 13px',
          background: 'var(--cream)', border: `1px solid ${open ? 'var(--olive)' : 'var(--border2)'}`,
          borderRadius: '9px', color: value ? 'var(--ink)' : 'var(--muted)',
          fontSize: '13px', fontFamily: 'var(--sans)', textAlign: 'left',
          cursor: 'pointer', outline: 'none',
          boxShadow: open ? '0 0 0 3px rgba(90,107,42,0.1)' : 'none',
          transition: 'all 0.13s', position: 'relative',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}
      >
        {displayValue || placeholder}
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {value && (
            <span
              onMouseDown={e => { e.stopPropagation(); onChange(''); setSearch(''); }}
              style={{ color: 'var(--muted)', lineHeight: 1, cursor: 'pointer', padding: '2px' }}
            >
              <X size={11} />
            </span>
          )}
          <ChevronDown size={12} color="var(--muted)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
        </span>
      </button>

      {open && (
        <div ref={dropRef} style={{
          position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999,
          maxHeight: 320,
          background: 'var(--white)', border: '1px solid var(--border2)',
          borderRadius: dropPos.openUp ? '11px 11px 6px 6px' : '6px 6px 11px 11px',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {/* Search */}
          <div style={{ padding: '10px 10px 8px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={12} color="var(--muted)" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search categories…"
                style={{
                  width: '100%', padding: '7px 10px 7px 28px',
                  background: 'var(--cream)', border: '1px solid var(--border)',
                  borderRadius: '7px', fontSize: '12px', fontFamily: 'var(--sans)',
                  color: 'var(--ink)', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {/* Clear option */}
            <div
              onClick={() => { onChange(''); setSearch(''); setOpen(false); }}
              style={{
                padding: '9px 13px', fontSize: '12px', color: 'var(--muted)',
                cursor: 'pointer', fontStyle: 'italic',
                borderBottom: '1px solid var(--border)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--cream)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              — None —
            </div>

            {filtered.length === 0 && (
              <div style={{ padding: '16px 13px', fontSize: '12px', color: 'var(--muted)', textAlign: 'center' }}>No results</div>
            )}

            {filtered.map((row, i) => {
              const isSelected = row.path === value;
              const indent = row.depth * 16;
              const isRoot = row.depth === 0;
              return (
                <div
                  key={row.path}
                  onClick={() => { onChange(row.path); setSearch(''); setOpen(false); }}
                  style={{
                    padding: `${isRoot ? '9px' : '7px'} 13px`,
                    paddingLeft: 13 + indent,
                    cursor: 'pointer',
                    background: isSelected ? 'var(--olive-lt)' : '',
                    borderTop: isRoot && i > 0 ? '1px solid var(--border)' : 'none',
                    display: 'flex', alignItems: 'baseline', gap: 6,
                    transition: 'background 0.08s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--cream)'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = ''; }}
                >
                  {isRoot ? (
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--olive)' : 'var(--ink)' }}>
                      {row.label}
                    </span>
                  ) : row.depth === 1 ? (
                    <>
                      <span style={{ fontSize: '11px', color: 'var(--muted)', flexShrink: 0, lineHeight: 1.4, paddingTop: '1px' }}>└</span>
                      <span style={{ fontSize: '12px', color: isSelected ? 'var(--olive)' : 'var(--ink2)', fontWeight: isSelected ? 600 : 400 }}>{row.label}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '11px', color: 'var(--border2)', flexShrink: 0, lineHeight: 1.4, paddingTop: '1px' }}>└</span>
                      <span style={{ fontSize: '11px', color: isSelected ? 'var(--olive)' : 'var(--muted)', fontFamily: 'var(--mono)' }}>{row.label}</span>
                    </>
                  )}
                  {isSelected && <span style={{ marginLeft: 'auto', color: 'var(--olive)', fontSize: '11px', flexShrink: 0 }}>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --cream:#faf9f6;--white:#ffffff;--ink:#1a1a18;--ink2:#3d3d38;
    --muted:#8a8a7e;--border:#e8e6df;--border2:#d4d0c7;
    --olive:#5a6b2a;--olive-lt:#f0f3e8;--olive-md:#dce5c4;
    --amber:#b8650f;--amber-lt:#fdf3e3;
    --red:#b83224;--red-lt:#fdf0ee;
    --serif:'Libre Baskerville',Georgia,serif;
    --sans:'Geist',system-ui,sans-serif;
    --mono:'Geist Mono',monospace;
  }
  body{background:var(--cream);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;font-size:15px;line-height:1.6;}
  /* Nav */
  .nav{position:sticky;top:0;z-index:50;background:rgba(250,249,246,0.9);backdrop-filter:blur(10px);border-bottom:1px solid var(--border);padding:0 32px;height:58px;display:flex;align-items:center;justify-content:space-between;}
  .nav-logo{font-family:var(--serif);font-size:19px;color:var(--ink);display:flex;align-items:center;gap:10px;}
  .nav-mark{width:30px;height:30px;border-radius:8px;background:var(--olive);display:flex;align-items:center;justify-content:center;}
  .nav-pill{font-family:var(--mono);font-size:11px;color:var(--muted);background:var(--border);border-radius:20px;padding:3px 10px;}
  /* Hero */
  .hero{max-width:680px;margin:0 auto;padding:76px 24px 52px;text-align:center;}
  .hero-tag{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:500;color:var(--olive);background:var(--olive-lt);border:1px solid var(--olive-md);border-radius:20px;padding:5px 14px;margin-bottom:22px;}
  .hero-dot{width:6px;height:6px;border-radius:50%;background:var(--olive);}
  .hero h1{font-family:var(--serif);font-size:clamp(36px,5.5vw,58px);font-weight:400;line-height:1.1;letter-spacing:-0.3px;color:var(--ink);margin-bottom:16px;}
  .hero h1 em{font-style:italic;color:var(--olive);}
  .hero p{font-size:16px;line-height:1.75;color:var(--muted);max-width:440px;margin:0 auto;font-weight:300;}
  /* Layout */
  .main{max-width:800px;margin:0 auto;padding:0 24px 96px;}
  /* Help */
  .help{border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:12px;background:var(--white);}
  .help-btn{width:100%;padding:13px 17px;display:flex;align-items:center;gap:8px;background:transparent;border:none;cursor:pointer;font-family:var(--sans);font-size:13px;color:var(--muted);font-weight:500;text-align:left;transition:background 0.12s;}
  .help-btn:hover{background:var(--cream);}
  .help-body{padding:16px 17px;border-top:1px solid var(--border);font-size:13px;color:var(--muted);line-height:1.8;}
  .help-body a{color:var(--olive);text-decoration:none;font-weight:500;}
  .help-body a:hover{text-decoration:underline;}
  .help-body ol{padding-left:17px;margin:5px 0;}
  .help-body strong{color:var(--ink2);}
  /* Input card */
  .icard{background:var(--white);border:1px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05),0 4px 20px rgba(0,0,0,0.04);margin-bottom:12px;}
  .icard-top{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
  .icard-lbl{font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);}
  .icard-body{padding:22px 24px 24px;}
  /* Tabs */
  .tabs{display:inline-flex;gap:2px;background:var(--cream);border:1px solid var(--border);border-radius:9px;padding:3px;margin-bottom:20px;}
  .tab{padding:7px 17px;border-radius:7px;border:none;cursor:pointer;font-family:var(--sans);font-size:13px;font-weight:500;transition:all 0.13s;color:var(--muted);background:transparent;}
  .tab.on{background:var(--white);color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,0.1);}
  /* Fields */
  .flbl{display:block;font-size:12px;font-weight:500;color:var(--muted);margin-bottom:7px;}
  .finp{width:100%;padding:10px 13px;background:var(--cream);border:1px solid var(--border2);border-radius:9px;color:var(--ink);font-size:14px;font-family:var(--sans);outline:none;transition:all 0.13s;}
  .finp:focus{border-color:var(--olive);background:var(--white);box-shadow:0 0 0 3px rgba(90,107,42,0.1);}
  .finp::placeholder{color:var(--muted);}
  .fta{resize:vertical;min-height:130px;font-family:var(--mono);font-size:12px;line-height:1.65;}
  .fsel{width:100%;padding:10px 34px 10px 13px;background:var(--cream);border:1px solid var(--border2);border-radius:9px;color:var(--ink);font-size:13px;font-family:var(--sans);outline:none;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8a7e' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;transition:border-color 0.13s;}
  .fsel:focus{border-color:var(--olive);box-shadow:0 0 0 3px rgba(90,107,42,0.1);}
  .fsel option{background:#fff;}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:15px;}
  @media(max-width:560px){.g2{grid-template-columns:1fr;}}
  .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;}
  @media(max-width:560px){.g3{grid-template-columns:1fr;}}
  /* Button */
  .btn{width:100%;padding:13px;background:var(--olive);color:#fff;border:none;border-radius:10px;cursor:pointer;font-family:var(--sans);font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.14s;box-shadow:0 2px 8px rgba(90,107,42,0.22);}
  .btn:hover:not(:disabled){background:#4d5c24;transform:translateY(-1px);box-shadow:0 4px 16px rgba(90,107,42,0.28);}
  .btn:disabled{opacity:0.42;cursor:not-allowed;}
  .spin{width:15px;height:15px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:sp 0.65s linear infinite;}
  @keyframes sp{to{transform:rotate(360deg);}}
  /* Error */
  .err{margin-top:13px;padding:12px 14px;background:var(--red-lt);border:1px solid rgba(184,50,36,0.18);border-radius:10px;display:flex;gap:10px;align-items:flex-start;}
  .errt{font-size:13px;color:#8b1a0f;line-height:1.6;}
  .btnsm{margin-top:7px;padding:6px 13px;background:var(--olive);color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;font-family:var(--sans);}
  /* Extension */
  .extb{padding:10px 13px;border-radius:8px;margin-bottom:16px;background:var(--olive-lt);border:1px solid var(--olive-md);font-size:12px;color:var(--olive);font-weight:500;display:flex;align-items:center;gap:8px;}
  /* Results */
  .results{display:flex;flex-direction:column;gap:11px;margin-top:11px;}
  /* Result card */
  .rc{background:var(--white);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.03);}
  .rch{padding:17px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:11px;}
  .rci{width:34px;height:34px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .rct{font-size:15px;font-weight:600;color:var(--ink);}
  .rcs{font-size:12px;color:var(--muted);margin-top:1px;}
  .rcb{padding:19px 22px;}
  /* Stat tile */
  .st{background:var(--cream);border:1px solid var(--border);border-radius:10px;padding:14px 15px;}
  .stl{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;}
  .stv{font-size:17px;font-weight:600;color:var(--ink);letter-spacing:-0.3px;}
  .sts{font-size:12px;margin-top:3px;}
  /* Badge */
  .bdg{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:0.03em;font-family:var(--mono);white-space:nowrap;}
  .bg{background:var(--olive-lt);color:var(--olive);border:1px solid var(--olive-md);}
  .ba{background:var(--amber-lt);color:var(--amber);border:1px solid rgba(184,101,15,0.22);}
  .br{background:var(--red-lt);color:var(--red);border:1px solid rgba(184,50,36,0.2);}
  .bgy{background:var(--cream);color:var(--muted);border:1px solid var(--border);}
  .bk{background:var(--ink);color:#fff;border:1px solid var(--ink);}
  /* Score bar */
  .sbt{height:5px;background:var(--border);border-radius:99px;overflow:hidden;flex:1;}
  .sbf{height:100%;border-radius:99px;transition:width 0.8s cubic-bezier(0.16,1,0.3,1);}
  /* Dim row */
  .dr{padding:13px 0;border-bottom:1px solid var(--border);}
  .dr:last-child{border-bottom:none;}
  .drh{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;gap:12px;}
  .drl{display:flex;align-items:center;gap:8px;min-width:0;}
  .drn{font-size:13px;font-weight:500;color:var(--ink);}
  .drr{display:flex;align-items:center;gap:9px;flex-shrink:0;}
  .drs{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--ink2);min-width:36px;text-align:right;}
  .drd{font-size:13px;color:var(--ink2);margin-top:5px;line-height:1.6;}
  .drb{margin-top:8px;padding:8px 12px;background:var(--cream);border-radius:7px;border-left:2px solid var(--border2);}
  .drbr{display:flex;justify-content:space-between;font-size:12px;color:var(--ink2);padding:3px 0;font-family:var(--mono);}
  /* Accordion */
  .acc{background:var(--cream);border:1px solid var(--border);border-radius:10px;overflow:hidden;}
  .acc+.acc{margin-top:7px;}
  .acct{width:100%;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;background:transparent;border:none;cursor:pointer;font-family:var(--sans);text-align:left;transition:background 0.12s;}
  .acct:hover{background:rgba(0,0,0,0.025);}
  .accl{display:flex;align-items:center;gap:9px;min-width:0;}
  .accr{display:flex;align-items:center;gap:7px;flex-shrink:0;margin-left:10px;}
  .acch{font-size:13.5px;font-weight:500;color:var(--ink);}
  .accb{border-top:1px solid var(--border);padding:13px 14px;background:var(--white);}
  .lvl{font-size:10px;font-weight:700;font-family:var(--mono);padding:2px 6px;border-radius:5px;flex-shrink:0;}
  /* Signal */
  .sig{display:flex;gap:9px;align-items:flex-start;font-size:14px;color:var(--ink2);line-height:1.65;padding:7px 0;border-bottom:1px solid var(--border);}
  .sig:last-child{border-bottom:none;}
  /* Claim */
  .clm{padding:12px 14px;background:var(--red-lt);border:1px solid rgba(184,50,36,0.14);border-radius:8px;margin-top:8px;}
  .clmq{font-size:13px;font-style:italic;color:var(--red);margin-bottom:4px;font-family:var(--serif);line-height:1.5;}
  .clmi{font-size:13px;color:#7b1a11;line-height:1.55;}
  /* Edit */
  .edt{padding:12px 14px;background:var(--olive-lt);border:1px solid var(--olive-md);border-radius:8px;margin-top:8px;}
  .edtr{font-size:13px;color:var(--ink2);line-height:1.7;padding:2px 0;}
  .edtr strong{color:var(--ink);font-weight:600;}
  /* Outline scroll */
  .osc{max-height:230px;overflow-y:auto;border:1px solid var(--border);border-radius:9px;padding:7px 13px;background:var(--cream);}
  .hrow{display:flex;align-items:baseline;gap:9px;padding:5px 0;border-bottom:1px solid rgba(0,0,0,0.04);}
  .hrow:last-child{border-bottom:none;}
  /* Intro */
  .introb{padding:12px;background:var(--cream);border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--muted);line-height:1.7;max-height:105px;overflow-y:auto;margin-top:6px;}
  /* Info rows */
  .ir{padding:12px 0;border-bottom:1px solid var(--border);}
  .ir:last-child{border-bottom:none;}
  .irl{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:var(--muted);margin-bottom:6px;}
  .irv{font-size:14px;color:var(--ink2);line-height:1.7;}
  /* Scrollbar */
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:99px;}
`;

function sfill(pct) { return pct >= 0.75 ? '#5a6b2a' : pct >= 0.5 ? '#b8650f' : '#b83224'; }

function Bar({ score, max, h = 5 }) {
  const p = max > 0 ? score / max : 0;
  return <div className="sbt" style={{ height: h }}><div className="sbf" style={{ width: `${p * 100}%`, background: sfill(p) }} /></div>;
}

function SecAcc({ section }) {
  const [open, setOpen] = useState(false);
  const hasIssues = section.mixedSignals?.length > 0 || section.suggestedEdits?.length > 0 || section.ungroundedClaims?.length > 0;
  const ls = section.level === 'h1' ? { bg: '#ece9f8', color: '#5b4fcf' }
    : section.level === 'h2' ? { bg: 'var(--olive-lt)', color: 'var(--olive)' }
    : { bg: 'var(--amber-lt)', color: 'var(--amber)' };

  return (
    <div className="acc">
      <button className="acct" onClick={() => setOpen(o => !o)}>
        <div className="accl">
          <span className="lvl" style={{ background: ls.bg, color: ls.color }}>{section.level?.toUpperCase()}</span>
          <span className="acch">{section.heading}</span>
        </div>
        <div className="accr">
          {section.deliversOnPromise === false && <span className="bdg br">Underdelivers</span>}
          {hasIssues ? <span className="bdg ba">{section.suggestedEdits?.length || 0} edit{section.suggestedEdits?.length !== 1 ? 's' : ''}</span>
            : <span className="bdg bg">✓ Clear</span>}
          <ChevronDown size={13} color="var(--muted)" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
        </div>
      </button>
      {open && (
        <div className="accb">
          {section.expectedRole && <div style={{ fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic', paddingBottom: '10px' }}>Expected: {section.expectedRole}</div>}
          {section.mixedSignals?.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--amber)', marginBottom: '5px' }}>Mixed Signals</div>
              {section.mixedSignals.map((s, i) => <div key={i} className="sig"><span style={{ color: 'var(--amber)', flexShrink: 0 }}>⚠</span><span>{s}</span></div>)}
            </div>
          )}
          {section.ungroundedClaims?.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--red)', marginBottom: '5px' }}>Ungrounded Claims</div>
              {section.ungroundedClaims.map((c, i) => <div key={i} className="clm"><div className="clmq">"{c.quote}"</div><div className="clmi">{c.issue}</div></div>)}
            </div>
          )}
          {section.suggestedEdits?.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--olive)', marginBottom: '5px' }}>Suggested Edits</div>
              {section.suggestedEdits.map((e, i) => (
                <div key={i} className="edt">
                  <div className="edtr"><strong>Location</strong> — {e.location}</div>
                  <div className="edtr"><strong>Change</strong> — {e.change}</div>
                  <div className="edtr"><strong>Reason</strong> — {e.reason}</div>
                </div>
              ))}
            </div>
          )}
          {!hasIssues && <div style={{ fontSize: '13px', color: 'var(--olive)', padding: '3px 0' }}>✓ Clear intent, delivers on its promise.</div>}
        </div>
      )}
    </div>
  );
}

export default function ContentAnalyzer() {
  const [url, setUrl] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [useManualInput, setUseManualInput] = useState(false);
  const [intendedPrimary, setIntendedPrimary] = useState('');
  const [intendedSecondary, setIntendedSecondary] = useState('');
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [extensionData, setExtensionData] = useState(null);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const src = p.get('source'), enc = p.get('data'), iu = p.get('url');
    if (src === 'extension' && enc) {
      try {
        const d = JSON.parse(decodeURIComponent(escape(atob(enc))));
        setExtensionData({ title: d.title || 'Untitled', introduction: d.introduction || '', headings: d.headings || [], text: d.text || '', url: d.url || '', source: 'extension' });
        setUrl(d.url || '');
      } catch (e) { console.error(e); }
    } else if (iu) { setUrl(iu); }
  }, []);

  const fetchUrlContent = async (u) => {
    const r = await fetch(`/api/extract?url=${encodeURIComponent(u)}`);
    const raw = await r.text();
    let data;
    try { data = JSON.parse(raw); } catch { throw new Error(`API did not return JSON (status ${r.status})`); }
    if (!r.ok) throw new Error(data?.error || `Failed to fetch URL (${r.status})`);
    return data;
  };

  const extractIntro = (text) => {
    if (!text) return '';
    const w = text.trim().split(/\s+/);
    return w.slice(0, 250).join(' ') + (w.length > 250 ? '…' : '');
  };

  const analyzeNLP = async (content) => {
    const trimmed = content.slice(0, 20000);
    if (googleApiKey?.trim()) {
      const r = await fetch(`https://language.googleapis.com/v1/documents:classifyText?key=${googleApiKey}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: trimmed } })
      });
      if (!r.ok) {
        const e = await r.json();
        throw new Error(`Google NLP: ${e.error?.message || e.error?.status || JSON.stringify(e)}`);
      }
      const data = await r.json();
      if (!data.categories?.length) return { categories: [], primaryCategory: null, secondaryCategory: null, clarityGap: 0, alignmentStatus: 'No categories detected' };
      const sorted = [...data.categories].sort((a, b) => b.confidence - a.confidence);
      const primary = sorted[0], secondary = sorted[1] || null;
      const clarityGap = secondary ? primary.confidence - secondary.confidence : primary.confidence;
      return { categories: sorted, primaryCategory: primary, secondaryCategory: secondary, clarityGap, alignmentStatus: clarityGap >= 0.3 ? 'Aligned' : clarityGap >= 0.15 ? 'Mixed (Acceptable)' : 'Misaligned' };
    }
    const r = await fetch('/api/google-nlp', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: trimmed })
    });
    if (!r.ok) {
      let msg = 'Google NLP error';
      try { const e = await r.json(); msg = e.error || e.message || msg; } catch {}
      throw new Error(msg);
    }
    return r.json();
  };

  const analyzeSentiment = async (content) => {
    if (googleApiKey?.trim()) {
      const r = await fetch(`https://language.googleapis.com/v1/documents:analyzeSentiment?key=${googleApiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ document: { type: 'PLAIN_TEXT', content: content.slice(0, 20000) } }) });
      if (!r.ok) { const e = await r.json(); throw new Error(e.error?.message || 'Sentiment error'); }
      const data = await r.json();
      return { documentSentiment: data.documentSentiment, sentences: data.sentences || [] };
    }
    const r = await fetch('/api/google-sentiment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: content.slice(0, 20000) }) });
    if (!r.ok) { const e = await r.json(); throw new Error(e.error || 'Sentiment error'); }
    return r.json();
  };

  const analyzeClaude = async (content, nlp, extraction) => {
    const title = extraction?.title || '(No title)';
    const introduction = extraction?.introduction || '(No introduction)';
    const headings = extraction?.headings || [];

    const buildSections = (hs, text) => {
      if (!hs.length) return [];
      let parentH2 = null;
      return hs.map((h, i) => {
        const next = hs[i + 1]?.text;
        const start = text.indexOf(h.text);
        const end = next ? text.indexOf(next) : text.length;
        const body = start !== -1 ? text.slice(start, end !== -1 ? end : text.length).slice(0, 1500) : '';
        if (h.level === 'h2') parentH2 = h.text;
        return { level: h.level, heading: h.text, parent: h.level === 'h3' ? parentH2 : null, position: `Section ${i + 1} of ${hs.length}`, isEarly: i < Math.ceil(hs.length * 0.25), isLate: i >= Math.floor(hs.length * 0.75), wordCount: body.trim().split(/\s+/).filter(Boolean).length, content: body.trim() };
      });
    };

    const sections = buildSections(headings, content);
    const sectionsText = sections.length
      ? sections.map((s, i) => `Section ${i + 1} [${s.level.toUpperCase()}]: "${s.heading}"\n  Position: ${s.position} (${s.isEarly ? 'early-page' : s.isLate ? 'late-page' : 'mid-page'})${s.parent ? `\n  Parent: "${s.parent}"` : ''}\n  Words: ${s.wordCount}\n  Role: ${s.isEarly ? 'establish audience/purpose' : s.isLate ? 'summarize/next steps' : 'deliver on heading'}\n  Content: ${s.content || '(none)'}`).join('\n\n---\n\n')
      : content.slice(0, 25000);

    const intentCtx = intendedPrimary || intendedSecondary ? `\nTarget Primary: ${intendedPrimary || '(not set)'}\nTarget Secondary: ${intendedSecondary || '(not set)'}` : '';

    const prompt = `You are an expert in content intent and AI grounding analysis.
Analyze this page section by section and provide specific, actionable editing recommendations per section.

IMPORTANT:
- Focus on clarity of intent and audience for each section
- Suggest minimal, non-destructive edits only
- Do NOT rewrite content
- Do NOT change tone or voice
- Flag ungrounded claims (claims that don't show their work) but do NOT fact-check

PAGE OVERVIEW
URL: ${url}
Title: ${title}
Introduction: ${introduction}

Google NLP Classification:
- Primary: ${nlp.primaryCategory ? `${nlp.primaryCategory.name} (${(nlp.primaryCategory.confidence*100).toFixed(1)}%)` : 'None'}
- Secondary: ${nlp.secondaryCategory ? `${nlp.secondaryCategory.name} (${(nlp.secondaryCategory.confidence*100).toFixed(1)}%)` : 'None'}
- Clarity Gap: ${(nlp.clarityGap*100).toFixed(1)}%${intentCtx}

SECTIONS TO ANALYZE:
${sectionsText}

TASKS

For each section, analyze:
1. Does the heading clearly signal the section's purpose and audience?
2. Does the content deliver on the heading's promise?
3. Are there mixed signals (wrong audience, competing topics, vague framing)?
4. What is the single most impactful edit for this section?
5. Are there any ungrounded claims? (vague assertions, unsupported stats, superlatives without evidence, opinions presented as facts — flag these but do not fact-check)

Also provide overall page-level analysis:
A) Current Interpretation Summary (1-2 sentences)
B) Intent Alignment: Aligned | Partially aligned | Mixed + reason
C) Top 2-4 Mixed Signals across the whole page
D) Expected Outcome if edits are applied (1-2 sentences)

GROUNDING SCORE (0-100):
Score based on:
- Title Clarity (25pts): specifies format +6, audience +6, scope +6, outcome +7
- Structural Alignment (30pts): (aligned H2s / total H2s) × 30
- Introduction Anchoring (20pts): explicit prerequisites +10, explicit audience +10
- Content Verification (15pts): title topics appear as H2s +8, scope maintained +4, logical hierarchy +3
- Audience Definition (10pts): lower bound defined +5, upper bound defined +5

In groundingExplanation: quote exact title, list 3+ H2s, show the score math, quote intro statements.

DIMENSION SCORES (Claude-assessed only — D5, D6, D7):
D5 — Intro Audience Signal (10pts): explicit audience + prerequisites = 10, one explicit = 8, both implied = 4, neither = 0. Quote the intro text that supports this score.
D6 — Scope Consistency (10pts): all sections on-topic = 10, 1 off-topic = 7, 2 off-topic = 4, 3+ = 0. List any off-topic sections.
D7 — Content Delivery & Claim Grounding (25pts):
  Part A: Section Delivery (10pts) — do sections deliver on their headings? all/most = 10, some vague = 6, most don't = 2
  Part B: Claim Support (10pts) — are claims backed by evidence? most supported = 10, mixed = 6, most unsupported = 2
  Part C: Ungrounded Language (5pts) — none = 5, 1-2 instances = 3, 3+ = 0. Quote exact ungrounded text.

CategoryMatchStatus rules:
- No target provided → "No intent specified"
- Target primary matches detected primary → "PRIMARY MATCH"
- Target primary differs but partially supported → "WRONG PRIORITY"
- Target primary strongly conflicts → "PRIMARY MISMATCH"

Return JSON ONLY (no markdown, no code fences):

{
  "categoryMatchStatus": "PRIMARY MATCH|WRONG PRIORITY|PRIMARY MISMATCH|No intent specified",
  "groundingScore": 0,
  "groundingExplanation": "Quote title, list 3+ H2s, show score math, quote intro statements",
  "dimensionScores": {
    "introAudienceSignal": { "score": 0, "evidence": "exact intro quote", "reason": "" },
    "scopeConsistency": { "score": 0, "offTopicSections": [], "reason": "" },
    "contentDelivery": {
      "sectionDeliveryScore": 0,
      "claimSupportScore": 0,
      "ungroundedLanguageScore": 0,
      "totalScore": 0,
      "ungroundedClaims": [{ "section": "", "quote": "", "issue": "" }],
      "reason": ""
    }
  },
  "currentInterpretationSummary": "1-2 sentences",
  "intentAlignmentAssessment": { "status": "Aligned|Partially aligned|Mixed", "reason": "1-3 sentences" },
  "topMixedSignals": ["signal 1", "signal 2"],
  "sectionAnalysis": [
    {
      "heading": "exact heading text",
      "level": "h1|h2|h3",
      "position": "Section N of M",
      "expectedRole": "what this section should do given its position",
      "deliversOnPromise": true,
      "mixedSignals": [],
      "ungroundedClaims": [{ "quote": "", "issue": "" }],
      "suggestedEdits": [{ "location": "where exactly", "change": "the minimal edit", "reason": "why this improves intent clarity" }]
    }
  ],
  "expectedOutcome": "1-2 sentences"
}

RULES:
- sectionAnalysis must include every section provided — never skip any
- suggestedEdits per section: 1-3 specific edits only (omit suggestedEdits array if section is already clear)
- mixedSignals: only flag real issues, leave empty array if section is clear
- Never invent sections not in the outline
- ungroundedClaims: quote the exact text, explain why it lacks grounding — do not fact-check
`;

    const r = await fetch('/api/claude', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
    if (!r.ok) { const e = await r.json(); throw new Error(e?.error || 'Claude failed'); }
    const data = await r.json();
    const txt = data.content?.find(c => c.type === 'text')?.text || '';
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) throw new Error('Claude did not return valid JSON');
    return JSON.parse(m[0]);
  };

  const calcApiScores = (nlp, extraction) => {
    const conf = nlp.primaryCategory?.confidence || 0;
    const confScore = conf >= 0.90 ? 15 : conf >= 0.75 ? 11 : conf >= 0.60 ? 7 : 3;
    const gap = nlp.clarityGap || 0;
    const gapScore = gap >= 0.40 ? 10 : gap >= 0.25 ? 7 : gap >= 0.10 ? 4 : 0;
    const title = (extraction?.title || '').toLowerCase();
    const top5 = (nlp.entities || []).slice(0, 5);
    const titleHits = top5.filter(e => title.includes(e.name.toLowerCase())).length;
    const titleScore = titleHits >= 3 ? 15 : titleHits === 2 ? 13 : titleHits === 1 ? 7 : 0;
    const h2s = (extraction?.headings || []).filter(h => h.level === 'h2');
    const h2hits = h2s.filter(h => top5.some(e => h.text.toLowerCase().includes(e.name.toLowerCase()))).length;
    const hp = h2s.length ? h2hits / h2s.length : 0;
    const hScore = h2s.length ? Math.round(hp * (hp >= 0.75 ? 15 : hp >= 0.50 ? 10 : hp >= 0.25 ? 5 : 0)) : 0;
    return {
      categoryConfidence: { score: confScore, max: 15, confidence: (conf * 100).toFixed(1) },
      clarityGap: { score: gapScore, max: 10, gap: (gap * 100).toFixed(1) },
      titleEntityMatch: { score: titleScore, max: 15, matches: titleHits, topEntities: top5.map(e => e.name) },
      headingEntityMatch: { score: hScore, max: 15, matched: h2hits, total: h2s.length },
    };
  };

  const handleAnalyze = async () => {
    if (useManualInput && !manualContent?.trim()) { setError('Please paste your content'); return; }
    if (!useManualInput && !url?.trim()) { setError('Please enter a URL'); return; }
    setLoading(true); setError(''); setResults(null);
    try {
      let extraction = null, contentText = '';
      if (useManualInput) {
        contentText = manualContent;
        extraction = { title: 'Manual Content', introduction: extractIntro(manualContent), headings: [], text: manualContent };
      } else if (extensionData) {
        extraction = extensionData;
        // extensionData.text may be the field, fall back to fetching
        const rawText = extensionData.text || extensionData.content || '';
        contentText = rawText || (await fetchUrlContent(extensionData.url)).text || (await fetchUrlContent(extensionData.url)).content || '';
      } else {
        extraction = await fetchUrlContent(url);
        // /api/extract may return .text or .content — handle both
        contentText = extraction.text || extraction.content || '';
        if (!extraction.introduction) {
          extraction.introduction = extractIntro(contentText);
        }
      }

      // Guard: NLP requires at least 20 tokens
      const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 20) {
        throw new Error(
          contentText.trim().length === 0
            ? 'No text content could be extracted from this URL. Try switching to "Paste Content" and pasting the text manually.'
            : `Not enough text to analyze — only ${wordCount} words found. Google NLP requires at least 20 words.`
        );
      }

      const nlp = await analyzeNLP(contentText);
      const sentiment = await analyzeSentiment(contentText);
      const claude = await analyzeClaude(contentText, nlp, extraction);
      const apiScores = calcApiScores(nlp, extraction);
      setResults({ extraction, nlp, sentiment, claude, apiScores });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const total = results ? (() => {
    const a = results.apiScores, d = results.claude?.dimensionScores;
    return (a?.categoryConfidence?.score||0)+(a?.clarityGap?.score||0)+(a?.titleEntityMatch?.score||0)+(a?.headingEntityMatch?.score||0)+(d?.introAudienceSignal?.score||0)+(d?.scopeConsistency?.score||0)+(d?.contentDelivery?.totalScore||0);
  })() : 0;

  return (
    <div>
      <style>{STYLES}</style>

      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          Content Analyzer
        </div>
        <div className="nav-pill">Beta</div>
      </nav>

      <div className="hero">
        <div className="hero-tag"><div className="hero-dot" />Google NLP + Claude</div>
        <h1>Stop publishing content<br /><em>AI ignores.</em></h1>
        <p>Most pages aren't ignored because they're bad — they're ignored because they're ambiguous. Fix that with section-level edits backed by real classification data.</p>
      </div>

      <main className="main">

        <div className="help">
          <button className="help-btn" onClick={() => setShowHelp(v => !v)}>
            <Info size={13} />
            <span>How to get API keys</span>
            <ChevronDown size={13} style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: showHelp ? 'rotate(180deg)' : 'none' }} />
          </button>
          {showHelp && (
            <div className="help-body">
              <div style={{ marginBottom: '12px' }}>
                <strong>Google Cloud API Key (Optional)</strong>
                <ol style={{ marginTop: '5px' }}>
                  <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener">Google Cloud Console</a></li>
                  <li>Enable "Cloud Natural Language API"</li>
                  <li>Create credentials → API Key (starts with "AIza…")</li>
                </ol>
                <div style={{ marginTop: '6px', color: 'var(--olive)', fontSize: '12px' }}>Or leave blank — we use our backend key</div>
              </div>
              <div>
                <strong>Anthropic API Key</strong>
                <ol style={{ marginTop: '5px' }}>
                  <li>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener">Anthropic Console</a></li>
                  <li>Settings → API Keys → Create (starts with "sk-ant-…")</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        <div className="icard">
          <div className="icard-top"><span className="icard-lbl">Analyze content</span></div>
          <div className="icard-body">
            {extensionData && <div className="extb">✓ Chrome extension — {extensionData.headings.length} headings loaded</div>}

            <div className="tabs">
              <button className={`tab${!useManualInput ? ' on' : ''}`} onClick={() => setUseManualInput(false)}>Fetch URL</button>
              <button className={`tab${useManualInput ? ' on' : ''}`} onClick={() => setUseManualInput(true)}>Paste Content</button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              {!useManualInput ? (
                <><label className="flbl">URL to analyze</label><input type="url" className="finp" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/your-page" /></>
              ) : (
                <><label className="flbl">Paste your content</label><textarea className="finp fta" value={manualContent} onChange={e => setManualContent(e.target.value)} placeholder="Paste article text here — no HTML needed…" /></>
              )}
            </div>

            <div className="g2" style={{ marginBottom: '16px' }}>
              <CategoryPicker
                label="Intended primary category"
                value={intendedPrimary}
                onChange={setIntendedPrimary}
              />
              <CategoryPicker
                label="Intended secondary category"
                value={intendedSecondary}
                onChange={setIntendedSecondary}
              />
            </div>

            <div style={{ marginBottom: '22px' }}>
              <label className="flbl">Google Cloud API Key <span style={{ fontWeight: 400 }}>(optional)</span></label>
              <input type="password" className="finp" value={googleApiKey} onChange={e => setGoogleApiKey(e.target.value)} placeholder="AIza… leave blank to use our backend" />
            </div>

            <button className="btn" onClick={handleAnalyze} disabled={loading}>
              {loading ? <><div className="spin" />Analyzing…</> : <><Search size={15} />Analyze Content</>}
            </button>

            {error && (
              <div className="err">
                <AlertCircle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: '1px' }} />
                <div>
                  <div className="errt" style={{ fontWeight: 600, marginBottom: '2px' }}>Something went wrong</div>
                  <div className="errt">{error}</div>
                  {error.includes('fetch') && !useManualInput && <button className="btnsm" onClick={() => { setUseManualInput(true); setError(''); }}>Switch to Paste Content</button>}
                </div>
              </div>
            )}
          </div>
        </div>

        {results && (
          <div className="results">

            {/* Extracted Outline */}
            {results.extraction && (
              <div className="rc">
                <div className="rch">
                  <div className="rci" style={{ background: 'var(--olive-lt)' }}><Layers size={15} color="var(--olive)" /></div>
                  <div><div className="rct">Extracted Outline</div><div className="rcs">Title, introduction, and heading structure</div></div>
                </div>
                <div className="rcb">
                  <div style={{ marginBottom: '13px' }}>
                    <div className="flbl">Title</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--serif)', lineHeight: 1.4 }}>{results.extraction.title || '—'}</div>
                  </div>
                  {results.extraction.introduction && (
                    <div style={{ marginBottom: '15px' }}>
                      <div className="flbl">Introduction (first 250 words)</div>
                      <div className="introb">{results.extraction.introduction}</div>
                    </div>
                  )}
                  {results.extraction.headings?.length > 0 && (
                    <div>
                      <div className="flbl">Heading Structure</div>
                      <div className="osc">
                        {results.extraction.headings.map((h, i) => {
                          const lv = String(h.level || '').toLowerCase();
                          const s = lv === 'h1' ? { bg: '#ece9f8', color: '#5b4fcf' } : lv === 'h2' ? { bg: 'var(--olive-lt)', color: 'var(--olive)' } : { bg: 'var(--amber-lt)', color: 'var(--amber)' };
                          return (
                            <div key={i} className="hrow">
                              <span className="lvl" style={{ background: s.bg, color: s.color }}>{lv.toUpperCase()}</span>
                              <span style={{ fontSize: '13px', color: lv === 'h1' ? 'var(--ink)' : 'var(--ink2)', fontWeight: lv === 'h1' ? 600 : 400 }}>{h.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Category Detection */}
            <div className="rc">
              <div className="rch">
                <div className="rci" style={{ background: 'var(--olive-lt)' }}><BarChart2 size={15} color="var(--olive)" /></div>
                <div style={{ flex: 1 }}><div className="rct">Category Detection</div><div className="rcs">Google NLP classification</div></div>
                {results.claude?.categoryMatchStatus && (() => {
                  const s = results.claude.categoryMatchStatus;
                  const cls = s.includes('MATCH') && !s.includes('MIS') ? 'bg' : s.includes('WRONG') ? 'ba' : s.includes('MIS') ? 'br' : 'bgy';
                  return <span className={`bdg ${cls}`}>{s}</span>;
                })()}
              </div>
              <div className="rcb">
                <div className="g3">
                  <div className="st">
                    <div className="stl">Primary</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>{results.nlp.primaryCategory?.name || 'N/A'}</div>
                    <div className="sts" style={{ color: 'var(--olive)', fontFamily: 'var(--mono)', fontSize: '12px' }}>{results.nlp.primaryCategory ? `${(results.nlp.primaryCategory.confidence * 100).toFixed(1)}%` : ''}</div>
                  </div>
                  <div className="st">
                    <div className="stl">Secondary</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4 }}>{results.nlp.secondaryCategory?.name || 'None'}</div>
                    <div className="sts" style={{ color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: '12px' }}>{results.nlp.secondaryCategory ? `${(results.nlp.secondaryCategory.confidence * 100).toFixed(1)}%` : ''}</div>
                  </div>
                  <div className="st">
                    <div className="stl">Clarity Gap</div>
                    <div className="stv" style={{ fontFamily: 'var(--mono)' }}>{(results.nlp.clarityGap * 100).toFixed(1)}%</div>
                    <div className="sts" style={{ color: results.nlp.alignmentStatus === 'Aligned' ? 'var(--olive)' : results.nlp.alignmentStatus === 'Mixed (Acceptable)' ? 'var(--amber)' : 'var(--red)' }}>{results.nlp.alignmentStatus}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scoring Rubric */}
            {results.apiScores && (() => {
              const a = results.apiScores, d = results.claude?.dimensionScores;
              const dims = [
                { label: 'Category Confidence', src: 'NLP API', api: true, score: a.categoryConfidence.score, max: 15, detail: `Primary confidence: ${a.categoryConfidence.confidence}%` },
                { label: 'Clarity Gap', src: 'NLP API', api: true, score: a.clarityGap.score, max: 10, detail: `Gap between primary and secondary: ${a.clarityGap.gap}%` },
                { label: 'Title-to-Entity Match', src: 'NLP API', api: true, score: a.titleEntityMatch.score, max: 15, detail: `${a.titleEntityMatch.matches} of top 5 entities in title${a.titleEntityMatch.topEntities.length ? ': ' + a.titleEntityMatch.topEntities.join(', ') : ''}` },
                { label: 'Heading-to-Entity Match', src: 'NLP API', api: true, score: a.headingEntityMatch.score, max: 15, detail: `${a.headingEntityMatch.matched} of ${a.headingEntityMatch.total} H2s contain a salient entity` },
                { label: 'Intro Audience Signal', src: 'Claude', api: false, score: d?.introAudienceSignal?.score || 0, max: 10, detail: d?.introAudienceSignal?.evidence || d?.introAudienceSignal?.reason || '—' },
                { label: 'Scope Consistency', src: 'Claude', api: false, score: d?.scopeConsistency?.score || 0, max: 10, detail: d?.scopeConsistency?.reason || '—' },
                { label: 'Content Delivery & Claim Grounding', src: 'Claude', api: false, score: d?.contentDelivery?.totalScore || 0, max: 25, detail: d?.contentDelivery?.reason || '—',
                  breakdown: d?.contentDelivery ? [{ label: 'Section delivery', score: d.contentDelivery.sectionDeliveryScore, max: 10 }, { label: 'Claim support', score: d.contentDelivery.claimSupportScore, max: 10 }, { label: 'Ungrounded language', score: d.contentDelivery.ungroundedLanguageScore, max: 5 }] : null },
              ];
              return (
                <div className="rc">
                  <div className="rch">
                    <div className="rci" style={{ background: 'var(--olive-lt)' }}><Zap size={15} color="var(--olive)" /></div>
                    <div style={{ flex: 1 }}><div className="rct">Content Clarity Score</div><div className="rcs">65 of 100 points grounded in NLP API data</div></div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px', color: sfill(total / 100) }}>{total}</span>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--muted)' }}>/100</span>
                    </div>
                  </div>
                  <div style={{ padding: '0 22px' }}><Bar score={total} max={100} h={6} /></div>
                  <div className="rcb" style={{ paddingTop: '13px' }}>
                    {dims.map((dim, i) => (
                      <div key={i} className="dr">
                        <div className="drh">
                          <div className="drl">
                            <span className={`bdg ${dim.api ? 'bg' : 'bgy'}`}>{dim.src}</span>
                            <span className="drn">{dim.label}</span>
                          </div>
                          <div className="drr">
                            <div style={{ width: '80px' }}><Bar score={dim.score} max={dim.max} /></div>
                            <span className="drs" style={{ color: sfill(dim.score / dim.max) }}>{dim.score}/{dim.max}</span>
                          </div>
                        </div>
                        <div className="drd">{dim.detail}</div>
                        {dim.breakdown && (
                          <div className="drb">
                            {dim.breakdown.map((b, j) => (
                              <div key={j} className="drbr">
                                <span>{b.label}</span>
                                <span style={{ color: sfill(b.score / b.max) }}>{b.score}/{b.max}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {d?.contentDelivery?.ungroundedClaims?.length > 0 && (
                      <div style={{ marginTop: '15px', padding: '13px', background: 'var(--red-lt)', border: '1px solid rgba(184,50,36,0.14)', borderRadius: '10px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--red)', marginBottom: '9px' }}>Ungrounded Claims</div>
                        {d.contentDelivery.ungroundedClaims.map((c, i) => (
                          <div key={i} className="clm">
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '3px', fontFamily: 'var(--mono)' }}>{c.section}</div>
                            <div className="clmq">"{c.quote}"</div>
                            <div className="clmi">{c.issue}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {results.claude?.groundingScore !== undefined && (() => {
                      const raw = results.claude.groundingExplanation || '';
                      const KNOWN_LABELS = [
                        'Title Clarity', 'Structural Alignment', 'Introduction Anchoring',
                        'Content Verification', 'Audience Definition',
                        'Title', 'Structure', 'Introduction', 'Headings', 'Audience', 'Score', 'Total'
                      ];
                      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
                      const sections = [];
                      let current = null;
                      for (const line of lines) {
                        const isHeading = KNOWN_LABELS.some(lbl =>
                          line.toLowerCase().startsWith(lbl.toLowerCase() + ':') ||
                          line.toLowerCase().startsWith(lbl.toLowerCase() + ' (')
                        );
                        if (isHeading) {
                          if (current) sections.push(current);
                          const colonIdx = line.indexOf(':');
                          const lbl = colonIdx > -1 ? line.slice(0, colonIdx) : line;
                          const rest = colonIdx > -1 ? line.slice(colonIdx + 1).trim() : '';
                          current = { label: lbl.trim(), lines: rest ? [rest] : [] };
                        } else if (current) {
                          current.lines.push(line);
                        } else {
                          sections.push({ label: null, lines: [line] });
                        }
                      }
                      if (current) sections.push(current);
                      const hasStructure = sections.some(s => s.label);
                      return (
                        <div style={{ marginTop: '15px', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--muted)' }}>Grounding Score (Claude)</div>
                            <span style={{ fontFamily: 'var(--serif)', fontSize: '18px', fontWeight: 700, color: sfill(results.claude.groundingScore / 100) }}>
                              {results.claude.groundingScore}<span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 400 }}>/100</span>
                            </span>
                          </div>
                          <div style={{ padding: '0 16px 4px' }}>
                            <div style={{ padding: '10px 0 12px' }}><Bar score={results.claude.groundingScore} max={100} h={5} /></div>
                          </div>
                          {raw && (
                            <div style={{ borderTop: '1px solid var(--border)' }}>
                              {hasStructure ? sections.map((sec, si) => (
                                <div key={si} style={{ padding: '10px 16px', borderBottom: si < sections.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                  {sec.label && (
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--olive)', marginBottom: '4px' }}>{sec.label}</div>
                                  )}
                                  {sec.lines.map((ln, li) => (
                                    <div key={li} style={{ fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.65 }}>{ln}</div>
                                  ))}
                                </div>
                              )) : (
                                <div style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink2)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{raw}</div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })()}

            {/* Sentiment */}
            {results.sentiment && (
              <div className="rc">
                <div className="rch">
                  <div className="rci" style={{ background: 'var(--amber-lt)' }}><BarChart2 size={15} color="var(--amber)" /></div>
                  <div><div className="rct">Content Sentiment</div><div className="rcs">Tone and emotional intensity</div></div>
                </div>
                <div className="rcb">
                  <div className="g2">
                    <div className="st">
                      <div className="stl">Sentiment</div>
                      <div className="stv" style={{ color: results.sentiment.documentSentiment.score >= 0.25 ? 'var(--olive)' : results.sentiment.documentSentiment.score <= -0.25 ? 'var(--red)' : 'var(--muted)' }}>
                        {results.sentiment.documentSentiment.score >= 0.25 ? 'Positive' : results.sentiment.documentSentiment.score <= -0.25 ? 'Negative' : 'Neutral'}
                      </div>
                      <div className="sts" style={{ color: 'var(--muted)', fontFamily: 'var(--mono)' }}>Score: {results.sentiment.documentSentiment.score.toFixed(2)}</div>
                    </div>
                    <div className="st">
                      <div className="stl">Emotional Intensity</div>
                      <div className="stv" style={{ fontFamily: 'var(--mono)' }}>{results.sentiment.documentSentiment.magnitude.toFixed(1)}</div>
                      <div className="sts" style={{ color: 'var(--muted)' }}>{results.sentiment.documentSentiment.magnitude < 1 ? 'Very Low' : results.sentiment.documentSentiment.magnitude < 3 ? 'Low' : results.sentiment.documentSentiment.magnitude < 5 ? 'Moderate' : results.sentiment.documentSentiment.magnitude < 8 ? 'High' : 'Very High'}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section Analysis */}
            {results.claude?.sectionAnalysis?.length > 0 && (
              <div className="rc">
                <div className="rch">
                  <div className="rci" style={{ background: 'var(--olive-lt)' }}><Layers size={15} color="var(--olive)" /></div>
                  <div><div className="rct">Section-by-Section Analysis</div><div className="rcs">Expand each section for targeted edits</div></div>
                </div>
                <div className="rcb">
                  {results.claude.sectionAnalysis.map((s, i) => <SecAcc key={i} section={s} />)}
                </div>
              </div>
            )}

            {/* Intent & Clarity */}
            {results.claude && (
              <div className="rc">
                <div className="rch">
                  <div className="rci" style={{ background: 'var(--olive-lt)' }}><ArrowRight size={15} color="var(--olive)" /></div>
                  <div><div className="rct">Intent & Clarity</div><div className="rcs">Page-level interpretation and recommendations</div></div>
                </div>
                <div className="rcb">
                  {results.claude.currentInterpretationSummary && (
                    <div className="ir"><div className="irl">Current Interpretation</div><div className="irv">{results.claude.currentInterpretationSummary}</div></div>
                  )}
                  {results.claude.intentAlignmentAssessment && (
                    <div className="ir">
                      <div className="irl">Alignment</div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '5px' }}>
                        <span className={`bdg ${results.claude.intentAlignmentAssessment.status === 'Aligned' ? 'bg' : results.claude.intentAlignmentAssessment.status === 'Mixed' ? 'br' : 'ba'}`}>{results.claude.intentAlignmentAssessment.status}</span>
                        <span className="irv">{results.claude.intentAlignmentAssessment.reason}</span>
                      </div>
                    </div>
                  )}
                  {results.claude.topMixedSignals?.length > 0 && (
                    <div className="ir">
                      <div className="irl">Top Mixed Signals</div>
                      <div style={{ marginTop: '6px' }}>
                        {results.claude.topMixedSignals.map((s, i) => (
                          <div key={i} className="sig"><span style={{ color: 'var(--amber)', flexShrink: 0 }}>⚠</span><span>{s}</span></div>
                        ))}
                      </div>
                    </div>
                  )}
                  {results.claude.expectedOutcome && (
                    <div className="ir"><div className="irl">Expected Outcome</div><div className="irv">{results.claude.expectedOutcome}</div></div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        <div style={{ textAlign: 'center', padding: '52px 0 16px', fontSize: '12px', color: 'var(--muted)' }}>
          Built with Google Cloud Natural Language API & Anthropic Claude
        </div>
      </main>
    </div>
  );
}