import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet';

const Breadcrumb = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tryhardnames.com/"
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.name,
        "item": `https://tryhardnames.com${item.path}`
      }))
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <nav className="flex items-center space-x-2 text-sm text-foreground/60 mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="flex items-center hover:text-primary transition-colors">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            {index === items.length - 1 ? (
              <span className="text-primary font-medium">{item.name}</span>
            ) : (
              <Link to={item.path} className="hover:text-primary transition-colors">
                {item.name}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;