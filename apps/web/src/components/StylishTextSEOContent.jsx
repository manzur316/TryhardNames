
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const StylishTextSEOContent = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is a stylish text generator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A stylish text generator is a free online tool that converts normal text into fancy fonts, cool symbols, and aesthetic text using Unicode characters. It allows you to copy and paste unique text styles for social media, gaming, and messaging apps."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use stylish text on Instagram?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! The fancy fonts generated here use standard Unicode characters that are fully supported by Instagram. You can copy and paste them into your Instagram bio, captions, and comments to make your profile stand out."
        }
      },
      {
        "@type": "Question",
        "name": "Are these fonts compatible with all platforms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most of our stylish fonts are compatible with major platforms including Instagram, Twitter, Facebook, TikTok, Discord, and WhatsApp. However, some older devices or specific games might not render complex symbols correctly."
        }
      },
      {
        "@type": "Question",
        "name": "How do I copy stylish text?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply type your text into the input box, browse the generated styles, and click the 'Copy' button next to your favorite font. The text will be instantly copied to your clipboard, ready to be pasted anywhere."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use stylish text in Fortnite or Valorant?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, many of our stylish texts and symbols work in popular games. Fortnite supports many Unicode symbols, while Valorant allows clean aesthetic fonts. Always check the specific game's naming rules, as some heavily modified texts might be restricted."
        }
      },
      {
        "@type": "Question",
        "name": "What are the best stylish fonts for gaming?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "For gaming, players often prefer 'Fancy Serif', 'Small Caps', or 'Monospace' for a clean, competitive look. Adding 'Gamer Symbols' like stars (★) or lightning bolts (⚡) is also very popular for tryhard names."
        }
      },
      {
        "@type": "Question",
        "name": "Is the stylish text generator free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Our stylish text generator is 100% free to use. You can generate and copy as many fancy fonts and aesthetic texts as you want without any limits."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use these fonts on Discord?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Discord fully supports Unicode characters. You can use our generated text for your Discord username, server nicknames, channel names, and regular chat messages."
        }
      },
      {
        "@type": "Question",
        "name": "How do I make my own stylish text?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can create your own stylish text by combining different generated fonts with our symbol libraries. Try generating a 'Small Caps' name and manually adding 'Aesthetic Sparkles' to create a unique combination."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between fonts and symbols?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In this context, 'fonts' refer to Unicode characters that resemble the alphabet (like cursive or bold letters), while 'symbols' are decorative characters (like stars, hearts, or weapons) that you can add alongside your text."
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="max-w-4xl mx-auto py-12 space-y-12 md:space-y-16">
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-lg text-foreground/90 leading-relaxed">
            Welcome to the ultimate <strong>Free Stylish Text Generator</strong>. Whether you're looking to spice up your Instagram bio, create an intimidating gaming name, or send aesthetic messages on Discord, our tool converts your normal text into hundreds of unique, eye-catching formats instantly.
          </p>
        </div>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Fancy Fonts Copy Paste</h2>
          <p className="text-foreground/90 leading-relaxed">
            Our generator uses standard Unicode characters to create the illusion of different fonts. Because these are actual text characters and not images, you can easily copy and paste them anywhere that supports text input. From elegant cursive and script fonts to bold and double-struck letters, you have endless options to express your digital identity.
          </p>
          <p className="text-foreground/90 leading-relaxed">
            Unlike traditional fonts that require installation, these Unicode characters are built into modern operating systems. This means when you paste your fancy text on social media platforms like Twitter, Facebook, or TikTok, everyone will see exactly what you see.
          </p>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">Gamer Stylish Text</h2>
          <p className="text-foreground/90 leading-relaxed">
            In the competitive gaming world, your name is your brand. A standard text name often gets lost in the kill feed. By using our stylish text generator, you can create sweaty, tryhard names that command respect. Combine our text styles with our dedicated game name generators for the ultimate gaming persona:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <li><Link to="/fortnite/tryhard" className="text-primary hover:underline flex items-center gap-2">★ Fortnite Names</Link></li>
            <li><Link to="/valorant/sweaty" className="text-secondary hover:underline flex items-center gap-2">★ Valorant Names</Link></li>
            <li><Link to="/cod/sweaty" className="text-green-500 hover:underline flex items-center gap-2">★ Call of Duty Names</Link></li>
          </ul>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-accent">Aesthetic Text Generator</h2>
          <p className="text-foreground/90 leading-relaxed">
            The aesthetic text trend (often associated with vaporwave or soft grunge styles) is perfect for creating a specific vibe on your profiles. Our generator includes fullwidth characters (ｖａｐｏｒｗａｖｅ), cute bubble letters (ⓑⓤⓑⓑⓛⓔ), and text surrounded by sparkles and stars (✧･ﾟ: *✧･ﾟ:*). These styles are incredibly popular on Tumblr, Pinterest, and aesthetic Discord servers.
          </p>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-primary">Cool Symbols for Nicknames</h2>
          <p className="text-foreground/90 leading-relaxed">
            Sometimes, a cool font isn't enough. That's why we've integrated popular gamer and aesthetic symbols directly into the generator. You can instantly add lightning bolts (⚡), swords (⚔️), crowns (♛), and more to your text. These symbols are perfect for clan tags or making a short, 3-letter name look more complex and unique.
          </p>
        </article>

        <article className="space-y-4 border-t border-border/15 pt-10 md:pt-14">
          <h2 className="text-3xl font-bold text-secondary">How to Use Stylish Text Generator</h2>
          <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4 shadow-refined">
            <ol className="list-decimal list-inside space-y-3 text-foreground/90">
              <li><strong>Type your text:</strong> Enter your desired name, bio, or message into the input box at the top of the page.</li>
              <li><strong>Browse styles:</strong> Scroll through the grid of generated styles. The text updates in real-time as you type.</li>
              <li><strong>Copy:</strong> Click the "Copy" button next to the style you like best. You'll see a success notification.</li>
              <li><strong>Paste:</strong> Go to your game, social media app, or chat, and paste (Ctrl+V or Cmd+V) the stylish text.</li>
            </ol>
          </div>
        </article>

        {/* FAQ Section */}
        <article className="space-y-8 bg-card border border-border/50 rounded-2xl p-8 shadow-refined mt-16">
          <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
            Frequently Asked Questions
          </h2>
          
          <div className="grid gap-6">
            {faqSchema.mainEntity.map((faq, idx) => (
              <div key={idx} className="space-y-2 border-b border-border/15 pb-6 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold text-primary">{faq.name}</h3>
                <p className="text-foreground/80 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
};

export default StylishTextSEOContent;
