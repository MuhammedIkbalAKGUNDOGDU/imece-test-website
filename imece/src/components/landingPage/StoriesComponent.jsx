import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const StoriesComponent = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [currentSection, setCurrentSection] = useState("campaigns"); // 'campaigns' or 'stories'
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Default data - later will come from API
  const defaultData = {
    campaigns: [
      {
        id: 1,
        title: "Yeni Ürün Kampanyası",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        duration: 5000,
        description: "En yeni ürünlerimizi keşfedin",
        username: "imecehub",
        profileImage:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: 2,
        title: "İndirim Fırsatları",
        image:
          "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=600&fit=crop",
        duration: 5000,
        description: "%50'ye varan indirimler",
        username: "kampanyalar",
        profileImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: 3,
        title: "Grup Alım Avantajları",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop",
        duration: 5000,
        description: "Birlikte al, daha ucuza al",
        username: "grup_alim",
        profileImage:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
    ],
    stories: [
      {
        id: 1,
        title: "Günlük Fırsatlar",
        image:
          "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=600&fit=crop",
        duration: 5000,
        description: "Bugünün özel teklifleri",
        username: "gunluk_firsatlar",
        profileImage:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: 2,
        title: "Kullanıcı Deneyimleri",
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop",
        duration: 5000,
        description: "Müşterilerimizin hikayeleri",
        username: "kullanici_deneyimleri",
        profileImage:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      {
        id: 3,
        title: "Yeni Özellikler",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        duration: 5000,
        description: "Platform güncellemeleri",
        username: "yeni_ozellikler",
        profileImage:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    ],
  };

  const currentStories = defaultData[currentSection];
  const currentStory = currentStories[currentStoryIndex];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || currentStoryIndex === null) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentStoryIndex < currentStories.length - 1) {
            setCurrentStoryIndex((prev) => prev + 1);
            return 0;
          } else {
            // Loop back to first story
            setCurrentStoryIndex(0);
            return 0;
          }
        }
        return prev + 2; // Increment progress
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStoryIndex, currentStories.length]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex, currentSection]);

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
        {currentStories.map((story, index) => (
          <div
            key={story.id}
            className={`story-item ${
              index === currentStoryIndex ? "active" : ""
            }`}
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
            </div>
            <span className="story-username">{story.username}</span>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {currentStoryIndex !== null && (
        <div
          className="story-modal-overlay"
          onClick={() => setCurrentStoryIndex(null)}
        >
          <div className="story-modal" onClick={(e) => e.stopPropagation()}>
            {/* Progress Bars */}
            <div className="progress-container">
              {currentStories.map((_, index) => (
                <div key={index} className="progress-bar-container">
                  <div
                    className={`progress-bar ${
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

            {/* Story Header */}
            <div className="story-modal-header">
              <div className="story-user-info">
                <img
                  src={currentStory.profileImage}
                  alt={currentStory.username}
                  className="story-user-avatar"
                />
                <span className="story-user-name">{currentStory.username}</span>
              </div>
              <button
                className="story-close-button"
                onClick={() => setCurrentStoryIndex(null)}
              >
                ×
              </button>
            </div>

            {/* Story Content */}
            <div className="story-modal-content">
              <img
                src={currentStory.image}
                alt={currentStory.title}
                className="story-modal-image"
              />

              {/* Story Info */}
              <div className="story-modal-info">
                <h3 className="story-modal-title">{currentStory.title}</h3>
                <p className="story-modal-description">
                  {currentStory.description}
                </p>
              </div>

              {/* Navigation Controls */}
              <div className="story-modal-controls">
                <button
                  className="control-button prev"
                  onClick={handlePrevious}
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  className="control-button play-pause"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button className="control-button next" onClick={handleNext}>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesComponent;
