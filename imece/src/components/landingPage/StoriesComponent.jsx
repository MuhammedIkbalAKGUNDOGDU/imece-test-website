import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { storiesService } from "../../services/campaignsAndStoriesService";

const StoriesComponent = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [currentSection, setCurrentSection] = useState("campaigns"); // 'campaigns' or 'stories'
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [storiesData, setStoriesData] = useState({
    campaigns: [],
    stories: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories and campaigns from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(
          "🎯 StoriesComponent: Hikayeler ve kampanyalar yükleniyor..."
        );
        setIsLoading(true);

        // Fetch both stories and campaign stories in parallel
        const [storiesResponse, campaignStoriesResponse] = await Promise.all([
          storiesService.getStories().catch((err) => {
            console.error("❌ StoriesComponent: Stories fetch error:", err);
            console.error(
              "❌ StoriesComponent: Stories error response:",
              err.response?.data
            );
            console.error(
              "❌ StoriesComponent: Stories error status:",
              err.response?.status
            );
            return { data: [] };
          }),
          storiesService.getCampaignStories().catch((err) => {
            console.error(
              "❌ StoriesComponent: Campaign stories fetch error:",
              err
            );
            console.error(
              "❌ StoriesComponent: Campaign stories error response:",
              err.response?.data
            );
            console.error(
              "❌ StoriesComponent: Campaign stories error status:",
              err.response?.status
            );
            return { data: [] };
          }),
        ]);

        console.log(
          "📊 StoriesComponent: Stories API Response:",
          storiesResponse
        );
        console.log(
          "📊 StoriesComponent: Campaign Stories API Response:",
          campaignStoriesResponse
        );
        console.log(
          "📊 StoriesComponent: Stories Response Data:",
          storiesResponse.data
        );
        console.log(
          "📊 StoriesComponent: Campaign Stories Response Data:",
          campaignStoriesResponse.data
        );
        console.log(
          "📊 StoriesComponent: Stories Type:",
          typeof storiesResponse,
          "Is Array:",
          Array.isArray(storiesResponse)
        );
        console.log(
          "📊 StoriesComponent: Campaign Stories Type:",
          typeof campaignStoriesResponse,
          "Is Array:",
          Array.isArray(campaignStoriesResponse)
        );

        // Django'dan gelen veri yapısı: {message: "...", data: [...]}
        const storiesData = storiesResponse.data || [];
        const campaignStoriesData = campaignStoriesResponse.data || [];
        console.log(
          "📊 StoriesComponent: Extracted Stories Data:",
          storiesData
        );
        console.log(
          "📊 StoriesComponent: Extracted Campaign Stories Data:",
          campaignStoriesData
        );
        console.log(
          "📊 StoriesComponent: Stories Data Length:",
          storiesData.length
        );
        console.log(
          "📊 StoriesComponent: Campaign Stories Data Length:",
          campaignStoriesData.length
        );

        // Transform API data to match component structure
        const transformedStories = Array.isArray(storiesData)
          ? storiesData.map((story) => {
              console.log("🔄 StoriesComponent: Story dönüştürülüyor:", story);
              console.log(
                "🔄 StoriesComponent: Story.photo raw value:",
                story.photo
              );
              console.log(
                "🔄 StoriesComponent: Story.photo type:",
                typeof story.photo
              );
              console.log(
                "🔄 StoriesComponent: Story.photo starts with /media/:",
                story.photo?.startsWith("/media/")
              );

              // Django'dan gelen photo dosya adını tam URL'ye çevir
              let imageUrl;
              if (story.photo) {
                if (story.photo.startsWith("/media/")) {
                  imageUrl = `https://imecehub.com${story.photo}`;
                  console.log(
                    "🔄 StoriesComponent: Media URL constructed:",
                    imageUrl
                  );
                } else if (story.photo.startsWith("http")) {
                  imageUrl = story.photo;
                  console.log("🔄 StoriesComponent: Full URL used:", imageUrl);
                } else {
                  imageUrl = `https://imecehub.com/media/${story.photo}`;
                  console.log(
                    "🔄 StoriesComponent: Media path constructed:",
                    imageUrl
                  );
                }
              } else {
                imageUrl =
                  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop";
                console.log("🔄 StoriesComponent: Default Unsplash URL used");
              }

              console.log("🔄 StoriesComponent: Final imageUrl:", imageUrl);

              // Profile image için içerikle aynı resmi kullan (150x150 boyutunda)
              let profileImageUrl;
              if (story.photo) {
                if (story.photo.startsWith("/media/")) {
                  profileImageUrl = `https://imecehub.com${story.photo}`;
                } else if (story.photo.startsWith("http")) {
                  profileImageUrl = story.photo;
                } else {
                  profileImageUrl = `https://imecehub.com/media/${story.photo}`;
                }
              } else {
                // Default avatar'lar
                switch (story.type) {
                  case "campaign":
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                    break;
                  case "story":
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                    break;
                  default:
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face";
                }
              }

              console.log(
                "🔄 StoriesComponent: Profile Image URL:",
                profileImageUrl
              );

              return {
                id: story.id,
                title: story.description || "Hikaye", // API'de title yok, description kullanıyoruz
                image: imageUrl,
                duration: 5000, // API'de duration yok, default değer
                description: story.description || "",
                username:
                  story.type === "campaign" ? "kampanyalar" : "imecehub",
                profileImage: profileImageUrl,
                type: story.type,
                is_active: story.is_active,
                created_at: story.created_at,
              };
            })
          : [];

        const transformedCampaigns = Array.isArray(campaignStoriesData)
          ? campaignStoriesData.map((campaign) => {
              console.log(
                "🔄 StoriesComponent: Campaign story dönüştürülüyor:",
                campaign
              );
              console.log(
                "🔄 StoriesComponent: Campaign.photo raw value:",
                campaign.photo
              );
              console.log(
                "🔄 StoriesComponent: Campaign.photo type:",
                typeof campaign.photo
              );
              console.log(
                "🔄 StoriesComponent: Campaign.photo starts with /media/:",
                campaign.photo?.startsWith("/media/")
              );

              // Django'dan gelen photo dosya adını tam URL'ye çevir
              let imageUrl;
              if (campaign.photo) {
                if (campaign.photo.startsWith("/media/")) {
                  imageUrl = `https://imecehub.com${campaign.photo}`;
                  console.log(
                    "🔄 StoriesComponent: Campaign Media URL constructed:",
                    imageUrl
                  );
                } else if (campaign.photo.startsWith("http")) {
                  imageUrl = campaign.photo;
                  console.log(
                    "🔄 StoriesComponent: Campaign Full URL used:",
                    imageUrl
                  );
                } else {
                  imageUrl = `https://imecehub.com/media/${campaign.photo}`;
                  console.log(
                    "🔄 StoriesComponent: Campaign Media path constructed:",
                    imageUrl
                  );
                }
              } else {
                imageUrl =
                  "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=600&fit=crop";
                console.log(
                  "🔄 StoriesComponent: Campaign Default Unsplash URL used"
                );
              }

              console.log(
                "🔄 StoriesComponent: Campaign Final imageUrl:",
                imageUrl
              );

              // Profile image için içerikle aynı resmi kullan (150x150 boyutunda)
              let profileImageUrl;
              if (campaign.photo) {
                if (campaign.photo.startsWith("/media/")) {
                  profileImageUrl = `https://imecehub.com${campaign.photo}`;
                } else if (campaign.photo.startsWith("http")) {
                  profileImageUrl = campaign.photo;
                } else {
                  profileImageUrl = `https://imecehub.com/media/${campaign.photo}`;
                }
              } else {
                // Default avatar'lar
                switch (campaign.type) {
                  case "campaign":
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
                    break;
                  case "story":
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
                    break;
                  default:
                    profileImageUrl =
                      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face";
                }
              }

              console.log(
                "🔄 StoriesComponent: Campaign Profile Image URL:",
                profileImageUrl
              );

              return {
                id: campaign.id,
                title: campaign.description || "Kampanya", // API'de title yok, description kullanıyoruz
                image: imageUrl,
                duration: 5000, // API'de duration yok, default değer
                description: campaign.description || "",
                username: "kampanyalar",
                profileImage: profileImageUrl,
                type: campaign.type,
                is_active: campaign.is_active,
                created_at: campaign.created_at,
              };
            })
          : [];

        console.log(
          "✅ StoriesComponent: Dönüştürülmüş stories:",
          transformedStories
        );
        console.log(
          "✅ StoriesComponent: Dönüştürülmüş campaign stories:",
          transformedCampaigns
        );

        setStoriesData({
          campaigns: transformedCampaigns,
          stories: transformedStories,
        });
      } catch (err) {
        console.error("❌ StoriesComponent: Stories data fetch error:", err);
        console.error(
          "❌ StoriesComponent: Error response:",
          err.response?.data
        );
        console.error(
          "❌ StoriesComponent: Error status:",
          err.response?.status
        );
        setError("Hikayeler yüklenemedi");

        // Set empty data if API fails
        setStoriesData({
          campaigns: [],
          stories: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get current stories based on section
  const currentStories =
    currentSection === "campaigns"
      ? storiesData.campaigns
      : storiesData.stories;

  // Progress bar animation
  useEffect(() => {
    if (currentStoryIndex !== null && isPlaying && currentStories.length > 0) {
      const story = currentStories[currentStoryIndex];
      const duration = story?.duration || 5000;

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + 100 / (duration / 100);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStoryIndex, currentSection, isPlaying, currentStories]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    } else {
      setCurrentStoryIndex(currentStories.length - 1);
    }
    setProgress(0);
  };

  const handleNext = () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    } else {
      setCurrentStoryIndex(0);
    }
    setProgress(0);
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setCurrentStoryIndex(null); // Modal'ı kapat
    setProgress(0);
  };

  const handleStoryClick = (index) => {
    setCurrentStoryIndex(index);
    setProgress(0);
  };

  // Handle click on screen to pause/resume
  const handleScreenClick = (e) => {
    // Only toggle play/pause if clicking on the main content area, not on buttons
    if (
      e.target.classList.contains("fullscreen-story-content") ||
      e.target.classList.contains("fullscreen-story-image") ||
      e.target.classList.contains("pause-overlay") ||
      e.target.classList.contains("pause-icon") ||
      e.target.classList.contains("pause-text")
    ) {
      setIsPlaying(!isPlaying);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (currentStoryIndex !== null) {
        if (e.key === "Escape") {
          setCurrentStoryIndex(null);
        } else if (e.key === " ") {
          e.preventDefault(); // Prevent page scroll
          setIsPlaying(!isPlaying);
        }
      }
    };

    if (currentStoryIndex !== null) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [currentStoryIndex, isPlaying]);

  if (isLoading) {
    return (
      <div className="stories-container">
        <div className="stories-header">
          <div className="stories-tabs">
            <button className="tab-button active">Kampanyalar</button>
            <button className="tab-button">Hikayeler</button>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error && currentStories.length === 0) {
    return (
      <div className="stories-container">
        <div className="stories-header">
          <div className="stories-tabs">
            <button className="tab-button active">Kampanyalar</button>
            <button className="tab-button">Hikayeler</button>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stories-container">
      {/* Instagram Stories Style */}
      <div className="stories-header">
        <div className="stories-tabs">
          <button
            className={`tab-button ${
              currentSection === "campaigns" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("campaigns")}
          >
            Kampanyalar
          </button>
          <button
            className={`tab-button ${
              currentSection === "stories" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("stories")}
          >
            Hikayeler
          </button>
        </div>
      </div>

      {/* Stories Row */}
      <div className="stories-row">
        {currentStories.length > 0 ? (
          currentStories.map((story, index) => (
            <div
              key={`${currentSection}-${story.id}`}
              className="story-item"
              onClick={() => handleStoryClick(index)}
            >
              <div className="story-avatar-container">
                <div className="story-avatar-border">
                  <img
                    src={story.profileImage}
                    alt={story.username}
                    className="story-avatar"
                  />
                </div>
                <div className="story-badge">
                  {story.type === "campaign" ? "K" : "H"}
                </div>
              </div>
              <span className="story-username">{story.username}</span>
              <small className="story-type-badge">{story.type}</small>
            </div>
          ))
        ) : (
          <div className="no-stories">
            <p className="text-gray-500">
              {currentSection === "campaigns"
                ? "Henüz kampanya hikayesi bulunmuyor"
                : "Henüz hikaye bulunmuyor"}
            </p>
          </div>
        )}
      </div>

      {/* Fullscreen Story Modal */}
      {currentStoryIndex !== null && currentStories[currentStoryIndex] && (
        <div className="fullscreen-story-modal">
          <div className="fullscreen-story-content" onClick={handleScreenClick}>
            {/* Progress Bar */}
            <div className="fullscreen-progress-container">
              {currentStories.map((_, index) => (
                <div key={index} className="fullscreen-progress-bar">
                  <div
                    className={`fullscreen-progress-fill ${
                      index === currentStoryIndex ? "active" : ""
                    }`}
                    style={{
                      width:
                        index === currentStoryIndex
                          ? `${progress}%`
                          : index < currentStoryIndex
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Main Image */}
            <img
              src={currentStories[currentStoryIndex].image}
              alt={currentStories[currentStoryIndex].title}
              className="fullscreen-story-image"
            />

            {/* Pause Overlay */}
            {!isPlaying && (
              <div className="pause-overlay">
                <div className="pause-icon">
                  <Play size={48} />
                </div>
                <p className="pause-text">Devam etmek için tıklayın</p>
              </div>
            )}

            {/* Play Indicator (subtle hint when playing) */}
            {isPlaying && (
              <div className="play-indicator">
                <p className="play-text">Durdurmak için tıklayın</p>
              </div>
            )}

            {/* Story Info */}
            <div className="fullscreen-story-info">
              <div className="fullscreen-story-header">
                <img
                  src={currentStories[currentStoryIndex].profileImage}
                  alt={currentStories[currentStoryIndex].username}
                  className="fullscreen-profile-image"
                />
                <div className="fullscreen-user-info">
                  <h3 className="fullscreen-username">
                    {currentStories[currentStoryIndex].username}
                  </h3>
                  <span className="fullscreen-story-type">
                    {currentSection === "campaigns" ? "Kampanya" : "Hikaye"}
                  </span>
                </div>
              </div>

              {currentStories[currentStoryIndex].description && (
                <p className="fullscreen-description">
                  {currentStories[currentStoryIndex].description}
                </p>
              )}
            </div>

            {/* Navigation Controls */}
            <div className="fullscreen-navigation">
              <button
                className="fullscreen-nav-button prev"
                onClick={handlePrevious}
                disabled={currentStoryIndex === 0}
              >
                <ChevronLeft size={32} />
              </button>
              <button
                className="fullscreen-nav-button next"
                onClick={handleNext}
                disabled={currentStoryIndex === currentStories.length - 1}
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              className="fullscreen-play-pause-button"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Close Button */}
            <button
              className="fullscreen-close-button"
              onClick={() => setCurrentStoryIndex(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesComponent;
