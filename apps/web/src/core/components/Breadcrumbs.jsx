
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs on homepage
  if (pathSegments.length === 0) {
    return null;
  }

  // Static route titles
  const staticTitles = {
    'roblox-names': 'Roblox Names',
    'gamer-names': 'Gamer Names',
    'stylish-text-generator': 'Stylish Text Generator',
    'nickname-symbols': 'Nickname Symbols'
  };

  const breadcrumbItems = [];

  // For static routes (single segment)
  if (pathSegments.length === 1) {
    const segment = pathSegments[0];
    if (staticTitles[segment]) {
      breadcrumbItems.push({
        name: staticTitles[segment],
        path: `/${segment}`,
        isLast: true
      });
    }
  }

  // For dynamic routes (multi-segment: /category/keyword)
  if (pathSegments.length === 2) {
    const [category, keyword] = pathSegments;
    // Format the title from the keyword (e.g., 'sweaty' -> 'Sweaty')
    const formattedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1);
    
    breadcrumbItems.push({
      name: `${formattedCategory} - ${formattedKeyword}`,
      path: `/${category}/${keyword}`,
      isLast: true
    });
  }

  // Don't render if no valid breadcrumb items
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        <li>
          <Link 
            to="/" 
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home className="w-4 h-4 mr-1" />
            <span>Home</span>
          </Link>
        </li>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            </li>
            <li>
              {item.isLast ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  className="hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
