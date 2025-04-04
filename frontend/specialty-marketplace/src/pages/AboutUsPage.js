import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import aboutData from '../data/aboutUsData.json';
import {
    FaAward, FaUsers, FaSearch, FaComments, FaLeaf,
    FaLinkedin, FaTwitter, FaGithub, FaPinterest,
    FaLaptopCode, FaCogs, FaReact, FaDatabase, FaUserLock
} from 'react-icons/fa';

import '../styles/AboutUsPage.css'; // Ensure styles are imported

const iconMap = {
    FaLaptopCode,
    FaCogs,
    FaReact,
    FaDatabase,
    FaUserLock,
    FaLinkedin,
    FaTwitter,
    FaGithub,
    FaPinterest,
    FaAward,
    FaUsers,
    FaSearch,
    FaComments,
    FaLeaf
};

const AboutUsPage = () => {
    // Destructure data from the imported JSON for easier access
    const { hero, ourStory, ourValues, meetTheTeam } = aboutData;

    return (
        <div className="page-container about-us-page">
            <Navbar />
            <main className="about-us-content-area">
                {/* --- Hero Section --- */}
                <section
                    className="about-hero-section"
                    // Apply background image dynamically from JSON
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${hero.imageUrl})` }}
                >
                    <div className="hero-content">
                        <h1>{hero.title}</h1>
                        <p>{hero.tagline}</p>
                    </div>
                </section>

                {/* --- Project Overview Section --- */}
                <section className="about-content-section story-section">
                    <h2>{ourStory.title}</h2>
                    {/* Map through paragraphs from JSON */}
                    {ourStory.paragraphs.map((paragraph, index) => (
                        // Use dangerouslySetInnerHTML ONLY if you trust the JSON source
                        // and need to render the bold tags. Otherwise, parse manually.
                        // For simple bold, manual parsing or specific styling is safer.
                        // Example without dangerouslySetInnerHTML (assuming simple text):
                         <p key={index}>{paragraph}</p>
                        // If you need bold:
                        // <p key={index} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                    ))}
                </section>

                {/* --- Project Focus Areas Section --- */}
                <section className="about-content-section values-section">
                    <h2>{ourValues.title}</h2>
                    <div className="values-grid">
                        {/* Map through focus area items from JSON */}
                        {ourValues.items.map((value) => {
                            // Look up the corresponding icon component using the name from JSON
                            const IconComponent = iconMap[value.icon];
                            return (
                                <div key={value.id} className="value-card">
                                    {/* Render the icon component if found */}
                                    {IconComponent && <IconComponent className="value-icon" />}
                                    <h3>{value.title}</h3>
                                    <p>{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* --- About the Developer Section --- */}
                <section className="about-content-section team-section">
                    <h2>{meetTheTeam.title}</h2>
                    <p className="team-intro">{meetTheTeam.intro}</p>
                    <div className="team-grid">
                        {/* Map through team members (now just one) from JSON */}
                        {meetTheTeam.members.map((member) => (
                            <div key={member.id} className="team-member-card">
                                <img src={member.imageUrl} alt={member.name} className="team-member-image" />
                                <h3 className="team-member-name">{member.name}</h3>
                                <p className="team-member-title">{member.title}</p>
                                <p className="team-member-bio">{member.bio}</p>
                                {/* Render social links if they exist */}
                                {member.socialLinks && (
                                    <div className="team-member-social">
                                        {/* Iterate through the socialLinks object */}
                                        {Object.entries(member.socialLinks).map(([platform, url]) => {
                                             // Map platform name (lowercase) to the correct icon component
                                             const PlatformIcon = iconMap[`Fa${platform.charAt(0).toUpperCase() + platform.slice(1)}`];
                                            // Render link only if URL and Icon exist
                                            return (
                                                url && PlatformIcon && (
                                                     <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Link to ${platform}`}>
                                                         <PlatformIcon />
                                                     </a>
                                                )
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
};

export default AboutUsPage;